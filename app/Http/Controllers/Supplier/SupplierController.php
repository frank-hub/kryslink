<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class SupplierController extends Controller
{
    public function orders()
    {
        // Fetch orders related to the supplier
        $orders = Order::with(['user', 'items'])
        ->where('supplier_id', Auth::id())
        ->latest()
        ->get()
        ->map(function ($order) {
            return [
                'id' => $order->order_reference,
                'customer' => $order->user->name ?? 'N/A',
                'date' => $order->created_at->format('M d, Y'),
                'amount' => $order->total_amount,
                'payment' => ucfirst($order->payment_status), // 'paid', 'pending', 'failed' → 'Paid', 'Pending', 'Failed'
                'status' => ucfirst($order->status), // 'pending', 'processing', etc. → 'Pending', 'Processing'
                'items' => $order->items->count(),
            ];
        });

        return Inertia::render('Supplier/Orders', [
            'orders' => $orders,
        ]);
    }
}
