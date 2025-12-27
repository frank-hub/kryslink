<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('generic_name')->nullable();
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->decimal('cost_price', 10, 2)->nullable(); // For supplier's internal use
            $table->integer('stock')->default(0);
            $table->integer('low_stock_threshold')->default(50);
            $table->string('pack_size')->nullable(); // e.g., "Box of 10", "Bottle of 100ml"
            $table->string('dosage')->nullable(); // e.g., "500mg"
            $table->string('form')->nullable(); // e.g., "Tablets", "Capsules", "Syrup"
            $table->boolean('is_verified')->default(false); // PPB verification
            $table->enum('status', ['draft', 'active', 'out_of_stock', 'discontinued'])->default('draft');
            $table->json('images')->nullable(); // Array of image paths
            $table->timestamps();
            $table->softDeletes();

            $table->index(['supplier_id', 'status']);
            $table->index(['category_id', 'status']);
            $table->fullText(['name', 'generic_name', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
