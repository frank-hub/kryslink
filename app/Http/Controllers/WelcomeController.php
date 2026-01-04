<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;


class WelcomeController extends Controller
{
    public function index(Request $request)
    {

        $query = Product::with(['category', 'supplier'])
            ->active()           // Only show active products
            ->verified()         // Only show verified products
            ->inStock();         // Only show products in stock

        // Limit to 8 featured products for the homepage
        $featuredProducts = $query
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category->name ?? 'Uncategorized',
                    'description' => $product->description,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'image' => $product->image, // Uses the accessor from your model
                    'supplier' => $product->supplier->organization_name ?? $product->supplier->name,
                    'rating' => $product->rating,
                    'verified' => $product->is_verified,
                ];
            });

        // Get total counts for stats display
        $stats = [
            'total_products' => Product::active()->count(),
            'total_suppliers' => \App\Models\User::where('role', 'SUPPLIER')
                ->where('is_verified', true)
                ->count(),
            'verified_products' => Product::verified()->count(),
        ];

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'products' => $featuredProducts,
            'stats' => $stats,
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'supplier'])
            ->active()
            ->verified()
            ->inStock()
            ->findOrFail($id);

        $productDetails = [
            'id' => $product->id,
            'name' => $product->name,
            'category' => $product->category->name ?? 'Uncategorized',
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'image' => $product->image,
            'supplier' => $product->supplier->name,
            'rating' => $product->rating,
            'verified' => $product->is_verified,
        ];

        // dd($productDetails);

        return Inertia::render('ProductShow', [
            'product' => $productDetails,
        ]);
    }
}
