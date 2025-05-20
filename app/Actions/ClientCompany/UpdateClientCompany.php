<?php

namespace App\Actions\ClientCompany;

use App\Models\ClientCompany;
use App\Models\CompanyActivity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UpdateClientCompany
{
    public function update(ClientCompany $clientCompany, array $data): bool
    {
        $originalStatus = $clientCompany->status_id;

        if (! empty($data['clients'])) {
            $clientCompany->clients()->sync($data['clients']);
        }

        $statusChanged = $originalStatus != $data['status_id'];

        $updated = $clientCompany->update($data);

        if ($statusChanged) {
            Log::info('Status changed', [
                'company_id' => $clientCompany->id,
                'old_status_id' => $originalStatus,
                'new_status_id' => $data['status_id'],
            ]);

            CompanyActivity::create([
                'client_company_id' => $clientCompany->id,
                'user_id' => Auth::id(),
                'title' => 'Status changed',
                'comment' => $data['status_change_comment'] ?? null,
                'old_status_id' => $originalStatus,
                'new_status_id' => $data['status_id'],
            ]);
        }

        return $updated;
    }
}
