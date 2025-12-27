<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Category;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'supplier_id',
        'category_id',
        'sku',
        'name',
        'slug',
        'generic_name',
        'description',
        'price',
        'cost_price',
        'stock',
        'low_stock_threshold',
        'pack_size',
        'dosage',
        'form',
        'manufacturer',
        'country_of_origin',
        'batch_number',
        'expiry_date',
        'requires_prescription',
        'requires_cold_chain',
        'is_verified',
        'status',
        'rating',
        'reviews_count',
        'images',
        'documents',
        'meta_data',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'is_verified' => 'boolean',
        'images' => 'array',
        'documents' => 'array',
    ];

    // Relationships
    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }





    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock', '<=', 'low_stock_threshold')
                     ->where('stock', '>', 0);
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('stock', '<=', 0);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('generic_name', 'like', "%{$search}%")
              ->orWhere('sku', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // Accessors
    public function getImageAttribute()
    {
        $images = $this->images ?? [];
        return !empty($images) ? asset('storage/' . $images[0]) : asset('images/placeholder.jpg');
    }

    public function getImageUrlsAttribute()
    {
        $images = $this->images ?? [];
        return array_map(fn($img) => asset('storage/' . $img), $images);
    }

    public function getIsLowStockAttribute()
    {
        return $this->stock > 0 && $this->stock <= $this->low_stock_threshold;
    }

    public function getIsOutOfStockAttribute()
    {
        return $this->stock <= 0;
    }

    public function getStockStatusAttribute()
    {
        if ($this->stock <= 0) {
            return 'out_of_stock';
        } elseif ($this->stock <= $this->low_stock_threshold) {
            return 'low_stock';
        }
        return 'in_stock';
    }

    // Methods
    public function updateStock($quantity, $operation = 'decrease')
    {
        if ($operation === 'decrease') {
            $this->decrement('stock', $quantity);
        } else {
            $this->increment('stock', $quantity);
        }

        // Update status based on stock
        if ($this->stock <= 0) {
            $this->update(['status' => 'out_of_stock']);
        } elseif ($this->status === 'out_of_stock' && $this->stock > 0) {
            $this->update(['status' => 'active']);
        }
    }

    public function updateRating()
    {
        $this->rating = $this->reviews()->avg('rating') ?? 0;
        $this->reviews_count = $this->reviews()->count();
        $this->save();
    }
}
