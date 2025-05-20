<?php

namespace App\Observers;

use App\Models\ClientCompany;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client as TwilioClient;

class ClientCompanyObserver
{
    public function updated(ClientCompany $company)
    {
        if ($company->isDirty('status_id') && $company->status?->name === 'sms') {
            try {
                $response = Http::post('http://127.0.0.1:1234/v1/chat/completions', [
                    'model' => 'phi-3.1-mini-128k-instruct',
                    'messages' => [
                        ['role' => 'system', 'content' => 'Be brief, friendly and speak as a polite assistant.'],
                        ['role' => 'user', 'content' => "Write a concise SMS message to '{$company->name}' saying their status has been updated to 'SMS' status."],
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 160, // Shorter for SMS
                    'stream' => false,
                ]);

                $json = $response->json();
                $aiMessage = $json['choices'][0]['message']['content'] ?? 'Your company status has been updated to SMS status.';

                Log::info('[LMStudio] AI Message: '.$aiMessage);

                // Send SMS via Twilio
                $twilio = new TwilioClient(
                    config('services.twilio.sid'),
                    config('services.twilio.token')
                );

                $twilio->messages->create('+306946051659', [
                    'messagingServiceSid' => config('services.twilio.messaging_service_sid'),
                    'body' => $aiMessage,
                ]);

                Log::info('[Twilio] SMS sent to +306946051659');

            } catch (\Exception $e) {
                Log::error('[SMS Notification] Failed: '.$e->getMessage());
            }
        }
    }
}
