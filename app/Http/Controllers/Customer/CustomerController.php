<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
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

}
