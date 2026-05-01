<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
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
        $users = User::where('organization_type', '!=', 'SUPPLIER')
            ->select([
                'id', 'name', 'email', 'organization_name', 'organization_type',
                'kra_pin', 'pharmacy_license', 'ppb_license',
                'is_verified', 'county', 'created_at'
            ])
            ->latest()
            ->get()
            ->map(function ($user) {
                $user->compliance_score = collect([
                    !empty($user->kra_pin),
                    !empty($user->pharmacy_license),
                    !empty($user->ppb_license),
                    (bool) $user->is_verified,
                ])->filter()->count();
                return $user;
            });

        return Inertia::render('Dashboard/Compliance', [
            'users' => $users,
        ]);
    }

}
