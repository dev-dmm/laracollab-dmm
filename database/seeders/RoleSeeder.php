<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public static $roles = [
        'developer',
        'qa engineer',
        'designer',
        'client',
        'manager',
        'admin',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::$roles as $roleName) {
            Role::firstOrCreate(
                ['name' => $roleName, 'guard_name' => 'web']
            );
        }
    }
}
