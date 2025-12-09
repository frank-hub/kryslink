
import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { LayoutGrid, List, Filter, Shield, Plus, Star, Search, SlidersHorizontal, ArrowUpDown, XCircle } from 'lucide-react';
import { Layout } from './Layout';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../../../types';

export default function Marketplace() {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured');

  const categories = ['All', 'Antibiotics', 'Pain Relief', 'Diabetes Care', 'Medical Supplies', 'Respiratory', 'Gastrointestinal'];

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // Category Filter
    if (filterCategory !== 'All') {
      result = result.filter(p => p.category === filterCategory);
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [filterCategory, searchQuery, sortBy]);

  const addToCart = (product: Product) => {
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
  };

  return (
    <Layout>
      <Head title="Marketplace" />
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header & Main Controls */}
          <div className="mb-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Marketplace</h2>
                <p className="mt-2 text-slate-600">Verified medical supplies from licensed distributors.</p>
              </div>
              <div className="flex items-center gap-2">
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
            </div>

            {/* Search and Sort Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products, generics, or suppliers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-48">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
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
          </div>

          {/* Sticky Categories */}
          <div className="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-sm py-4 mb-6 border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <div className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-700 shadow-sm mr-2 whitespace-nowrap">
                      <Filter className="h-3.5 w-3.5 mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
                  </div>
                  {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border flex-shrink-0 ${
                        filterCategory === cat
                        ? 'bg-[#0d9488] border-[#0d9488] text-white shadow-md shadow-teal-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                  ))}
              </div>
          </div>

          {/* Product Results */}
          {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-slate-100 p-4 rounded-full mb-4">
                      <XCircle className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No products found</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={() => { setFilterCategory('All'); setSearchQuery(''); }}
                    className="mt-6 px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                      Clear Filters
                  </button>
              </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                <div
                    key={product.id}
                    className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-100 overflow-hidden cursor-pointer ${
                        viewMode === 'list' ? 'flex flex-row items-center p-4 gap-6' : 'flex flex-col'
                    }`}
                    onClick={() => router.visit(`/product/${product.id}`)}
                >
                    {/* Image Area */}
                    <div className={`relative ${viewMode === 'list' ? 'h-32 w-32 flex-shrink-0 bg-slate-50 rounded-xl' : 'aspect-[4/3] bg-slate-50 w-full border-b border-slate-50'} p-4 flex items-center justify-center overflow-hidden`}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className={`object-contain mix-blend-multiply transition-transform duration-500 ${viewMode === 'grid' ? 'w-full h-full group-hover:scale-110' : 'h-full w-full'}`}
                        />
                        {product.verified && (
                            <div className="absolute top-2 left-2">
                                <div className="bg-white/90 backdrop-blur text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center shadow-sm border border-emerald-100">
                                    <Shield className="h-3 w-3 mr-1" fill="currentColor" /> Verified
                                </div>
                            </div>
                        )}
                        {viewMode === 'grid' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                className="absolute bottom-3 right-3 bg-white text-slate-900 p-2.5 rounded-full shadow-lg hover:bg-[#0d9488] hover:text-white transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 border border-slate-100"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className={`flex-1 flex flex-col ${viewMode === 'grid' ? 'p-5' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold tracking-wider text-[#0d9488] uppercase bg-teal-50 px-2 py-0.5 rounded-sm">
                                {product.category}
                            </span>
                            <div className="flex items-center text-amber-400">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <span className="text-xs font-medium text-slate-500 ml-1">{product.rating}</span>
                            </div>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-[#0d9488] transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                            By <span className="font-medium text-slate-700">{product.supplier}</span>
                        </p>

                        <div className={`mt-auto flex items-center justify-between ${viewMode === 'list' ? 'gap-8' : 'pt-4 border-t border-slate-50'}`}>
                            <div>
                                <p className="text-lg font-bold text-slate-900">KES {product.price.toLocaleString()}</p>
                            </div>

                            {viewMode === 'list' ? (
                                 <button
                                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                    className="px-6 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                                 >
                                    Add to Cart
                                 </button>
                            ) : (
                                product.stock < 100 && (
                                    <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
                                        Low Stock
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
