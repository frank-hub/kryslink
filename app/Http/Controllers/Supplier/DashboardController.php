<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shipment;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $supplierId = Auth::id();
        
        // Get date ranges for comparison
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();
        $lastWeekEnd = Carbon::now()->subWeek()->endOfWeek();
        
        // 1. Total Revenue (current period vs last period)
        $currentRevenue = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $startOfWeek)
            ->sum('total_amount');
            
        $lastWeekRevenue = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])
            ->sum('total_amount');
            
        $revenueChange = $lastWeekRevenue > 0 
            ? (($currentRevenue - $lastWeekRevenue) / $lastWeekRevenue) * 100 
            : 0;
        
        // 2. Pending Orders (current vs last week)
        $currentPendingOrders = Order::where('supplier_id', $supplierId)
            ->where('status', 'pending')
            ->count();
            
        $lastWeekPendingOrders = Order::where('supplier_id', $supplierId)
            ->where('status', 'pending')
            ->whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])
            ->count();
            
        $pendingOrdersChange = $currentPendingOrders - $lastWeekPendingOrders;
        
        // 3. Active Products (current vs last week)
        $currentActiveProducts = Product::where('supplier_id', $supplierId)
            ->where('status', 'active')
            ->count();
            
        $lastWeekActiveProducts = Product::where('supplier_id', $supplierId)
            ->where('status', 'active')
            ->where('created_at', '<=', $lastWeekEnd)
            ->count();
            
        $activeProductsChange = $currentActiveProducts - $lastWeekActiveProducts;
        
        // 4. Orders Shipped (this week vs last week) - CHANGED FROM PRODUCT VIEWS
        $currentShippedOrders = Shipment::where('supplier_id', $supplierId)
            ->where('created_at', '>=', $startOfWeek)
            ->count();
            
        $lastWeekShippedOrders = Shipment::where('supplier_id', $supplierId)
            ->whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])
            ->count();
            
        $shippedOrdersChange = $lastWeekShippedOrders > 0 
            ? (($currentShippedOrders - $lastWeekShippedOrders) / $lastWeekShippedOrders) * 100 
            : 0;
        
        // 5. Revenue Analytics (Last 7 Days)
        $revenueAnalytics = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'Pending')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
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
        
        // 6. Low Stock Alerts (products with stock below threshold)
        $lowStockProducts = Product::where('supplier_id', $supplierId)
            ->where('status', 'active')
            ->whereRaw('stock <= low_stock_threshold')
            ->orWhere(function($query) use ($supplierId) {
                $query->where('supplier_id', $supplierId)
                      ->where('stock', '<=', 50); // Default threshold
            })
            ->select('name', 'stock')
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'name' => $product->name,
                    'stock' => $product->stock,
                ];
            });
        
        // 7. Recent Orders Summary
        $recentOrders = Order::where('supplier_id', $supplierId)
            ->with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->order_reference,
                    'customer' => $order->user->name ?? 'N/A',
                    'amount' => $order->total_amount,
                    'status' => ucfirst($order->status),
                    'date' => $order->created_at->format('M d, Y'),
                ];
            });
        
        return Inertia::render('Supplier/Dashboard', [
            'metrics' => [
                'totalRevenue' => [
                    'value' => $currentRevenue,
                    'formatted' => 'KES ' . number_format($currentRevenue / 1000000, 1) . 'M',
                    'change' => round($revenueChange, 1),
                    'trend' => $revenueChange >= 0 ? 'up' : 'down',
                ],
                'pendingOrders' => [
                    'value' => $currentPendingOrders,
                    'change' => $pendingOrdersChange,
                    'trend' => $pendingOrdersChange >= 0 ? 'up' : 'down',
                ],
                'activeProducts' => [
                    'value' => $currentActiveProducts,
                    'change' => $activeProductsChange,
                    'trend' => $activeProductsChange >= 0 ? 'up' : 'down',
                ],
                'ordersShipped' => [
                    'value' => $currentShippedOrders,
                    'formatted' => number_format($currentShippedOrders / 1000, 1) . 'K',
                    'change' => round($shippedOrdersChange, 1),
                    'trend' => $shippedOrdersChange >= 0 ? 'up' : 'down',
                ],
            ],
            'revenueAnalytics' => $revenueAnalytics,
            'lowStockAlerts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
        ]);
    }
}
