<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['supplier:id,name,email']);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by supplier
        if ($request->has('supplier_id') && $request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by stock status
        if ($request->has('stock_status')) {
            if ($request->stock_status === 'low') {
                $query->where('stock', '<=', 50);
            } elseif ($request->stock_status === 'out') {
                $query->where('stock', 0);
            }
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate(20)->withQueryString();

        // Get suppliers for filter
        $suppliers = User::where('role', 'supplier')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        // Get categories for filter (if you have categories)
        $categories = DB::table('categories')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        // Stats
        $stats = [
            'total' => Product::count(),
            'active' => Product::where('status', 'active')->count(),
            'inactive' => Product::where('status', 'inactive')->count(),
            'low_stock' => Product::where('stock', '<=', 50)->count(),
            'out_of_stock' => Product::where('stock', 0)->count(),
        ];

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'suppliers' => $suppliers,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status ?? 'all',
                'supplier_id' => $request->supplier_id,
                'category_id' => $request->category_id,
                'stock_status' => $request->stock_status,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['supplier:id,name,email', 'category:id,name']);

        // Get product order history
        $orderHistory = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->select(
                'orders.order_reference',
                'orders.created_at',
                'order_items.quantity',
                'order_items.unit_price',
                'order_items.total_price',
                'orders.status'
            )
            ->orderBy('orders.created_at', 'desc')
            ->limit(10)
            ->get();

        // Sales stats
        $salesStats = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->where('orders.payment_status', 'paid')
            ->select(
                DB::raw('SUM(order_items.quantity) as total_quantity_sold'),
                DB::raw('SUM(order_items.total_price) as total_revenue'),
                DB::raw('COUNT(DISTINCT orders.id) as total_orders')
            )
            ->first();

        return Inertia::render('Admin/ProductDetails', [
            'product' => $product,
            'orderHistory' => $orderHistory,
            'salesStats' => $salesStats,
        ]);
    }

    public function updateStatus(Request $request, Product $product)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $product->update(['status' => $validated['status']]);

        return back()->with('success', 'Product status updated successfully');
    }

    public function destroy(Product $product)
    {
        // Check if product has orders
        $hasOrders = DB::table('order_items')
            ->where('product_id', $product->id)
            ->exists();

        if ($hasOrders) {
            return back()->withErrors(['error' => 'Cannot delete product with existing orders']);
        }

        $product->delete();

        return back()->with('success', 'Product deleted successfully');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
            'status' => 'required|in:active,inactive',
        ]);

        Product::whereIn('id', $validated['product_ids'])
            ->update(['status' => $validated['status']]);

        return back()->with('success', 'Products updated successfully');
    }
}