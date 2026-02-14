<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_reference')->unique(); // TXN-88291
            $table->foreignId('supplier_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['order_income', 'payout', 'refund', 'adjustment'])->default('order_income');
            $table->decimal('amount', 15, 2); // Positive for income, negative for payout
            $table->string('reference_type')->nullable(); // 'order', 'payout', etc.
            $table->string('reference_id')->nullable(); // Order ID or Payout ID
            $table->enum('status', ['pending', 'completed', 'failed'])->default('completed');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};