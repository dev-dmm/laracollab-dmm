<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FacebookWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('Facebook Lead Received:', $request->all());

        // Example: Save lead data
        // Lead::create([
        //     'name' => $request->input('field_name'),
        //     ...
        // ]);

        return response()->json(['status' => 'received'], 200);
    }
}
