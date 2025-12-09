<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;


    protected $fillable = [
        'supplier_id',
        'name',
        'category',
        'description',
        'price',
        'stock',
        'image_url',
        'generic_name',
        'pack_size',
        'requires_prescription',
        'rating',
        'is_verified',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_verified' => 'boolean',
        'requires_prescription' => 'boolean',
    ];

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }
}
