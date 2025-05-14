<?php

namespace App\Console\Commands;

use Google_Client;
use Google_Service_Sheets;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Actions\Client\CreateClient;
use App\Models\User;

class SyncGoogleSheetClients extends Command
{
    protected $signature = 'leads:sync-google';
    protected $description = 'Import leads from Google Sheet and create clients';

    public function handle()
    {
        $sheetId = env('GOOGLE_SHEET_ID');
        $range = 'Sheet1';

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

            Log::info('🧩 Sheet Row Keys', array_keys($data));
            Log::info('📞 Raw phone input', ['raw' => $data['phone_number'] ?? 'MISSING']);

            if (empty($data['email'])) {
                Log::warning('⛔ Missing email, skipping row');
                continue;
            }

            if (User::where('email', $data['email'])->exists()) {
                Log::warning("⚠️ Duplicate skipped: {$data['email']}");
                continue;
            }

            $cleanPhone = isset($data['phone_number']) 
                ? preg_replace('/^p:\s*/i', '', trim($data['phone_number'])) 
                : null;

            try {
                app(CreateClient::class)->create([
                    'name' => $data['full_name'] ?? $data['full name'] ?? 'Sheet Lead',
                    'email' => $data['email'],
                    'phone' => $cleanPhone,
                    'password' => Str::random(12),
                    'avatar' => null,
                    'companies' => [],
                ]);

                Log::info("✅ Client created: {$data['email']}");
            } catch (\Throwable $e) {
                Log::error('❌ Failed to create client from sheet row', [
                    'email' => $data['email'] ?? 'unknown',
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info('✅ Sync complete.');
    }
}
