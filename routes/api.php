<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FacebookWebhookController;

Route::match(['get', 'post'], '/v1/facebook_webhook', [FacebookWebhookController::class, 'handle']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
