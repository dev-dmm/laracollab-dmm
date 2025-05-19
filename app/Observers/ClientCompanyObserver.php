<?php

// app/Observers/ClientCompanyObserver.php

namespace App\Observers;

use App\Models\ClientCompany;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ClientCompanyObserver
{
    public function updated(ClientCompany $company)
    {
        if ($company->isDirty('status_id')) {
            $name = $company->name;
            $statusName = optional($company->status)->name ?? 'a new status';

            $messages = [
                ['role' => 'system', 'content' => 'Always answer in a friendly and concise tone.'],
                ['role' => 'user', 'content' => "Write a message to the company '{$name}' saying their status changed to '{$statusName}'."],
            ];

            try {
                $response = Http::post('http://127.0.0.1:1234/v1/chat/completions', [
                    'model' => 'phi-3.1-mini-128k-instruct', // or whatever model you’ve loaded
                    'messages' => [
                        ['role' => 'system', 'content' => 'Be brief and helpful.'],
                        ['role' => 'user', 'content' => "Send a message to '{$company->name}' saying their status changed to '{$statusName}'."],
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 200,
                    'stream' => false,
                ]);

                Log::info('[LM Studio] AI Response: '.$response->body());

                $json = $response->json();
                $aiMessage = $json['choices'][0]['message']['content'] ?? 'No response from LM Studio.';

                Log::info('[LMStudio] Final AI message: '.$aiMessage);
            } catch (\Exception $e) {
                Log::error('[LMStudio] ERROR: '.$e->getMessage());
            }
        }
    }
}
