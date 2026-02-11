<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;


class ShipmentController extends Controller
{
    public function index()
    {
        $shipments = Shipment::with(['order', 'customer'])
            ->where('supplier_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($shipment) {
                return [
                    'id' => $shipment->shipment_reference,
                    'order_ref' => $shipment->order->order_reference,
                    'customer' => $shipment->customer->name ?? 'N/A',
                    'carrier' => $shipment->carrier,
                    'tracking_number' => $shipment->tracking_number,
                    'status' => $shipment->status,
                    'current_location' => $shipment->current_location,
                    'estimated_arrival' => $shipment->estimated_arrival?->format('M d, Y g:i A'),
                    'created_at' => $shipment->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Supplier/Shipments', [
            'shipments' => $shipments
        ]);
    }

    // Create/Dispatch shipment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'carrier' => 'required|in:Fargo Courier,Wells Fargo,In-House Delivery,G4S Logistics',
            'tracking_number' => 'nullable|string|max:255',
            'estimated_arrival' => 'required|date',
            'current_location' => 'required|string|max:255',
        ]);

        $order = Order::with('user')->findOrFail($validated['order_id']);

        if ($order->supplier_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Unauthorized action']);
        }

        if ($order->shipment) {
            return back()->withErrors(['error' => 'Shipment already exists for this order']);
        }

        $shipment = Shipment::create([
            'shipment_reference' => Shipment::generateReference(),
            'order_id' => $order->id,
            'supplier_id' => Auth::id(),
            'customer_id' => $order->user_id,
            'carrier' => $validated['carrier'],
            'tracking_number' => $validated['tracking_number'],
            'current_location' => $validated['current_location'],
            'estimated_arrival' => $validated['estimated_arrival'],
            'status' => 'dispatched',
        ]);

        $order->update(['status' => 'shipped']);

        // This will work with Inertia and close your modal
        return back()->with('success', 'Shipment created successfully');
    }
    // Update shipment status
    public function updateStatus(Request $request, Shipment $shipment)
    {
        // Verify the authenticated user is the supplier
        if ($shipment->supplier_id !== Auth::id()) {
            return back()->withErrors(['error' => 'Unauthorized action']);
        }

        $validated = $request->validate([
            'status' => 'required|in:dispatched,in_transit,out_for_delivery,delivered,exception',
            'current_location' => 'nullable|string|max:255',
            'received_by' => 'nullable|string|max:255',
            'delivery_notes' => 'nullable|string',
        ]);

        $shipment->update($validated);

        // If delivered, update actual delivery time and order status
        if ($validated['status'] === 'delivered') {
            $shipment->update(['actual_delivery' => now()]);
            $shipment->order->update(['status' => 'delivered']);
        }

        return back()->with('success', 'Shipment status updated successfully');
    }

    // Get shipment details
    public function show(Shipment $shipment)
    {
        // Verify the authenticated user is the supplier
        if ($shipment->supplier_id !== Auth::id()) {
            abort(403, 'Unauthorized action');
        }

        $shipment->load(['order.items', 'customer']);

        return Inertia::render('Dashboard/ShipmentDetails', [
            'shipment' => [
                'id' => $shipment->shipment_reference,
                'order_ref' => $shipment->order->order_reference,
                'customer' => $shipment->customer->name ?? 'N/A',
                'carrier' => $shipment->carrier,
                'tracking_number' => $shipment->tracking_number,
                'status' => $shipment->status,
                'current_location' => $shipment->current_location,
                'estimated_arrival' => $shipment->estimated_arrival?->format('M d, Y g:i A'),
                'actual_delivery' => $shipment->actual_delivery?->format('M d, Y g:i A'),
                'received_by' => $shipment->received_by,
                'delivery_notes' => $shipment->delivery_notes,
                'created_at' => $shipment->created_at->format('M d, Y g:i A'),
            ]
        ]);
    }
}
