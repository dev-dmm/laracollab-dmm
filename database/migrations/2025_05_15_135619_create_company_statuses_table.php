<?php

// database/migrations/xxxx_xx_xx_create_company_statuses_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g. 'active'
            $table->string('color')->nullable(); // optional badge color like 'green'
            $table->timestamps();
        });

        // Alter client_companies table
        Schema::table('client_companies', function (Blueprint $table) {
            $table->foreignId('status_id')->nullable()->constrained('company_statuses');
        });
    }

    public function down(): void
    {
        Schema::table('client_companies', function (Blueprint $table) {
            $table->dropConstrainedForeignId('status_id');
        });

        Schema::dropIfExists('company_statuses');
    }
};
