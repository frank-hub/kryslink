<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'transaction_reference',
        'supplier_id',
        'type',
        'amount',
        'reference_type',
        'reference_id',
        'status',
        'description',
    ];

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    // Generate unique transaction reference
    public static function generateReference()
    {
        do {
            $reference = 'TXN-' . rand(10000, 99999);
        } while (self::where('transaction_reference', $reference)->exists());
        
        return $reference;
    }
}