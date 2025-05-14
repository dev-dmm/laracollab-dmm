<?php

namespace App\Actions\Client;

use App\Events\UserCreated;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateClient
{
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // ✅ Prevent duplicate clients by email
            $existing = User::where('email', $data['email'])->first();
            if ($existing) {
                return $existing; // or throw if you want to block duplicates
            }

            // ✅ Create the user
            $user = User::create([
                'name' => $data['name'],
                'job_title' => 'Client',
                'phone' => $data['phone'],
                'rate' => null,
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'source' => $data['source'] ?? 'manual', // ✅ Add this column via migration
            ]);

            // ✅ Set avatar if provided
            $user->update([
                'avatar' => UserService::storeOrFetchAvatar($user, $data['avatar']),
            ]);

            // ✅ Assign "client" role
            $user->assignRole('client');

            // ✅ Attach to companies if passed
            if (! empty($data['companies'])) {
                $user->clientCompanies()->attach($data['companies']);
            }

            // ✅ Send welcome email unless explicitly skipped
            if (! isset($data['send_email']) || $data['send_email'] !== false) {
                UserCreated::dispatch($user, $data['password']);
            }

            return $user;
        });
    }
}
