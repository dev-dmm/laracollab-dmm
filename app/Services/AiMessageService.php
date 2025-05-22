<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiMessageService
{
    public function generateContactedMessage(string $companyName): string
    {
        try {
            $response = Http::post('http://127.0.0.1:1234/v1/chat/completions', [
                'model' => 'phi-3.1-mini-128k-instruct',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a friendly assistant creating SMS updates.',
                    ],
                    [
                        'role' => 'user',
                        'content' => "Write a polite, friendly SMS under 70 characters for '{$companyName}' saying their status is now 'contacted'.",
                    ],
                ],
                'temperature' => 0.5,
                'max_tokens' => 70,
                'stream' => false,
            ]);

            $json = $response->json();

            return $json['choices'][0]['message']['content'] ?? "Hi {$companyName}, you're now marked as contacted.";

        } catch (\Throwable $e) {
            Log::error('[AI Message Error] '.$e->getMessage());

            return "Hi {$companyName}, you're now marked as contacted.";
        }
    }
}
