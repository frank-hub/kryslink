<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('supplier')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Dashboard/Orders', [
            'orders' => $orders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        Auth::user(); // Ensure user is authenticated
        $user = Auth::user();
        
        return Inertia::render('Checkout', [
            'cart' => $request->session()->get('cart', []),
            'user' => $user,
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'cart' => 'required|array',
            'shipping_address' => 'required|array',
            'billing_details' => 'required|array',
            'payment_method' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Group items by supplier to create separate orders
            $cartItems = collect($request->cart);
            $ordersBySupplier = $cartItems->groupBy('supplier_id');
            $createdOrders = [];

            foreach ($ordersBySupplier as $supplierId => $items) {
                $subtotal = $items->sum(function ($item) {
                    return $item['price'] * $item['quantity'];
                });
                $tax = $subtotal * 0.16;
                $total = $subtotal + $tax;

                $order = Order::create([
                    'order_reference' => 'ORD-' . strtoupper(Str::random(8)),
                    'user_id' => Auth::id(),
                    'supplier_id' => $items->first()['supplier_id'] ?? 1, // Fallback or handle logic
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'total_amount' => $total,
                    'status' => 'Processing',
                    'payment_status' => 'Pending',
                    'payment_method' => $request->payment_method,
                    'shipping_address' => $request->shipping_address,
                    'billing_details' => $request->billing_details,
                ]);

                foreach ($items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['id'],
                        'product_name' => $item['name'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['price'],
                        'total_price' => $item['price'] * $item['quantity'],
                    ]);
                }

                $createdOrders[] = $order->order_reference;
            }

            DB::commit();

            return redirect()->route('payment.confirmation')->with('orders', $createdOrders);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to place order. ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
