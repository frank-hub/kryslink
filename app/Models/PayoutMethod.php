<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PayoutMethod extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'supplier_id',
        'type',
        'bank_name',
        'account_name',
        'account_number',
        'mpesa_number',
        'till_number',
        'is_primary',
        'is_verified',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_verified' => 'boolean',
    ];

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function payouts()
    {
        return $this->hasMany(Payout::class);
    }

    // Get masked account number
    public function getMaskedAccountAttribute()
    {
        if ($this->type === 'bank' && $this->account_number) {
            return '****' . substr($this->account_number, -4);
        }
        if ($this->type === 'mpesa' && $this->till_number) {
            return $this->till_number;
        }
        return 'N/A';
    }

    // Get display name
    public function getDisplayNameAttribute()
    {
        if ($this->type === 'bank') {
            return $this->bank_name . ' • ' . $this->masked_account;
        }
        if ($this->type === 'mpesa') {
            return 'M-PESA Till • ' . $this->till_number;
        }
        return 'Payment Method';
    }
}