<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientLead extends Model
{
    protected $fillable = ['client_id', 'metadata'];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}
