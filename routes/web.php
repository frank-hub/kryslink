<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::post('authlogin',[UserController::class,'login'])->name('user.login');

Route::post('register',[UserController::class,'register'])->name('user.register');

Route::get('/marketplace', function () {
    return Inertia::render('Marketplace');
})->name('marketplace');

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
})->name('checkout');

Route::get('/cart', function () {
    return Inertia::render('Cart');
})->name('cart');

Route::get('/product_show', function () {
    return Inertia::render('ProductShow');
})->name('product_show');

Route::get('/payment', function () {
    return Inertia::render('PaymentConfirmation');
})->name('payment');

Route::group(['prefix' => 'dashboard'], function () {
            Route::get('/index', function () {
            return Inertia::render('Dashboard/index');
        })->name('dashboard.index');

        Route::get('/orders', function () {
            return Inertia::render('Dashboard/orders');
        })->name('dashboard.orders');
    });
Route::group(['middleware' => ['auth', 'verified']], function () {

    Route::group(['prefix' => 'supplier'], function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Supplier/Dashboard');
        })->name('supplier.dashboard');

        Route::get('/products', function () {
            return Inertia::render('Supplier/Products');
        })->name('supplier.products');

        Route::get('/products/create', function () {
            return Inertia::render('Supplier/CreateProduct');
        })->name('supplier.create');

        Route::get('/orders', function () {
            return Inertia::render('Supplier/Orders');
        })->name('supplier.orders');

        Route::get('/shipments', function () {
            return Inertia::render('Supplier/Shipments');
        })->name('supplier.shipments');

        Route::get('/finance', function () {
            return Inertia::render('Supplier/Finance');
        })->name('supplier.finance');

        Route::get('/invoices', function () {
            return Inertia::render('Supplier/Invoices');
        })->name('supplier.invoices');

        Route::get('/settings', function () {
            return Inertia::render('Supplier/Settings');
        })->name('supplier.settings');

        Route::get('/analytics', function () {
            return Inertia::render('Supplier/Analytics');
        })->name('supplier.analytics');
    });



});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
