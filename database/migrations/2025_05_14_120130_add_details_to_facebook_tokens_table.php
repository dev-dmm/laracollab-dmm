<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('facebook_tokens', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('user_token', 1000)->nullable();
            $table->string('page_id')->nullable();
            $table->string('page_name')->nullable();
            $table->string('page_token', 1000)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('facebook_tokens', function (Blueprint $table) {
            $table->dropColumn([
                'name', 'email', 'user_token', 'page_id', 'page_name', 'page_token'
            ]);
        });
    }
};
