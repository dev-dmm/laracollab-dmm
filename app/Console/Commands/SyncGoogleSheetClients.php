<?php

namespace App\Console\Commands;

use App\Actions\Client\CreateClient;
use Google_Client;
use Google_Service_Sheets;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class SyncGoogleSheetClients extends Command
{
    protected $signature = 'leads:sync-google';
    protected $description = 'Import leads from Google Sheet and create clients';

    public function handle()
    {
        $sheetId = env('GOOGLE_SHEET_ID');
        $range = 'Sheet1'; // Adjust if your tab name is different

        $client = new Google_Client();
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
            fn($h) => strtolower(Str::slug(trim($h), '_')),
            $rows[0]
        );

        foreach (array_slice($rows, 1) as $row) {
            $data = array_combine($headers, array_pad($row, count($headers), null));

            Log::info('🔍 Parsed Sheet Row', $data); // 👈 Add this

            if (empty($data['email'])) {
                Log::warning('⛔ Missing email, skipping row');
                continue;
            }

            $exists = \App\Models\User::where('email', $data['email'])->exists();

            if ($exists) {
                Log::warning("⚠️ Duplicate skipped: {$data['email']}");
                continue;
            }

            try {
                app(\App\Actions\Client\CreateClient::class)->create([
                    'name' => $data['full name'] ?? 'Sheet Lead', // 👈 make sure this matches your sheet header exactly
                    'email' => $data['email'],
                    'phone' => $data['phone_number'] ?? null,
                    'password' => \Str::random(12),
                    'avatar' => null,
                    'companies' => [],
                ]);

                Log::info("✅ Client created: {$data['email']}");
            } catch (\Throwable $e) {
                Log::error('❌ Failed to create client from sheet row', [
                    'email' => $data['email'] ?? 'unknown',
                    'error' => $e->getMessage()
                ]);
            }
        }


        $this->info('✅ Sync complete.');
    }
}
