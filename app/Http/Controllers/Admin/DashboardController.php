<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Payout;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. SUPPLIER COUNT
        $totalSuppliers = User::where('role', 'supplier')->count();
        $activeSuppliers = User::where('role', 'supplier')
            ->where('is_verified', 1)
            ->count();
        $newSuppliersThisMonth = User::where('role', 'supplier')
            ->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->count();
        $lastMonthSuppliers = User::where('role', 'supplier')
            ->whereBetween('created_at', [
                Carbon::now()->subMonth()->startOfMonth(),
                Carbon::now()->subMonth()->endOfMonth()
            ])
            ->count();
        
        $supplierGrowth = $lastMonthSuppliers > 0 
            ? (($newSuppliersThisMonth - $lastMonthSuppliers) / $lastMonthSuppliers) * 100 
            : 0;
        
        // 2. TOTAL PRODUCTS
        $totalProducts = Product::count();
        $activeProducts = Product::where('status', 'active')->count();
        $lowStockProducts = Product::where('stock', '<=', 50)->count();
        
        // 3. TOTAL REVENUE (Platform wide)
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');
        $currentMonthRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->sum('total_amount');
        $lastMonthRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [
                Carbon::now()->subMonth()->startOfMonth(),
                Carbon::now()->subMonth()->endOfMonth()
            ])
            ->sum('total_amount');
        
        $revenueGrowth = $lastMonthRevenue > 0 
            ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;
        
        // 4. PENDING PAYOUTS
        $pendingPayouts = Payout::whereIn('status', ['pending', 'processing'])->count();
        $pendingPayoutAmount = Payout::whereIn('status', ['pending', 'processing'])->sum('amount');
        
        // 5. ORDERS
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'delivered')->count();
        
        // 6. REVENUE OVER TIME (Last 30 days)
        $revenueOverTime = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'revenue' => (float) $item->revenue,
                    'orders' => $item->orders,
                ];
            });
        
        // Fill missing dates
        $filledRevenueData = $this->fillMissingDates($revenueOverTime, 30);
        
        // 7. TOP SUPPLIERS BY REVENUE
        $topSuppliers = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', Carbon::now()->startOfMonth())
            ->select('supplier_id', DB::raw('SUM(total_amount) as total_revenue'), DB::raw('COUNT(*) as order_count'))
            ->with('supplier:id,name,email')
            ->groupBy('supplier_id')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->supplier_id,
                    'name' => $item->supplier->name ?? 'N/A',
                    'email' => $item->supplier->email ?? 'N/A',
                    'revenue' => (float) $item->total_revenue,
                    'orders' => $item->order_count,
                ];
            });
        
        // 8. RECENT ACTIVITIES
        $recentActivities = collect();
        
        // Recent suppliers
        $recentSuppliers = User::where('role', 'supplier')
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($supplier) {
                return [
                    'type' => 'supplier_joined',
                    'description' => $supplier->name . ' joined as a supplier',
                    'timestamp' => $supplier->created_at,
                    'icon' => 'user',
                ];
            });
        
        // Recent payouts
        $recentPayouts = Payout::with('supplier')
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($payout) {
                return [
                    'type' => 'payout_requested',
                    'description' => $payout->supplier->name . ' requested payout of KES ' . number_format($payout->amount),
                    'timestamp' => $payout->created_at,
                    'icon' => 'wallet',
                ];
            });
        
        $recentActivities = $recentSuppliers->concat($recentPayouts)
            ->sortByDesc('timestamp')
            ->take(10)
            ->values();
        
        // 9. ORDER STATUS BREAKDOWN
        $orderStatusBreakdown = Order::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => ucfirst($item->status),
                    'count' => $item->count,
                ];
            });
        
        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'suppliers' => [
                    'total' => $totalSuppliers,
                    'active' => $activeSuppliers,
                    'new_this_month' => $newSuppliersThisMonth,
                    'growth' => round($supplierGrowth, 1),
                ],
                'products' => [
                    'total' => $totalProducts,
                    'active' => $activeProducts,
                    'low_stock' => $lowStockProducts,
                ],
                'revenue' => [
                    'total' => $totalRevenue,
                    'this_month' => $currentMonthRevenue,
                    'growth' => round($revenueGrowth, 1),
                    'formatted' => 'KES ' . number_format($totalRevenue),
                ],
                'payouts' => [
                    'pending_count' => $pendingPayouts,
                    'pending_amount' => $pendingPayoutAmount,
                    'formatted' => 'KES ' . number_format($pendingPayoutAmount),
                ],
                'orders' => [
                    'total' => $totalOrders,
                    'pending' => $pendingOrders,
                    'completed' => $completedOrders,
                ],
            ],
            'revenueOverTime' => $filledRevenueData,
            'topSuppliers' => $topSuppliers,
            'recentActivities' => $recentActivities,
            'orderStatusBreakdown' => $orderStatusBreakdown,
        ]);
    }
    
    private function fillMissingDates($data, $days)
    {
        $result = collect();
        $dataByDate = $data->keyBy('date');
        
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('M d');
            
            if ($dataByDate->has($date)) {
                $result->push($dataByDate[$date]);
            } else {
                $result->push([
                    'date' => $date,
                    'revenue' => 0,
                    'orders' => 0,
                ]);
            }
        }
        
        return $result;
    }
}