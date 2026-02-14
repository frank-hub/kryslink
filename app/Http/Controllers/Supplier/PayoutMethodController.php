<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\PayoutMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PayoutMethodController extends Controller
{
    public function index()
    {
        $methods = PayoutMethod::where('supplier_id', Auth::id())
            ->orderBy('is_primary', 'desc')
            ->get();

        return Inertia::render('Supplier/PayoutMethods', [
            'methods' => $methods
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'type' => 'required|in:bank,mpesa',
            'bank_name' => 'required_if:type,bank|string|max:255',
            'account_name' => 'required_if:type,bank|string|max:255',
            'account_number' => 'required_if:type,bank|string|max:255',
            'mpesa_number' => 'required_if:type,mpesa|string|max:15',
            'till_number' => 'nullable|string|max:10',
            'is_primary' => 'boolean',
        ]);

        Log::info('Validated payout method data:', $validated['type'] === 'bank' ? [
            'type' => $validated['type'],
            'bank_name' => $validated['bank_name'] ?? null,
            'account_name' => $validated['account_name'] ?? null,
            'account_number' => $validated['account_number'] ?? null,
            'is_primary' => $validated['is_primary'] ?? false,
        ] : [
            'type' => $validated['type'],
            'mpesa_number' => $validated['mpesa_number'] ?? null,
            'till_number' => $validated['till_number'] ?? null,
            'is_primary' => $validated['is_primary'] ?? false,
        ]);


        // If setting as primary, remove primary from others
        if ($request->is_primary) {
            PayoutMethod::where('supplier_id', Auth::id())
                ->update(['is_primary' => false]);
        }

        $method = PayoutMethod::create([
            'supplier_id' => Auth::id(),
            'type' => $validated['type'],
            'bank_name' => $validated['bank_name'] ?? null,
            'account_name' => $validated['account_name'] ?? null,
            'account_number' => $validated['account_number'] ?? null,
            'mpesa_number' => $validated['mpesa_number'] ?? null,
            'till_number' => $validated['till_number'] ?? null,
            'is_primary' => $validated['is_primary'] ?? false,
            'is_verified' => false, // Admin will verify
        ]);

        return back()->with('success', 'Payout method added successfully');
    }

    public function update(Request $request, PayoutMethod $payoutMethod)
    {
        // Verify ownership
        if ($payoutMethod->supplier_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'type' => 'required|in:bank,mpesa',
            'bank_name' => 'required_if:type,bank|string|max:255',
            'account_name' => 'required_if:type,bank|string|max:255',
            'account_number' => 'required_if:type,bank|string|max:255',
            'mpesa_number' => 'required_if:type,mpesa|string|max:15',
            'till_number' => 'nullable|string|max:10',
            'is_primary' => 'boolean',
        ]);

        // If setting as primary, remove primary from others
        if ($request->is_primary) {
            PayoutMethod::where('supplier_id', Auth::id())
                ->where('id', '!=', $payoutMethod->id)
                ->update(['is_primary' => false]);
        }

        $payoutMethod->update($validated);

        return back()->with('success', 'Payout method updated successfully');
    }

    public function setPrimary(PayoutMethod $payoutMethod)
    {
        // Verify ownership
        if ($payoutMethod->supplier_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Remove primary from all others
        PayoutMethod::where('supplier_id', Auth::id())
            ->update(['is_primary' => false]);

        // Set this as primary
        $payoutMethod->update(['is_primary' => true]);

        return back()->with('success', 'Primary payout method updated');
    }

    public function destroy(PayoutMethod $payoutMethod)
    {
        // Verify ownership
        if ($payoutMethod->supplier_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // Cannot delete if it's the only method
        $count = PayoutMethod::where('supplier_id', Auth::id())->count();
        if ($count <= 1) {
            return back()->withErrors(['error' => 'You must have at least one payout method']);
        }

        // Cannot delete if it has pending payouts
        if ($payoutMethod->payouts()->whereIn('status', ['pending', 'processing'])->exists()) {
            return back()->withErrors(['error' => 'Cannot delete method with pending payouts']);
        }

        $payoutMethod->delete();

        return back()->with('success', 'Payout method removed');
    }
}