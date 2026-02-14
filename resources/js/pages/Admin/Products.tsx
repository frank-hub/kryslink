import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from './Layout';
import {
  Package, Search, Filter, Download, Eye, Edit2, Trash2,
  MoreVertical, AlertTriangle, CheckCircle, XCircle, ChevronDown,
  Grid, List, RefreshCw, X
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock_quantity: number;
  status: string;
  supplier: {
    id: number;
    name: string;
    email: string;
  };
  category?: {
    id: number;
    name: string;
  };
  image?: string;
  created_at: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
  low_stock: number;
  out_of_stock: number;
}

interface Filters {
  search?: string;
  status: string;
  supplier_id?: number;
  category_id?: number;
  stock_status?: string;
  sort_by: string;
  sort_order: string;
}

interface ProductsProps {
  products: {
    data: Product[];
    links: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  suppliers: Supplier[];
  categories: Category[];
  stats: Stats;
  filters: Filters;
}

export default function AdminProducts({
  products,
  suppliers,
  categories,
  stats,
  filters
}: ProductsProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const handleSearch = (search: string) => {
    router.get('admin.products.index'), { ...filters, search }, {
      preserveState: true,
      preserveScroll: true,
    };
  };

  const handleFilter = (key: string, value: any) => {
    router.get('admin.products.index'), { ...filters, [key]: value }, {
      preserveState: true,
      preserveScroll: true,
    };
  };

  const clearFilters = () => {
    router.get('admin.products.index');
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.data.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.data.map(p => p.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) return;

    if (action === 'activate') {
      router.post('admin.products.bulk-update'), {
        product_ids: selectedProducts,
        status: 'active',
      }, {
        onSuccess: () => setSelectedProducts([]),
      };
    } else if (action === 'deactivate') {
      router.post('admin.products.bulk-update'), {
        product_ids: selectedProducts,
        status: 'inactive',
      }, {
        onSuccess: () => setSelectedProducts([]),
      };
    }
  };

  const handleUpdateStatus = (productId: number, status: string) => {
    router.patch('admin.products.update-status', { id: productId, status });
  };

  const handleDelete = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      router.delete(`admin/products/destroy/${productId}`);
    }
  };

  const getStockStatusColor = (quantity: number) => {
    if (quantity === 0) return 'text-red-600 bg-red-50 border-red-100';
    if (quantity <= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-green-600 bg-green-50 border-green-100';
  };

  const getStockStatusText = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 50) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <AdminLayout>
      <Head title="All Products" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Products</h1>
          <p className="text-slate-500">Manage products from all suppliers</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Inactive</p>
          <p className="text-2xl font-bold text-slate-400">{stats.inactive}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600">{stats.low_stock}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{stats.out_of_stock}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                defaultValue={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {selectedProducts.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                >
                  Activate ({selectedProducts.length})
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  Deactivate ({selectedProducts.length})
                </button>
              </div>
            )}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilter('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Supplier</label>
                <select
                  value={filters.supplier_id || ''}
                  onChange={(e) => handleFilter('supplier_id', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Stock Status</label>
                <select
                  value={filters.stock_status || ''}
                  onChange={(e) => handleFilter('stock_status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="">All Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Sort By</label>
                <select
                  value={filters.sort_by}
                  onChange={(e) => handleFilter('sort_by', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="created_at">Date Added</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock_quantity">Stock</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900"
              >
                <X className="h-4 w-4 mr-1" /> Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.data.length && products.data.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                    />
                  </th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.data.length > 0 ? (
                  products.data.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <Link
                            //   href={route('admin.products.show', product.id)}
                              className="font-bold text-slate-900 hover:text-teal-600"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-slate-500">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{product.supplier.name}</p>
                        <p className="text-xs text-slate-500">{product.supplier.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">KES {product.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStockStatusColor(product.stock_quantity)}`}>
                          {product.stock_quantity} units
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{getStockStatusText(product.stock_quantity)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleUpdateStatus(product.id, product.status === 'active' ? 'inactive' : 'active')}
                          className={`px-2 py-0.5 rounded text-xs font-black uppercase border ${
                            product.status === 'active'
                              ? 'bg-green-50 text-green-700 border-green-100'
                              : 'bg-slate-50 text-slate-600 border-slate-100'
                          }`}
                        >
                          {product.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            // href={route('admin.products.show', product.id)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">No products found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Grid View
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.data.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="rounded border-slate-300 text-teal-500 focus:ring-teal-500"
                  />
                  <span className={`px-2 py-0.5 rounded text-xs font-black uppercase border ${
                    product.status === 'active'
                      ? 'bg-green-50 text-green-700 border-green-100'
                      : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {product.status}
                  </span>
                </div>
                <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                  <Package className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{product.supplier.name}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-slate-900">KES {product.price.toLocaleString()}</span>
                  <span className={`text-xs font-bold ${getStockStatusColor(product.stock_quantity).split(' ')[0]}`}>
                    {product.stock_quantity} units
                  </span>
                </div>
                <Link
                //   href={route('admin.products.show', product.id)}
                  className="block w-full px-4 py-2 bg-teal-50 text-teal-600 rounded-lg text-center text-sm font-bold hover:bg-teal-100 transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {products.last_page > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-400 font-medium">
              Showing {products.data.length} of {products.total} products
            </p>
            <div className="flex gap-2">
              {products.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  preserveState
                  preserveScroll
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    link.active
                      ? 'bg-teal-500 text-white'
                      : link.url
                      ? 'bg-white text-slate-600 hover:bg-slate-100'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}