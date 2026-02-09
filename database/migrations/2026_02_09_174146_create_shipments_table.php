<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('shipment_reference')->unique(); // e.g., SHP-9001
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('supplier_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');

            // Logistics Carrier
            $table->enum('carrier', ['Fargo Courier', 'Wells Fargo', 'In-House Delivery', 'G4S Logistics']);
            $table->string('tracking_number')->nullable();

            // Shipment Status
            $table->enum('status', ['dispatched', 'in_transit', 'out_for_delivery', 'delivered', 'exception'])
                ->default('dispatched');

            // Location & Arrival
            $table->string('current_location')->nullable();
            $table->dateTime('estimated_arrival')->nullable();
            $table->dateTime('actual_delivery')->nullable();

            // Additional Info
            $table->text('delivery_notes')->nullable();
            $table->string('received_by')->nullable(); // Name of person who received

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
