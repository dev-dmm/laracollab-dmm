<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyActivity extends Model
{
    protected $fillable = [
        'client_company_id',
        'user_id',
        'title',
        'comment',
        'old_status_id',
        'new_status_id',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(ClientCompany::class, 'client_company_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function old_status()
    {
        return $this->belongsTo(CompanyStatus::class, 'old_status_id');
    }

    public function new_status()
    {
        return $this->belongsTo(CompanyStatus::class, 'new_status_id');
    }
}
