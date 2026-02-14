<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payout extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'payout_reference',
        'supplier_id',
        'payout_method_id',
        'amount',
        'status',
        'notes',
        'admin_processed_by',
        'requested_at',
        'processed_at',
        'completed_at',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function payoutMethod()
    {
        return $this->belongsTo(PayoutMethod::class);
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class, 'reference_id')->where('reference_type', 'payout');
    }

    // Generate unique payout reference
    public static function generateReference()
    {
        do {
            $reference = 'PAY-' . rand(1000, 9999);
        } while (self::where('payout_reference', $reference)->exists());
        
        return $reference;
    }
}