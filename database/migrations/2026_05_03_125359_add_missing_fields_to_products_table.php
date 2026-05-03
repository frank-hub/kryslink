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
        Schema::table('products', function (Blueprint $table) {
            $table->string('manufacturer')->nullable()->after('form');
            $table->string('country_of_origin')->nullable()->after('manufacturer');
            $table->string('batch_number')->nullable()->after('country_of_origin');
            $table->date('expiry_date')->nullable()->after('batch_number');
            $table->boolean('requires_prescription')->default(false)->after('expiry_date');
            $table->boolean('requires_cold_chain')->default(false)->after('requires_prescription');
            $table->json('documents')->nullable()->after('images');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'manufacturer', 'country_of_origin', 'batch_number',
                'expiry_date', 'requires_prescription', 'requires_cold_chain',
                'documents',
            ]);
        });
    }
};
