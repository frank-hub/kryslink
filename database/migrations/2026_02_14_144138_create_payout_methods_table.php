<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payout_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['bank', 'mpesa', 'mobile_money'])->default('bank');
            $table->string('bank_name')->nullable(); // e.g., "Standard Chartered"
            $table->string('account_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('mpesa_number')->nullable(); // For M-PESA
            $table->string('till_number')->nullable(); // For M-PESA Till
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payout_methods');
    }
};