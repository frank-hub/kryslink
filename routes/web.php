<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Supplier\ProductController;
use App\Http\Controllers\Supplier\AuthController;
use App\Http\Controllers\WelcomeController;

Route::get('/', [WelcomeController::class,'index'])->name('home');
Route::get('product/{id}', [WelcomeController::class,'show'])->name('product.show');

Route::get('login',[UserController::class,'Customerlogin'])->name('login');
Route::post('authlogin',[UserController::class,'login'])->name('user.login');
Route::post('register',[UserController::class,'register'])->name('user.register');

Route::get('/supplier/auth', function () {
    return Inertia::render('Supplier/Auth/Auth');
})->name('supplier.auth');

Route::post('/supplier/login', [AuthController::class, 'login']);
Route::post('/supplier/register', [AuthController::class, 'register']);

Route::get('/marketplace', function () {
    return Inertia::render('Marketplace');
})->name('marketplace');

Route::middleware(['auth'])->group(function () {
    Route::get('/checkout',[OrderController::class,'create'])->name('checkout');
    Route::post('/orders/store',[OrderController::class,'store'])->name('orders.store');
});

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


        Route::get('/suppliers', function () {
            return Inertia::render('Dashboard/suppliers');
        })->name('dashboard.suppliers');
    });
Route::group(['middleware' => ['auth', 'verified']], function () {

    Route::group(['prefix' => 'supplier'], function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Supplier/Dashboard');
        })->name('supplier.dashboard');

        Route::get('/products', [ProductController::class, 'index'])->name('supplier.products.index');

        Route::post('/products/store', [ProductController::class, 'store'])->name('supplier.products.store');

        Route::get('/products/create', [ProductController::class, 'create'])->name('supplier.products.create');

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
