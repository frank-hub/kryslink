<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_reference',
        'order_id',
        'supplier_id',
        'customer_id',
        'carrier',
        'tracking_number',
        'status',
        'current_location',
        'estimated_arrival',
        'actual_delivery',
        'delivery_notes',
        'received_by',
    ];

    protected $casts = [
        'estimated_arrival' => 'datetime',
        'actual_delivery' => 'datetime',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    // Generate unique shipment reference
    public static function generateReference()
    {
        do {
            $reference = 'SHP-' . rand(1000, 9999);
        } while (self::where('shipment_reference', $reference)->exists());

        return $reference;
    }
}
