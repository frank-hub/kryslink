<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile', [
            'auth' => [
                'user' => Auth::user(),
            ]
        ]);

    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
        ]);

        $user = Auth::user();
        $user->name = $request->name;
        $user->email = $request->email;
        // $user->save();


        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    public function register(Request $request)
    {
        // TODO: Work on validation and error handling
        $validated = $request->validate([
            // 'name' => 'required|string|max:255', // Maps to "Contact Person" or "Business Owner"
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // B2B Specific Fields
            'business_name' => 'required|string|max:255', // Maps to organization_name
            'user_type' => 'required|in:PHARMACY,HOSPITAL,SUPPLIER', // Maps to organization_type/role
            'kra_pin' => 'required|string|max:20|regex:/^[A-Z]\d{9}[A-Z]$/', // Kenyan PIN Format P000000000Z
            'county' => 'required|string|max:255',
        ]);

        $role = $request->user_type === 'SUPPLIER' ? 'SUPPLIER' : 'CUSTOMER';


        if(!$validated){
            return redirect()->back();
        }

        $user = User::create([
            'name' => $request->business_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role,
            'organization_name' => $request->business_name,
            'organization_type' => $request->user_type,
            'kra_pin' => $request->kra_pin,
            'county' => $request->county,
            'is_verified' => false,
        ]);

        Auth::login($user);

        // Redirect based on role
        if ($role === 'SUPPLIER') {
            return redirect('/supplier/dashboard');
        }

        return Inertia::render('Dashboard/index');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return Inertia::render('Dashboard/index');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
}

