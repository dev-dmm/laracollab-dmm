<?php

// app/Models/CompanyStatus.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyStatus extends Model
{
    protected $fillable = ['name', 'label', 'color'];

    public function companies()
    {
        return $this->hasMany(ClientCompany::class, 'status_id');
    }
}

