<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->string('payout_reference')->unique(); // PAY-1102
            $table->foreignId('supplier_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('payout_method_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->string('admin_processed_by')->nullable(); // Admin who approved
            $table->timestamp('requested_at')->useCurrent();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};