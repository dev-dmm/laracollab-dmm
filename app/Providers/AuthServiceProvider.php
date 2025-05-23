<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\ClientCompany;
use App\Models\User;
use App\Policies\ClientCompanyPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        ClientCompany::class => ClientCompanyPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Gate::before(function ($user, $ability) {
        //     return $user->hasRole('admin') ? true : null;
        // });

        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return route('auth.newPassword.form', ['token' => $token]);
        });
    }
}
