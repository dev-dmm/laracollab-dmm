<?php

namespace App\Actions\ClientCompany;

use App\Models\ClientCompany;
use App\Models\CompanyActivity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreateClientCompany
{
    public function create(array $data): ClientCompany
    {
        return DB::transaction(function () use ($data) {
            $clientCompany = ClientCompany::create($data);

            if (! empty($data['clients'])) {
                $clientCompany->clients()->attach($data['clients']);
            }

            if (! empty($data['status_id'])) {
                CompanyActivity::create([
                    'client_company_id' => $clientCompany->id,
                    'user_id' => Auth::id(),
                    'title' => 'Initial status set',
                    'comment' => 'Initial status applied.',
                    'old_status_id' => null,
                    'new_status_id' => $data['status_id'],
                ]);
            }

            return $clientCompany;
        });
    }
}
