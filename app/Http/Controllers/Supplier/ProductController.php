<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier'])
            ->where('supplier_id', Auth::id());

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $products = $query->paginate(15);

        // Stats
        $stats = [
            'total' => Product::where('supplier_id', Auth::id())->count(),
            'low_stock' => Product::where('supplier_id', Auth::id())->lowStock()->count(),
            'out_of_stock' => Product::where('supplier_id', Auth::id())->outOfStock()->count(),
        ];

        return Inertia::render('Supplier/Products/Index', [
            'products' => $products,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function create()
    {
        $categories = Category::active()->get();

        return Inertia::render('Supplier/CreateProduct', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'generic_name' => 'nullable|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'pack_size' => 'nullable|string|max:100',
            'dosage' => 'nullable|string|max:100',
            'form' => 'nullable|string|max:100',
            'status' => 'required|in:draft,active',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'documents' => 'nullable|array|max:5',
            'documents.*' => 'file|mimes:pdf,doc,docx|max:5120',
        ]);

        // Generate SKU
        $validated['sku'] = 'PRD-' . strtoupper(Str::random(8));
        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);
        $validated['supplier_id'] = Auth::id();

        // Handle image uploads
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $imagePaths[] = $path;
            }
            $validated['images'] = $imagePaths;
        }

        // Handle document uploads
        if ($request->hasFile('documents')) {
            $documentPaths = [];
            foreach ($request->file('documents') as $document) {
                $path = $document->store('documents', 'public');
                $documentPaths[] = [
                    'name' => $document->getClientOriginalName(),
                    'path' => $path,
                ];
            }
            $validated['documents'] = $documentPaths;
        }

        $product = Product::create($validated);

        return redirect()->route('supplier.products.index')
            ->with('success', 'Product created successfully!');
    }

    public function show(Product $product)
    {

        $product->load(['category', 'supplier', 'reviews.user']);

        return Inertia::render('Supplier/Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product)
    {

        $categories = Category::active()->get();

        return Inertia::render('Supplier/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'generic_name' => 'nullable|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'pack_size' => 'nullable|string|max:100',
            'dosage' => 'nullable|string|max:100',
            'form' => 'nullable|string|max:100',
            'manufacturer' => 'nullable|string|max:255',
            'country_of_origin' => 'nullable|string|max:100',
            'batch_number' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date|after:today',
            'requires_prescription' => 'boolean',
            'requires_cold_chain' => 'boolean',
            'status' => 'required|in:draft,active,discontinued',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'existing_images' => 'nullable|array',
            'documents' => 'nullable|array|max:5',
            'documents.*' => 'file|mimes:pdf,doc,docx|max:5120',
            'existing_documents' => 'nullable|array',
        ]);

        // Handle images
        $existingImages = $request->input('existing_images', []);
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $existingImages[] = $path;
            }
        }
        $validated['images'] = $existingImages;

        // Handle documents
        $existingDocs = $request->input('existing_documents', []);
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $document) {
                $path = $document->store('documents', 'public');
                $existingDocs[] = [
                    'name' => $document->getClientOriginalName(),
                    'path' => $path,
                ];
            }
        }
        $validated['documents'] = $existingDocs;

        $product->update($validated);

        return redirect()->route('supplier.products.index')
            ->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {

        // Check if product has orders
        if ($product->orderItems()->exists()) {
            return back()->with('error', 'Cannot delete product with existing orders.');
        }

        // Delete images
        if ($product->images) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        // Delete documents
        if ($product->documents) {
            foreach ($product->documents as $doc) {
                Storage::disk('public')->delete($doc['path']);
            }
        }

        $product->delete();

        return redirect()->route('supplier.products.index')
            ->with('success', 'Product deleted successfully!');
    }

    public function updateStock(Request $request, Product $product)
    {

        $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $product->update(['stock' => $request->stock]);

        return back()->with('success', 'Stock updated successfully!');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $products = Product::whereIn('id', $request->product_ids)
            ->where('supplier_id', Auth::id())
            ->get();

        foreach ($products as $product) {
            if (!$product->orderItems()->exists()) {
                $product->delete();
            }
        }

        return back()->with('success', 'Selected products deleted successfully!');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
            'status' => 'required|in:draft,active,discontinued',
        ]);

        Product::whereIn('id', $request->product_ids)
            ->where('supplier_id', Auth::id())
            ->update(['status' => $request->status]);

        return back()->with('success', 'Product status updated successfully!');
    }
}
