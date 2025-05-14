<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Marshmallow\FacebookWebhook\Events\WebhookReceived;
use Illuminate\Support\Facades\Log;

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
