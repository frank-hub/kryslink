<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the supplier login/register page
     */
    public function showAuth()
    {
        return Inertia::render('Supplier/Auth');
    }

    /**
     * Handle supplier login
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || $user->role !== 'SUPPLIER') {
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our supplier records.'],
            ]);
        }

        // is verified ?
        if (!$user->is_verified) {
            throw ValidationException::withMessages([
                'email' => ['Your supplier account is pending verification. Please contact support.'],
            ]);
        }

        // Attempt login
        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended('/supplier/dashboard');
    }

    /**
     * Handle supplier registration
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'kra_pin' => ['required', 'string', 'max:20', 'unique:users,kra_pin'],
            'ppb_license' => ['required', 'string', 'max:50', 'unique:users,pharmacy_license'],
            'contact_person' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        // Create the supplier user
        $user = User::create([
            'name' => $validated['contact_person'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'SUPPLIER',
            'organization_name' => $validated['company_name'],
            'organization_type' => 'SUPPLIER',
            'kra_pin' => $validated['kra_pin'],
            'pharmacy_license' => $validated['ppb_license'], // Reusing this field for PPB license
            'is_verified' => false, // Requires admin verification
        ]);

        // Optional: Send verification notification to admin
        // event(new SupplierRegistered($user));

        return redirect()->route('supplier.auth')->with('success',
            'Registration successful! Your account is pending verification. We will notify you via email once approved.'
        );
    }

    /**
     * Handle supplier logout
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/supplier/auth');
    }
}
