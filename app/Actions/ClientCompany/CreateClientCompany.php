<?php

namespace App\Actions\ClientCompany;

use App\Models\ClientCompany;
use App\Models\CompanyActivity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CreateClientCompany
{
    public function create(array $data): ClientCompany
    {
        return DB::transaction(function () use ($data) {
            $clientCompany = ClientCompany::create($data);

            if (! empty($data['clients'])) {
                $clientCompany->clients()->attach($data['clients']);
            }

            if (! empty($data['status_id'])) {
                $statusName = optional($clientCompany->status)->name ?? 'a new status';
                $aiMessage = null;

                try {
                    $response = Http::post('http://127.0.0.1:1234/v1/chat/completions', [
                        'model' => 'phi-3.1-mini-128k-instruct',
                        'messages' => [
                            ['role' => 'system', 'content' => 'Be concise and friendly.'],
                            ['role' => 'user', 'content' => "Send a message to '{$clientCompany->name}' saying their status is '{$statusName}'."]
                        ],
                        'temperature' => 0.7,
                        'max_tokens' => 200,
                        'stream' => false,
                    ]);

                    $json = $response->json();
                    $aiMessage = $json['choices'][0]['message']['content'] ?? null;

                    Log::info('[LMStudio] AI on create: ' . $aiMessage);
                } catch (\Exception $e) {
                    Log::error('[LMStudio] ERROR on create: ' . $e->getMessage());
                }

                CompanyActivity::create([
                    'client_company_id' => $clientCompany->id,
                    'user_id' => Auth::id(),
                    'title' => 'Initial status set',
                    'comment' => $aiMessage ?? 'Initial status applied.',
                    'old_status_id' => null,
                    'new_status_id' => $data['status_id'],
                ]);
            }

            return $clientCompany;
        });
    }
}
