<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('facebook_tokens', function (Blueprint $table) {
            $table->string('facebook_user_id')->after('id')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('facebook_tokens', function (Blueprint $table) {
            $table->dropColumn('facebook_user_id');
        });
    }
};
