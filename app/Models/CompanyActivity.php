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
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(ClientCompany::class, 'client_company_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
