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
        Schema::create('company_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_company_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Add these lines
            $table->foreignId('old_status_id')->nullable()->constrained('company_statuses')->nullOnDelete();
            $table->foreignId('new_status_id')->nullable()->constrained('company_statuses')->nullOnDelete();

            $table->string('title');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_activities');
    }
};
