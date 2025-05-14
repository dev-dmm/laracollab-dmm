<?php

namespace App\Listeners;

use Illuminate\Support\Facades\Log;
use Marshmallow\FacebookWebhook\Events\WebhookReceived;

class FacebookLeadReceived
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(WebhookReceived $event)
    {
        Log::info('Facebook Lead Webhook:', $event->payload);
    }
}
