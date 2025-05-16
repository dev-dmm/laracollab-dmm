<?php

namespace Database\Seeders;

use App\Models\CompanyStatus;
use Illuminate\Database\Seeder;

class CompanyStatusSeeder extends Seeder
{
    public function run(): void
    {
        CompanyStatus::insert([
            ['name' => 'active', 'color' => 'green'],
            ['name' => 'archived', 'color' => 'red'],
            ['name' => 'pending', 'color' => 'yellow'],
        ]);
    }
}
