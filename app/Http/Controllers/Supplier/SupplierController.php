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
        $orders = Order::with(['user', 'items'])
            ->where('supplier_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id'       => $order->order_reference,
                    'order_id' => $order->id,
                    'customer' => $order->user->name ?? 'N/A',
                    'date'     => $order->created_at->format('M d, Y'),
                    'amount'   => $order->total_amount,
                    'payment'  => ucfirst($order->payment_status),
                    'status'   => ucfirst($order->status),
                    'items'    => $order->items->count(),
                ];
            });

        return Inertia::render('Supplier/Orders', [
            'orders'  => $orders,
            'flash'   => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function markOrderAsPaid(Order $order)
    {
        if ($order->supplier_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($order->payment_status === 'Paid') {
            return redirect()->route('supplier.orders')->with('error', 'Order is already marked as paid.');
        }

        $order->payment_status = 'Paid';
        $order->save();

        return redirect()->route('supplier.orders')->with('success', 'Order marked as paid successfully.');
    }
}
