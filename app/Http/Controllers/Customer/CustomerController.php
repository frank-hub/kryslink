<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Order;

class CustomerController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = Order::with('supplier')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $recentOrders = $orders->take(4);

        $metrics = [
            'total_spend'     => $orders->whereIn('status', ['Delivered', 'Shipped', 'Processing'])->sum('total_amount'),
            'active_orders'   => $orders->whereIn('status', ['Processing', 'Shipped'])->count(),
            'pending_payment' => $orders->where('payment_status', 'Pending')->sum('total_amount'),
        ];

        $compliance = [
            'is_verified'      => $user->is_verified,
            'kra_pin'          => !empty($user->kra_pin),
            'pharmacy_license' => !empty($user->pharmacy_license),
            'ppb_license'      => !empty($user->ppb_license),
            'score'            => collect([
                $user->is_verified,
                !empty($user->kra_pin),
                !empty($user->pharmacy_license),
                !empty($user->ppb_license),
            ])->filter()->count(),
        ];

        return Inertia::render('Dashboard/index', [
            'recentOrders' => $recentOrders,
            'metrics'      => $metrics,
            'compliance'   => $compliance,
        ]);
    }

    public function suppliers(){
        $suppliers = User::where('organization_type', 'SUPPLIER')
        ->withCount('receivedOrders as received_orders_count')
        ->get();

        return Inertia::render('Dashboard/suppliers', [
            'suppliers' => $suppliers
        ]);

    }

    public function compliance()
    {
        $user = Auth::user();

    return Inertia::render('Dashboard/Compliance', [
        'user' => [
            'id'                => $user->id,
            'name'              => $user->name,
            'email'             => $user->email,
            'organization_name' => $user->organization_name,
            'organization_type' => $user->organization_type,
            'kra_pin'           => $user->kra_pin,
            'pharmacy_license'  => $user->pharmacy_license,
            'ppb_license'       => $user->ppb_license,
            'is_verified'       => $user->is_verified,
            'county'            => $user->county,
            'created_at'        => $user->created_at,
        ],
    ]);

    }


    public function settings()
    {
        return Inertia::render('Dashboard/Settings', [
            'user' => Auth::user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name'              => 'required|string|max:255',
            'email'             => 'required|email|unique:users,email,' . $user->id,
            'phone'             => 'nullable|string|max:20',
            'organization_name' => 'nullable|string|max:255',
            'county'            => 'nullable|string|max:100',
            'location'          => 'nullable|string|max:255',
            'kra_pin'           => 'nullable|string|max:50',
            'pharmacy_license'  => 'nullable|string|max:100',
            'ppb_license'       => 'nullable|string|max:100',
        ]);

        $user->update($request->only([
            'name', 'email', 'phone',
            'organization_name', 'county', 'location',
            'kra_pin', 'pharmacy_license', 'ppb_license',
        ]));

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password'         => 'required|min:8|confirmed',
        ]);

        Auth::user()->update([
            'password' => bcrypt($request->password),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

}
