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
        // ✅ Step 1: Handle webhook verification (GET)
        if ($request->isMethod('get')) {
            $verify_token = 'ASDa123AsdASDA1414asdA'; // same as in Facebook webhook settings
            if ($request->input('hub_verify_token') === $verify_token) {
                return response($request->input('hub_challenge'), 200);
            }
            return response('Invalid verification token', 403);
        }

        // ✅ Step 2: Log raw Facebook payload
        Log::info('FB Raw Payload', $request->all());

        // ✅ Step 3: Get leadgen ID
        $leadgenId = $request->input('entry.0.changes.0.value.leadgen_id');
        if (!$leadgenId) {
            return response()->json(['error' => 'leadgen_id not found'], 400);
        }

        // ✅ Step 4: Call Graph API to get full lead data
        $accessToken = env('FACEBOOK_PAGE_ACCESS_TOKEN');
        $response = Http::get("https://graph.facebook.com/v18.0/{$leadgenId}", [
            'access_token' => $accessToken
        ]);

        if (!$response->successful()) {
            Log::error('Failed to fetch lead data', [
                'leadgen_id' => $leadgenId,
                'error' => $response->json()
            ]);
            return response()->json(['error' => 'Could not fetch lead data'], 500);
        }

        $leadData = $response->json();

        // ✅ Step 5: Parse field_data into simple key/value array
        $fields = collect($leadData['field_data'] ?? [])->mapWithKeys(function ($field) {
            return [$field['name'] => $field['values'][0] ?? null];
        })->toArray();

        // ✅ Step 6: Build client data array
        $clientData = [
            'name' => $fields['full_name'] ?? 'FB Lead',
            'email' => $fields['email'] ?? Str::uuid() . '@lead.local',
            'phone' => $fields['phone_number'] ?? null,
            'password' => Str::random(12),
            'avatar' => null,
            'companies' => [],
        ];

        // ✅ Step 7: Log parsed data
        Log::info('Parsed Client Data', $clientData);

        // ✅ Step 8: Create the client
        try {
            $user = app(CreateClient::class)->create($clientData);
            Log::info("Client created from Facebook lead", ['user_id' => $user->id]);
        } catch (\Exception $e) {
            Log::error('Failed to create client from Facebook lead', ['exception' => $e]);
            return response()->json(['error' => 'Failed to create client'], 500);
        }

        return response()->json(['status' => 'client created'], 200);
    }
}
