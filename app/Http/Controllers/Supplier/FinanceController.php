<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payout;
use App\Models\PayoutMethod;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class FinanceController extends Controller
{
    public function index()
    {
        $supplierId = Auth::id();
        
        // 1. TOTAL REVENUE (all completed paid orders)
        $totalRevenue = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        
        // 2. TOTAL PAYOUTS (completed payouts)
        $totalPayouts = Payout::where('supplier_id', $supplierId)
            ->where('status', 'completed')
            ->sum('amount');
        
        // 3. AVAILABLE BALANCE (revenue - payouts)
        $availableBalance = $totalRevenue - $totalPayouts;
        
        // 4. PENDING CLEARANCE (orders delivered but payment pending clearance - 7 days)
        $pendingClearance = Order::where('supplier_id', $supplierId)
            ->where('status', 'delivered')
            ->where('payment_status', 'paid')
            ->where('updated_at', '>=', Carbon::now()->subDays(7))
            ->sum('total_amount');
        
        // 5. REVENUE GROWTH (Last 12 months)
        $revenueGrowth = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::create($item->year, $item->month)->format('M'),
                    'revenue' => (float) $item->revenue,
                ];
            });
        
        // Fill missing months with 0
        $filledRevenueGrowth = $this->fillMissingMonths($revenueGrowth, 12);
        
        // 6. PAYOUT METHODS
        $payoutMethods = PayoutMethod::where('supplier_id', $supplierId)
            ->orderBy('is_primary', 'desc')
            ->get()
            ->map(function ($method) {
                return [
                    'id' => $method->id,
                    'type' => $method->type,
                    'name' => $method->display_name,
                    'bank_name' => $method->bank_name,
                    'account_number' => $method->masked_account,
                    'is_primary' => $method->is_primary,
                    'is_verified' => $method->is_verified,
                ];
            });
        
        // 7. TRANSACTION HISTORY
        $transactions = Transaction::where('supplier_id', $supplierId)
            ->latest()
            ->limit(20)
            ->get()
            ->map(function ($txn) {
                // Get reference details
                $refDetails = $this->getTransactionReferenceDetails($txn);
                
                return [
                    'id' => $txn->transaction_reference,
                    'type' => ucfirst(str_replace('_', ' ', $txn->type)),
                    'reference' => $refDetails['reference'],
                    'method' => $refDetails['method'],
                    'amount' => (float) $txn->amount,
                    'status' => ucfirst($txn->status),
                    'date' => $txn->created_at->format('M d, Y'),
                ];
            });
        
        // 8. PENDING PAYOUTS
        $pendingPayouts = Payout::where('supplier_id', $supplierId)
            ->whereIn('status', ['pending', 'processing'])
            ->count();
        
        return Inertia::render('Supplier/Finance', [
            'metrics' => [
                'totalRevenue' => [
                    'value' => $totalRevenue,
                    'formatted' => 'KES ' . number_format($totalRevenue),
                    'change' => '+12.5%', // Calculate month-over-month if needed
                ],
                'availableBalance' => [
                    'value' => $availableBalance,
                    'formatted' => 'KES ' . number_format($availableBalance),
                    'status' => 'Ready',
                ],
                'pendingClearance' => [
                    'value' => $pendingClearance,
                    'formatted' => 'KES ' . number_format($pendingClearance),
                    'days' => '7 days',
                ],
            ],
            'revenueGrowth' => $filledRevenueGrowth,
            'payoutMethods' => $payoutMethods,
            'transactions' => $transactions,
            'pendingPayouts' => $pendingPayouts,
        ]);
    }
    
    // Store payout request
    public function requestPayout(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'payout_method_id' => 'required|exists:payout_methods,id',
        ]);
        
        $supplierId = Auth::id();
        
        // Get available balance
        $totalRevenue = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        
        $totalPayouts = Payout::where('supplier_id', $supplierId)
            ->where('status', 'completed')
            ->sum('amount');
        
        $availableBalance = $totalRevenue - $totalPayouts;
        
        // Check if sufficient balance
        if ($validated['amount'] > $availableBalance) {
            return back()->withErrors(['amount' => 'Insufficient balance']);
        }
        
        // Create payout
        $payout = Payout::create([
            'payout_reference' => Payout::generateReference(),
            'supplier_id' => $supplierId,
            'payout_method_id' => $validated['payout_method_id'],
            'amount' => $validated['amount'],
            'status' => 'pending',
            'requested_at' => now(),
        ]);
        
        // Create transaction record
        Transaction::create([
            'transaction_reference' => Transaction::generateReference(),
            'supplier_id' => $supplierId,
            'type' => 'payout',
            'amount' => -$validated['amount'], // Negative for payout
            'reference_type' => 'payout',
            'reference_id' => $payout->id,
            'status' => 'pending',
            'description' => 'Payout request to ' . $payout->payoutMethod->display_name,
        ]);
        
        return back()->with('success', 'Payout request submitted successfully');
    }
    
    // Helper: Get transaction reference details
    private function getTransactionReferenceDetails($transaction)
    {
        if ($transaction->type === 'order_income') {
            $order = Order::find($transaction->reference_id);
            return [
                'reference' => $order ? $order->order_reference : 'N/A',
                'method' => 'MediConnect Balance',
            ];
        }
        
        if ($transaction->type === 'payout') {
            $payout = Payout::with('payoutMethod')->find($transaction->reference_id);
            return [
                'reference' => $payout ? $payout->payout_reference : 'N/A',
                'method' => $payout ? $payout->payoutMethod->display_name : 'N/A',
            ];
        }
        
        return [
            'reference' => 'N/A',
            'method' => 'N/A',
        ];
    }
    
    // Helper: Fill missing months
    private function fillMissingMonths($data, $months)
    {
        $result = collect();
        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        for ($i = $months - 1; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i)->format('M');
            $existing = $data->firstWhere('month', $month);
            
            $result->push([
                'month' => $month,
                'revenue' => $existing ? $existing['revenue'] : 0,
            ]);
        }
        
        return $result;
    }
}