import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import {
  LayoutGrid, List, Filter, Shield, Plus, Star,
  Search, ArrowUpDown, XCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Layout } from './Layout';
import {route} from 'ziggy-js';

interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  supplier: string;
  price: number;
  stock: number;
  image: string | null;
  verified: boolean;
  dosage: string | null;
  form: string | null;
  requires_prescription: boolean;
}

interface PaginatedProducts {
  data: Product[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface Filters {
  search?: string;
  category?: string;
  sort?: string;
}

interface PageProps {
  products: PaginatedProducts;
  categories: string[];
  filters: Filters;
}

export default function Marketplace() {
  const { products, categories, filters } = usePage<PageProps>().props;

    const [search,   setSearch]   = useState(filters?.search   ?? '');
    const [category, setCategory] = useState(filters?.category ?? 'All');
    const [sortBy,   setSortBy]   = useState(filters?.sort     ?? 'featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debounced server request
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.get(route('marketplace'), {
        search:   search   || undefined,
        category: category !== 'All' ? category : undefined,
        sort:     sortBy   !== 'featured' ? sortBy : undefined,
      }, { preserveState: true, replace: true });
    }, 350);
    return () => clearTimeout(timeout);
  }, [search, category, sortBy]);

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
  };

  const goToPage = (page: number) => {
    router.get(route('marketplace'), {
      search:   search   || undefined,
      category: category !== 'All' ? category : undefined,
      sort:     sortBy   !== 'featured' ? sortBy : undefined,
      page,
    }, { preserveState: true });
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSortBy('featured');
  };

  return (
    <Layout>
      <Head title="Marketplace" />
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Marketplace</h2>
                <p className="mt-2 text-slate-600">
                  Verified medical supplies from licensed distributors.
                  <span className="ml-2 text-sm text-slate-400">
                    {products.total} product{products.total !== 1 ? 's' : ''}
                  </span>
                </p>
              </div>
              <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#0d9488] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#0d9488] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search + Sort */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products, generics, or suppliers..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
                />
              </div>
              <div className="relative w-full md:w-48">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] appearance-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-sm py-4 mb-6 border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-700 shadow-sm mr-2 whitespace-nowrap">
                <Filter className="h-3.5 w-3.5 mr-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
              </div>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border flex-shrink-0 ${
                    category === cat
                      ? 'bg-[#0d9488] border-[#0d9488] text-white shadow-md shadow-teal-500/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {products.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <XCircle className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No products found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {products.data.map(product => (
                  <div
                    key={product.id}
                    className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100 overflow-hidden cursor-pointer ${
                      viewMode === 'list' ? 'flex flex-row items-center p-4 gap-6' : 'flex flex-col'
                    }`}
                    onClick={() => router.visit(route('product.show', product.id))}
                  >
                    {/* Image */}
                    <div className={`relative ${
                      viewMode === 'list'
                        ? 'h-32 w-32 flex-shrink-0 bg-slate-50 rounded-xl'
                        : 'aspect-[4/3] bg-slate-50 w-full border-b border-slate-50'
                      } p-4 flex items-center justify-center overflow-hidden`}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`object-contain mix-blend-multiply transition-transform duration-500 ${
                            viewMode === 'grid' ? 'w-full h-full group-hover:scale-110' : 'h-full w-full'
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                          No image
                        </div>
                      )}

                      {product.verified && (
                        <div className="absolute top-2 left-2">
                          <div className="bg-white/90 backdrop-blur text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center shadow-sm border border-emerald-100">
                            <Shield className="h-3 w-3 mr-1" fill="currentColor" /> Verified
                          </div>
                        </div>
                      )}

                      {product.requires_prescription && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100">
                            POM
                          </div>
                        </div>
                      )}

                      {viewMode === 'grid' && (
                        <button
                          onClick={e => addToCart(product, e)}
                          className="absolute bottom-3 right-3 bg-white text-slate-900 p-2.5 rounded-full shadow-lg hover:bg-[#0d9488] hover:text-white transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 border border-slate-100"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 flex flex-col ${viewMode === 'grid' ? 'p-5' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold tracking-wider text-[#0d9488] uppercase bg-teal-50 px-2 py-0.5 rounded-sm">
                          {product.category}
                        </span>
                        {product.stock < 100 && product.stock > 0 && (
                          <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">
                            Low Stock
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-[#0d9488] transition-colors">
                        {product.name}
                      </h3>

                      {product.dosage && (
                        <p className="text-xs text-slate-400 mb-1">{product.dosage} · {product.form}</p>
                      )}

                      <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                        By <span className="font-medium text-slate-700">{product.supplier}</span>
                      </p>

                      <div className={`mt-auto flex items-center justify-between ${
                        viewMode === 'list' ? 'gap-8' : 'pt-4 border-t border-slate-50'
                      }`}>
                        <p className="text-lg font-bold text-slate-900">
                          KES {product.price.toLocaleString()}
                        </p>
                        {viewMode === 'list' && (
                          <button
                            onClick={e => addToCart(product, e)}
                            className="px-6 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {products.last_page > 1 && (
                <div className="mt-10 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Showing {((products.current_page - 1) * products.per_page) + 1}–{Math.min(products.current_page * products.per_page, products.total)} of {products.total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => goToPage(products.current_page - 1)}
                      disabled={products.current_page === 1}
                      className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: products.last_page }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === products.last_page || Math.abs(p - products.current_page) <= 1)
                      .map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className="px-2 py-2 text-slate-400">…</span>
                          )}
                          <button
                            onClick={() => goToPage(page)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
                              page === products.current_page
                                ? 'bg-[#0d9488] text-white border-[#0d9488]'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#0d9488] hover:text-[#0d9488]'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))
                    }
                    <button
                      onClick={() => goToPage(products.current_page + 1)}
                      disabled={products.current_page === products.last_page}
                      className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}