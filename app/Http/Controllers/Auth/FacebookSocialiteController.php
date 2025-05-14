<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Client\CreateClient;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class FacebookSocialiteController
{
    public function redirect()
    {
        return Socialite::driver('facebook')
            ->scopes([
                'email',
                'pages_show_list',
                'pages_read_engagement',
                'leads_retrieval',
                'pages_manage_ads',
            ])
            ->stateless()
            ->redirect();
    }

    public function callback()
    {
        $user = Socialite::driver('facebook')->stateless()->user();

        // Fetch page token
        $pages = Http::get('https://graph.facebook.com/v22.0/me/accounts', [
            'access_token' => $user->token,
        ])->json()['data'];

        $page = collect($pages)->first();

        if (! $page) {
            return response()->json(['error' => 'No Facebook page access'], 403);
        }

        // Save user + page token
        DB::table('facebook_tokens')->updateOrInsert([
            'facebook_user_id' => $user->getId(),
        ], [
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'user_token' => $user->token,
            'access_type' => 'page',
            'token_type' => 'user',
            'facebook_id' => $user->getId(),
            'access_token' => $page['access_token'],
            'page_id' => $page['id'],
            'page_name' => $page['name'],
            'page_token' => $page['access_token'],
            'expires_at' => now()->addDays(60),
            'updated_at' => now(),
        ]);

        // ✅ Always try to create (CreateClient handles duplicates now)
        app(CreateClient::class)->create([
            'name' => $user->getName(),
            'email' => $user->getEmail() ?? Str::uuid().'@facebook.local',
            'phone' => null,
            'password' => Str::random(12),
            'avatar' => $user->avatar,
            'companies' => [],
            'source' => 'facebook',          // ✅ Track origin
            'send_email' => false,            // ✅ Don't send email for social login
        ]);

        return redirect('/dashboard')->with('success', 'Facebook client synced.');
    }
}
