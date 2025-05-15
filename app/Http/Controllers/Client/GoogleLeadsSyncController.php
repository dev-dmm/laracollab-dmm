<?php

namespace App\Http\Controllers\Client;

use App\Console\Commands\SyncGoogleSheetClients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class GoogleLeadsSyncController
{
    public function sync(Request $request)
    {
        Artisan::call('leads:sync-google');
        return back()->with('success', 'Google leads synced!');
    }
}

