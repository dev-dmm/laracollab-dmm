<?php

namespace App\Actions\ClientCompany;

use App\Models\ClientCompany;
use App\Models\CompanyStatus;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyActivity;

class UpdateClientCompany
{
    public function update(ClientCompany $clientCompany, array $data): bool
    {
        if (! empty($data['clients'])) {
            $clientCompany->clients()->sync($data['clients']);
        }

        // Check for status change
        if ($clientCompany->status_id != $data['status_id']) {
            logger()->info('STATUS CHANGE', [
                'old' => $clientCompany->status_id,
                'new' => $data['status_id'],
            ]);

            CompanyActivity::create([
                'client_company_id' => $clientCompany->id,
                'user_id' => Auth::id(),
                'title' => 'Status changed',
                'comment' => $data['status_change_comment'] ?? null,
                'old_status_id' => $clientCompany->status_id,
                'new_status_id' => $data['status_id'],
            ]);

            logger()->info('STATUS CHANGE DEBUG', [
                'company_id' => $clientCompany->id,
                'old_status_id' => $clientCompany->status_id,
                'new_status_id' => $data['status_id'],
            ]);
        }

        return $clientCompany->update($data);
    }
}
