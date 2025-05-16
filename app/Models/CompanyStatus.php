<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Lacodix\LaravelModelFilter\Traits\IsSearchable;
use Lacodix\LaravelModelFilter\Traits\IsSortable;
use LaravelArchivable\Archivable;

class CompanyStatus extends Model
{
    use Archivable, IsSearchable, IsSortable;

    protected $fillable = ['name', 'label', 'color'];

    protected $searchable = ['name'];

    protected $sortable = ['name', 'label', 'color'];

    public function companies()
    {
        return $this->hasMany(ClientCompany::class, 'status_id');
    }
}
