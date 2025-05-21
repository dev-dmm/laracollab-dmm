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
                    ['role' => 'system', 'content' => 'You are a friendly assistant sending updates to company owners.'],
                    ['role' => 'user', 'content' => "Write a short, polite message to '{$companyName}' confirming we received their application and have updated their status to contacted."],
                ],
                'temperature' => 0.7,
                'max_tokens' => 100,
                'stream' => false,
            ]);

            $json = $response->json();

            return $json['choices'][0]['message']['content'] ?? "Hello {$companyName}, your status is now 'contacted'.";

        } catch (\Throwable $e) {
            Log::error('[AI Message Error] '.$e->getMessage());

            return "Hello {$companyName}, your status is now 'contacted'.";
        }
    }
}
