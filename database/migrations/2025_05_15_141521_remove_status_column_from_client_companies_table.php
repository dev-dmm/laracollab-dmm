<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('client_companies', function (Blueprint $table) {
            if (Schema::hasColumn('client_companies', 'status')) {
                $table->dropColumn('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('client_companies', function (Blueprint $table) {
            //
        });
    }
};
