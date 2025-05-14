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
        Schema::create('facebook_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('facebook_user_id')->unique();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('user_token', 1000);
            $table->string('page_id');
            $table->string('page_name');
            $table->string('page_token', 1000);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facebook_tokens');
    }
};
