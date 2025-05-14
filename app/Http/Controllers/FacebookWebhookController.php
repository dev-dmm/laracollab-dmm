<?php

namespace App\Http\Controllers;

use App\Actions\Client\CreateClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FacebookWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // ✅ Step 1: Webhook verification (GET)
        if ($request->isMethod('get')) {
            $verify_token = env('FACEBOOK_WEBHOOK_VERIFY_TOKEN');
            if ($request->input('hub_verify_token') === $verify_token) {
                return response($request->input('hub_challenge'), 200);
            }

            return response('Invalid verification token', 403);
        }

        // ✅ Step 2: Log incoming POST from Facebook
        Log::info('Facebook Lead Webhook Payload', $request->all());

        file_put_contents(
            storage_path('logs/fb_request_dump.txt'),
            print_r($request->all(), true) . "\n\n",
            FILE_APPEND
        );

        // ✅ Step 3: Extract leadgen_id
        $leadgenId = $request->input('entry.0.changes.0.value.leadgen_id');
        if (!$leadgenId) {
            Log::warning('No leadgen_id found in Facebook webhook');
            return response()->json(['error' => 'leadgen_id not found'], 400);
        }

        // ✅ Step 4: Get user token and fetch page token
        $userAccessToken = env('FACEBOOK_USER_ACCESS_TOKEN'); // <-- must be set from Socialite output
        $pageId = env('FACEBOOK_PAGE_ID');

        $pagesResponse = Http::get('https://graph.facebook.com/v22.0/me/accounts', [
            'access_token' => $userAccessToken,
        ]);

        if (!$pagesResponse->successful()) {
            Log::error('❌ Failed to fetch pages from user token', [
                'error' => $pagesResponse->json(),
            ]);
            return response()->json(['error' => 'Could not fetch pages'], 500);
        }

        $pages = collect($pagesResponse->json()['data']);
        $page = $pages->firstWhere('id', $pageId);

        if (!$page) {
            Log::error('❌ Page not found for given PAGE_ID', ['page_id' => $pageId]);
            return response()->json(['error' => 'Page not found'], 404);
        }

        $pageAccessToken = $page['access_token'];

        // ✅ Step 5: Fetch lead details
        $version = env('FACEBOOK_GRAPH_API_VERSION', 'v22.0');

        $response = Http::get("https://graph.facebook.com/{$version}/{$leadgenId}", [
            'access_token' => $pageAccessToken,
        ]);

        if (!$response->successful()) {
            Log::error('Failed to fetch lead data', [
                'leadgen_id' => $leadgenId,
                'error' => $response->json(),
            ]);

            return response()->json(['error' => 'Could not fetch lead data'], 500);
        }

        $leadData = $response->json();

        // ✅ Step 6: Parse lead fields into array
        $fields = collect($leadData['field_data'] ?? [])->mapWithKeys(function ($field) {
            return [$field['name'] => $field['values'][0] ?? null];
        })->toArray();

        // ✅ Step 7: Prepare data for client creation
        $clientData = [
            'name' => $fields['full_name'] ?? 'FB Lead',
            'email' => $fields['email'] ?? (Str::uuid() . '@lead.local'),
            'phone' => $fields['phone_number'] ?? null,
            'password' => Str::random(12),
            'avatar' => null,
            'companies' => [],
        ];

        Log::info('Parsed client data from lead form', $clientData);

        // ✅ Step 8: Create the client
        try {
            $user = app(CreateClient::class)->create($clientData);
            Log::info('✅ Facebook Lead created client', ['user_id' => $user->id]);
        } catch (\Throwable $e) {
            Log::error('❌ Failed to create client from Facebook lead', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'Failed to create client'], 500);
        }

        return response()->json(['status' => 'Client created successfully'], 200);
    }
}
