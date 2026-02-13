<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index()
    {
        $supplierId = Auth::id();
        
        // Date ranges
        $currentPeriodStart = Carbon::now()->startOfMonth();
        $previousPeriodStart = Carbon::now()->subMonth()->startOfMonth();
        $previousPeriodEnd = Carbon::now()->subMonth()->endOfMonth();
        
        // 1. GROSS SALES (from orders.total_amount)
        $currentGrossSales = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $currentPeriodStart)
            ->sum('total_amount');
            
        $previousGrossSales = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$previousPeriodStart, $previousPeriodEnd])
            ->sum('total_amount');
            
        $grossSalesChange = $previousGrossSales > 0 
            ? (($currentGrossSales - $previousGrossSales) / $previousGrossSales) * 100 
            : 0;
        
        // 2. ORDER VOLUME
        $currentOrderVolume = Order::where('supplier_id', $supplierId)
            ->where('created_at', '>=', $currentPeriodStart)
            ->count();
            
        $previousOrderVolume = Order::where('supplier_id', $supplierId)
            ->whereBetween('created_at', [$previousPeriodStart, $previousPeriodEnd])
            ->count();
            
        $orderVolumeChange = $previousOrderVolume > 0 
            ? (($currentOrderVolume - $previousOrderVolume) / $previousOrderVolume) * 100 
            : 0;
        
        // 3. AVERAGE ORDER VALUE
        $currentAvgOrderValue = $currentOrderVolume > 0 
            ? $currentGrossSales / $currentOrderVolume 
            : 0;
            
        $previousAvgOrderValue = $previousOrderVolume > 0 
            ? $previousGrossSales / $previousOrderVolume 
            : 0;
            
        $avgOrderValueChange = $previousAvgOrderValue > 0 
            ? (($currentAvgOrderValue - $previousAvgOrderValue) / $previousAvgOrderValue) * 100 
            : 0;
        
        // 4. NEW CUSTOMERS (unique customers who ordered this month)
        $currentNewCustomers = Order::where('supplier_id', $supplierId)
            ->where('created_at', '>=', $currentPeriodStart)
            ->distinct('user_id')
            ->count('user_id');
            
        $previousNewCustomers = Order::where('supplier_id', $supplierId)
            ->whereBetween('created_at', [$previousPeriodStart, $previousPeriodEnd])
            ->distinct('user_id')
            ->count('user_id');
            
        $newCustomersChange = $previousNewCustomers > 0 
            ? (($currentNewCustomers - $previousNewCustomers) / $previousNewCustomers) * 100 
            : 0;
        
        // 5. REVENUE PERFORMANCE (Last 30 days - daily)
        $revenuePerformance = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'revenue' => (float) $item->revenue,
                ];
            });
        
        // Fill in missing dates with zero revenue
        $filledRevenueData = $this->fillMissingDates($revenuePerformance, 30);
        
        // 6. REGIONAL SALES (Extract county from shipping_address JSON/LONGTEXT)
        $orders = Order::where('supplier_id', $supplierId)
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', $currentPeriodStart)
            ->select('shipping_address', 'total_amount')
            ->get();
        
        $regionalSalesGrouped = $orders->groupBy(function ($order) {
            // Decode shipping_address JSON
            $address = is_string($order->shipping_address) 
                ? json_decode($order->shipping_address, true) 
                : $order->shipping_address;
            
            // Extract county
            if (is_array($address) && isset($address['county'])) {
                return $address['county'];
            }
            return 'Others';
        });
        
        $regionalSales = $regionalSalesGrouped->map(function ($orders, $region) {
            return [
                'region' => $region,
                'sales' => $orders->sum('total_amount'),
                'orders' => $orders->count(),
            ];
        })->sortByDesc('sales')->values();
        
        // Calculate percentages
        $totalRegionalSales = $regionalSales->sum('sales');
        $regionalSales = $regionalSales->map(function ($item) use ($totalRegionalSales) {
            return [
                'region' => $item['region'],
                'sales' => $item['sales'],
                'orders' => $item['orders'],
                'percentage' => $totalRegionalSales > 0 
                    ? round(($item['sales'] / $totalRegionalSales) * 100, 1) 
                    : 0,
            ];
        });
        
        // Get top region
        $topRegion = $regionalSales->first();
        
        // 7. TOP SELLING PRODUCTS (from order_items)
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.supplier_id', $supplierId)
            ->where('orders.payment_status', 'paid')
            ->where('orders.created_at', '>=', $currentPeriodStart)
            ->select(
                'order_items.product_name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('order_items.product_name')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->product_name,
                    'quantity' => $item->total_quantity,
                    'revenue' => (float) $item->total_revenue,
                ];
            });
        
        // 8. SALES BY CATEGORY (join with products table)
       $salesByCategory = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('products', 'order_items.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->where('orders.supplier_id', $supplierId)
            ->where('orders.payment_status', 'paid')
            ->where('orders.created_at', '>=', $currentPeriodStart)
            ->select(
                DB::raw('COALESCE(categories.name, "Uncategorized") as category'),
                DB::raw('SUM(order_items.total_price) as total_revenue'),
                DB::raw('COUNT(DISTINCT orders.id) as order_count')
            )
            ->groupBy('category')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'revenue' => (float) $item->total_revenue,
                    'orders' => $item->order_count,
                ];
            });
        
        // 9. ORDER STATUS BREAKDOWN
        $orderStatusBreakdown = Order::where('supplier_id', $supplierId)
            ->where('created_at', '>=', $currentPeriodStart)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => ucfirst($item->status),
                    'count' => $item->count,
                ];
            });
        
        // 10. PAYMENT STATUS BREAKDOWN
        $paymentStatusBreakdown = Order::where('supplier_id', $supplierId)
            ->where('created_at', '>=', $currentPeriodStart)
            ->select('payment_status', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_amount) as total'))
            ->groupBy('payment_status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => ucfirst($item->payment_status),
                    'count' => $item->count,
                    'amount' => (float) $item->total,
                ];
            });
        
        return Inertia::render('Supplier/Analytics', [
            'metrics' => [
                'grossSales' => [
                    'value' => $currentGrossSales,
                    'formatted' => 'KES ' . number_format($currentGrossSales / 1000000, 1) . 'M',
                    'change' => round($grossSalesChange, 1),
                    'trend' => $grossSalesChange >= 0 ? 'up' : 'down',
                ],
                'orderVolume' => [
                    'value' => $currentOrderVolume,
                    'change' => round($orderVolumeChange, 1),
                    'trend' => $orderVolumeChange >= 0 ? 'up' : 'down',
                ],
                'avgOrderValue' => [
                    'value' => $currentAvgOrderValue,
                    'formatted' => 'KES ' . number_format($currentAvgOrderValue),
                    'change' => round($avgOrderValueChange, 1),
                    'trend' => $avgOrderValueChange >= 0 ? 'up' : 'down',
                ],
                'newCustomers' => [
                    'value' => $currentNewCustomers,
                    'change' => round($newCustomersChange, 1),
                    'trend' => $newCustomersChange >= 0 ? 'up' : 'down',
                ],
            ],
            'revenuePerformance' => $filledRevenueData,
            'regionalSales' => $regionalSales,
            'topRegion' => $topRegion,
            'topProducts' => $topProducts,
            'salesByCategory' => $salesByCategory,
            'orderStatusBreakdown' => $orderStatusBreakdown,
            'paymentStatusBreakdown' => $paymentStatusBreakdown,
        ]);
    }
    
    /**
     * Fill missing dates with zero revenue for continuous chart
     */
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
                ]);
            }
        }
        
        return $result;
    }
}