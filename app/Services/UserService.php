<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class UserService
{
    /**
     * Store avatar if uploaded by user,
     * from a URL (e.g. Facebook),
     * or fallback to unavatar.io
     */
    public static function storeOrFetchAvatar(User $user, UploadedFile|string|null $avatar): ?string
    {
        $filename = "{$user->id}.jpg";
        $path = "public/avatars/{$filename}";
        $storagePath = storage_path("app/{$path}");

        // ✅ 1. Uploaded via form
        if ($avatar instanceof UploadedFile) {
            $avatar->storePubliclyAs('public/avatars', $filename);

            return "/storage/avatars/{$filename}";
        }

        // ✅ 2. Facebook or other image URL
        if (is_string($avatar) && filter_var($avatar, FILTER_VALIDATE_URL)) {
            try {
                $contents = Http::timeout(10)->get($avatar)->body();
                File::put($storagePath, $contents);

                return "/storage/avatars/{$filename}";
            } catch (\Exception $e) {
                return null;
            }
        }

        // ✅ 3. Fallback to unavatar.io
        try {
            $response = Http::timeout(20)
                ->sink($storagePath)
                ->get("https://unavatar.io/{$user->email}?fallback=false");

            if ($response->successful()) {
                return "/storage/avatars/{$filename}";
            } else {
                File::delete($storagePath);

                return null;
            }
        } catch (\Exception $e) {
            return null;
        }
    }
}
