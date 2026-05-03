<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Supplier\ProductController;
use App\Http\Controllers\Supplier\AuthController;
use App\Http\Controllers\Supplier\SupplierController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\Supplier\AnalyticsController;
use App\Http\Controllers\Supplier\DashboardController;
use App\Http\Controllers\Supplier\FinanceController;
use App\Http\Controllers\Supplier\PayoutMethodController;
use App\Http\Controllers\Customer\CustomerController;

Route::get('/', [WelcomeController::class,'index'])->name('home');
Route::get('product/{id}', [WelcomeController::class,'show'])->name('product.show');

Route::get('login',[UserController::class,'Customerlogin'])->name('login');
Route::post('authlogin',[UserController::class,'login'])->name('user.login');
Route::post('register',[UserController::class,'register'])->name('user.register');
Route::get('logout',[UserController::class,'logout'])->name('user.logout');

Route::get('/supplier/auth', function () {
    return Inertia::render('Supplier/Auth/Auth');
})->name('supplier.auth');

Route::post('/supplier/login', [AuthController::class, 'login']);
Route::post('/supplier/register', [AuthController::class, 'register']);

Route::middleware(['auth'])->group(function () {
    Route::get('/marketplace', function () {
    return Inertia::render('Marketplace');
})->name('marketplace');
    Route::get('/checkout',[OrderController::class,'create'])->name('checkout');
    Route::post('/orders/store',[OrderController::class,'store'])->name('orders.store');
    Route::get('payment.confirmation', function () {

        return Inertia::render('PaymentConfirmation', [
            'orders' => session('orders', []),
        ]);
    })->name('payment.confirmation');
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
        Route::get('/index', [CustomerController::class, 'index'])->name('dashboard');

        Route::get('/orders', [OrderController::class, 'index'])->name('customer.orders');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

        Route::get('/compliance', [CustomerController::class, 'compliance'])->name('compliance');
        Route::get('/suppliers', [CustomerController::class, 'suppliers'])->name('dashboard.suppliers');

        Route::get('/settings', [CustomerController::class, 'settings'])->name('settings');
        Route::put('/settings', [CustomerController::class, 'update'])->name('settings.update');
        Route::put('/settings/password', [CustomerController::class, 'updatePassword'])->name('settings.password');

    });
Route::group(['middleware' => ['auth', 'verified']], function () {

    Route::group(['prefix' => 'supplier'], function () {

        Route::get('/dashboard',[DashboardController::class,'index'])->name('supplier.dashboard');

        Route::get('/products', [ProductController::class, 'index'])->name('supplier.products.index');

        Route::post('/products/store', [ProductController::class, 'store'])->name('supplier.products.store');

        Route::get('/products/create', [ProductController::class, 'create'])->name('supplier.products.create');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('supplier.products.edit');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('supplier.products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('supplier.products.destroy');
        Route::get('/orders',[SupplierController::class,'orders'])->name('supplier.orders');

        Route::get('/settings', function () {
            return Inertia::render('Supplier/Settings');
        })->name('supplier.settings');

        Route::get('/analytics',[AnalyticsController::class,'index'])->name('supplier.analytics');
    });

});




Route::middleware(['auth'])->prefix('supplier')->name('supplier.')->group(function () {


    //shipment routes
    Route::get('/shipments', [ShipmentController::class, 'index'])->name('shipments.index');
    Route::post('/shipments/store', [ShipmentController::class, 'store'])->name('shipments.store');
    Route::patch('/shipments/{shipment}/status', [ShipmentController::class, 'updateStatus'])->name('shipments.updateStatus');

    //finance routes
    Route::get('/finance', [FinanceController::class, 'index'])->name('finance');
    Route::post('/finance/request-payout', [FinanceController::class, 'requestPayout'])->name('finance.request-payout');


    // Payout Methods
    Route::get('/payout-methods', [PayoutMethodController::class, 'index'])->name('payout-methods.index');
    Route::post('/payout-methods', [PayoutMethodController::class, 'store'])->name('payout-methods.store');
    Route::patch('/payout-methods/{payoutMethod}', [PayoutMethodController::class, 'update'])->name('payout-methods.update');
    Route::post('/payout-methods/{payoutMethod}/set-primary', [PayoutMethodController::class, 'setPrimary'])->name('payout-methods.set-primary');
    Route::delete('/payout-methods/{payoutMethod}', [PayoutMethodController::class, 'destroy'])->name('payout-methods.destroy');

    //Mark order as paid
    Route::patch('/orders/{order}/mark-paid', [SupplierController::class, 'markOrderAsPaid'])->name('orders.mark-paid');

});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Product Management Routes
    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}', [AdminProductController::class, 'show'])->name('products.show');
    Route::patch('/products/{product}/status', [AdminProductController::class, 'updateStatus'])->name('products.update-status');
    Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
    Route::post('/products/bulk-update', [AdminProductController::class, 'bulkUpdateStatus'])->name('products.bulk-update');

});

Route::get('logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/customer/logout', [CustomerController::class, 'logout'])->name('customer.logout');


require __DIR__.'/settings.php';
