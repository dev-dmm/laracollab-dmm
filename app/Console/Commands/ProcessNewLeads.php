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
        $newLeadStatusId = CompanyStatus::where('name', 'new_lead')->value('id');
        $contactedStatusId = CompanyStatus::where('name', 'contacted')->value('id');

        if (! $newLeadStatusId || ! $contactedStatusId) {
            $this->error('❌ Statuses not found.');
            return Command::FAILURE;
        }

        $ai = new AiMessageService();

        $companies = ClientCompany::where('status_id', $newLeadStatusId)
            ->where('created_at', '<=', now()->subMinutes(10))
            ->get();

        foreach ($companies as $company) {
            $company->update(['status_id' => $contactedStatusId]);

            $message = $ai->generateContactedMessage($company->name);
            $owner = $company->clients()->first();

            if ($owner && $owner->phone) {
                SendSmsToClient::dispatch($owner->phone, $message);
            } else {
                Log::warning("⚠️ No phone for owner of company {$company->name}");
            }

            Log::info("✅ Updated {$company->name} and dispatched SMS job.");
        }

        return Command::SUCCESS;
    }

}