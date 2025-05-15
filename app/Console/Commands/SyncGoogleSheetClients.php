<?php

namespace App\Console\Commands;

use App\Models\ClientLead;
use App\Models\User; // new model to track dynamic lead metadata
use Google_Client;
use Google_Service_Sheets;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SyncGoogleSheetClients extends Command
{
    protected $signature = 'leads:sync-google';

    protected $description = 'Import leads from Google Sheet and create clients with dynamic metadata';

    public function handle()
    {
        $sheetId = config('services.google.sheet_id');
        $range = 'Sheet1';

        $client = new Google_Client;
        $client->setApplicationName('Laravel Google Sheets');
        $client->setScopes([Google_Service_Sheets::SPREADSHEETS_READONLY]);
        $client->setAuthConfig(storage_path('app/google/service-account.json'));
        $service = new Google_Service_Sheets($client);

        $response = $service->spreadsheets_values->get($sheetId, $range);
        $rows = $response->getValues();

        if (count($rows) < 2) {
            $this->warn('No data found in sheet.');

            return;
        }

        $headers = array_map(
            fn ($h) => strtolower(Str::slug(trim($h), '_')),
            $rows[0]
        );

        foreach (array_slice($rows, 1) as $row) {
            $data = array_combine($headers, array_pad($row, count($headers), null));

            $email = $data['email'] ?? null;
            if (empty($email)) {
                Log::warning('⛔ Missing email, skipping row');

                continue;
            }

            $name = $data['full_name'] ?? $data['full name'] ?? 'Sheet Lead';
            $cleanPhone = isset($data['phone_number'])
                ? preg_replace('/^p:\s*/i', '', trim($data['phone_number']))
                : null;

            // Check or create user
            $user = User::firstOrCreate([
                'email' => $email,
            ], [
                'name' => $name,
                'phone' => $cleanPhone,
                'password' => Str::random(12),
                'avatar' => null,
                'job_title' => 'Client',
            ]);

            if (! $user->hasRole('client')) {
                $user->assignRole('client');
            }

            // Skip creating duplicate metadata for existing users
            if (ClientLead::where('client_id', $user->id)->exists()) {
                Log::info("🔁 Lead metadata already exists for {$email}, skipping");

                continue;
            }

            // Save remaining sheet fields to metadata
            $metadata = collect($data)->except(['email', 'full_name', 'full name', 'phone_number']);

            ClientLead::create([
                'client_id' => $user->id,
                'metadata' => $metadata,
            ]);

            Log::info("✅ Client created and metadata saved: {$email}");
        }

        $this->info('✅ Sync complete.');
    }
}
