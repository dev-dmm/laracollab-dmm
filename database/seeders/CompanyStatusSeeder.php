<?php

namespace Database\Seeders;

use App\Models\CompanyStatus;
use Illuminate\Database\Seeder;

class CompanyStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['name' => 'new_lead', 'color' => '#1E90FF'],
            ['name' => 'contacted', 'color' => '#20B2AA'],
            ['name' => 'active', 'color' => '#008000'],
            ['name' => 'pending', 'color' => '#FFFF00'],
            ['name' => 'archived', 'color' => '#FF0000'],
        ];

        foreach ($statuses as $status) {
            CompanyStatus::updateOrInsert(
                ['name' => $status['name']],
                ['color' => $status['color']]
            );
        }
    }
}
