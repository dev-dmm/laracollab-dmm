<?php

namespace Database\Seeders;

use App\Models\CompanyStatus;
use Illuminate\Database\Seeder;

class CompanyStatusSeeder extends Seeder
{
    public function run(): void
    {
        CompanyStatus::insert([
            ['name' => 'active', 'label' => 'Active', 'color' => 'green'],
            ['name' => 'archived', 'label' => 'Archived', 'color' => 'red'],
            ['name' => 'pending', 'label' => 'Pending', 'color' => 'yellow'],
        ]);
    }
}
