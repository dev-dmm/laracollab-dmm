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
            CompanyActivity::create([
                'client_company_id' => $clientCompany->id,
                'user_id' => Auth::id(),
                'title' => 'Status changed to ' . CompanyStatus::find($data['status_id'])->label,
                'comment' => $data['status_change_comment'] ?? null,
            ]);
        }

        return $clientCompany->update($data);
    }
}
