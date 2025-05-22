<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ClientCompany;
use App\Models\CompanyStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Services\AiMessageService;
use App\Jobs\SendSmsToClient;

class ProcessNewLeads extends Command
{
    protected $signature = 'leads:process-new';
    protected $description = 'Convert new_lead companies to contacted after 10 minutes';

    public function handle()
    {
        Log::info('🟡 Starting leads:process-new command');

        $newLeadStatusId = CompanyStatus::where('name', 'new_lead')->value('id');
        $contactedStatusId = CompanyStatus::where('name', 'contacted')->value('id');

        Log::info("🔎 Status IDs → new_lead: {$newLeadStatusId}, contacted: {$contactedStatusId}");

        if (! $newLeadStatusId || ! $contactedStatusId) {
            Log::error('❌ Could not find new_lead or contacted status IDs.');
            $this->error('Status error.');
            return Command::FAILURE;
        }

        $companies = ClientCompany::where('status_id', $newLeadStatusId)
            ->where('created_at', '<=', now()->subMinutes(10))
            ->get();

        Log::info("📦 Found {$companies->count()} companies to process");

        $ai = new AiMessageService();

        foreach ($companies as $company) {
            Log::info("🛠️ Processing company #{$company->id} ({$company->name})");

            $company->update(['status_id' => $contactedStatusId]);
            Log::info("✅ Updated status to 'contacted'");

            $owner = $company->clients()->first();

            if (! $owner) {
                Log::warning("⚠️ No client attached to company {$company->id}");
                continue;
            }

            Log::info("📱 Owner found: {$owner->name} - {$owner->phone}");

            if (! $owner->phone) {
                Log::warning("⚠️ No phone number for user {$owner->id}");
                continue;
            }

            $message = $ai->generateContactedMessage($company->name);
            Log::info("💬 AI message: {$message}");

            try {
                SendSmsToClient::dispatch($owner->phone, $message);
                Log::info("📨 SMS job dispatched to {$owner->phone}");
            } catch (\Throwable $e) {
                Log::error("❌ Failed to dispatch SMS job: " . $e->getMessage());
            }
        }

        Log::info('✅ leads:process-new command complete');
        return Command::SUCCESS;
    }

}