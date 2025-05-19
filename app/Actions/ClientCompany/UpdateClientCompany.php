<?php

namespace App\Actions\ClientCompany;

use App\Models\ClientCompany;
use App\Models\CompanyActivity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UpdateClientCompany
{
    public function update(ClientCompany $clientCompany, array $data): bool
    {
        $originalStatus = $clientCompany->status_id;

        if (! empty($data['clients'])) {
            $clientCompany->clients()->sync($data['clients']);
        }

        $statusChanged = $originalStatus != $data['status_id'];

        $updated = $clientCompany->update($data);

        if ($statusChanged) {
            logger()->info('STATUS CHANGE', [
                'old' => $originalStatus,
                'new' => $data['status_id'],
            ]);

            $aiMessage = null;

            try {
                $name = $clientCompany->name;
                $newStatusName = optional($clientCompany->status)->name ?? 'a new status';

                $response = Http::post('http://127.0.0.1:1234/v1/chat/completions', [
                    'model' => 'phi-3.1-mini-128k-instruct',
                    'messages' => [
                        ['role' => 'system', 'content' => 'Be concise, friendly and speak as a polite assistant.'],
                        ['role' => 'user', 'content' => "Send a message to '{$name}' saying their status changed to '{$newStatusName}'."],
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 200,
                    'stream' => false,
                ]);

                $json = $response->json();
                $aiMessage = $json['choices'][0]['message']['content'] ?? null;

                Log::info('[LMStudio] AI Message: '.$aiMessage);
            } catch (\Exception $e) {
                Log::error('[LMStudio] ERROR: '.$e->getMessage());
            }

            CompanyActivity::create([
                'client_company_id' => $clientCompany->id,
                'user_id' => Auth::id(),
                'title' => 'Status changed',
                'comment' => $aiMessage ?? $data['status_change_comment'] ?? null,
                'old_status_id' => $originalStatus,
                'new_status_id' => $data['status_id'],
            ]);

            logger()->info('STATUS CHANGE DEBUG', [
                'company_id' => $clientCompany->id,
                'old_status_id' => $originalStatus,
                'new_status_id' => $data['status_id'],
            ]);
        }

        return $updated;
    }
}
