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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_reference')->unique(); // e.g., ORD-2024-001
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The Buyer
            $table->foreignId('supplier_id')->constrained('users')->onDelete('cascade'); // The Seller

            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2);
            $table->decimal('total_amount', 10, 2);

            $table->string('status')->default('Processing'); // Processing, Shipped, Delivered, Cancelled
            $table->string('payment_status')->default('Pending'); // Pending, Paid, Overdue
            $table->string('payment_method')->nullable();

            $table->json('shipping_address')->nullable();
            $table->json('billing_details')->nullable(); // Stores LPO, KRA PIN at time of order

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
