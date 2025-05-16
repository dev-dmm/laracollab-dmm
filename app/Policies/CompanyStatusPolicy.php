<?php

namespace App\Policies;

use App\Models\CompanyStatus;
use App\Models\User;

class CompanyStatusPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view statuses');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create status');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CompanyStatus $status): bool
    {
        return $user->hasPermissionTo('edit status');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CompanyStatus $status): bool
    {
        return $user->hasPermissionTo('archive status');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CompanyStatus $status): bool
    {
        return $user->hasPermissionTo('restore status');
    }
}
