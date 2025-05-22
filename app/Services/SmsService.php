<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;

class SmsService
{
    protected Client $twilio;

    public function __construct()
    {
        $this->twilio = new Client(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
    }

    public function send(string $to, string $message): bool
    {
        try {
            $this->twilio->messages->create($to, [
                'from' => config('services.twilio.from'),
                'body' => $message,
            ]);
            Log::info("📤 SMS sent to {$to}: {$message}");

            return true;
        } catch (\Throwable $e) {
            Log::error("❌ SMS failed to {$to}: {$e->getMessage()}");

            return false;
        }
    }
}
