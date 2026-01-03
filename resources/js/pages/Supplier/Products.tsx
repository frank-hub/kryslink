
import React, { use } from 'react';
import { Head, Link,usePage } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  Plus, Search, Filter, MoreVertical, Edit2,
  Trash2, AlertTriangle, PackageCheck
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../constants';
import type { Product ,Stats,Paginated } from './Types';
export default function SupplierProducts() {
  // Use mock products but pretend they belong to the supplier

  interface ProductProps{
    products : Paginated<Product>;
    stats: Stats;
  }

  const { products, stats } = usePage<ProductProps>().props;

  const initialProducts = products.data;


  console.log('image:', products.data[0]);


//   const products = MOCK_PRODUCTS.slice(0, 8).map(p => ({
//     ...p,
//     status: p.stock > 0 ? 'Active' : 'Out of Stock',
//     sku: `SKU-${Math.floor(Math.random() * 10000)}`
//   }));

  return (
    <SupplierLayout>
      <Head title="My Products" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
            <p className="text-slate-500">Manage your product listings and stock levels.</p>
        </div>
        <Link
            href="/supplier/products/create"
            className="flex items-center px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition-colors shadow-lg shadow-teal-500/20 font-medium"
        >
            <Plus className="h-5 w-5 mr-2" /> Add New Product
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mr-4"><PackageCheck className="h-6 w-6" /></div>
              <div><p className="text-sm text-slate-500 font-medium">Total Products</p><p className="text-2xl font-bold text-slate-900">{stats.total}</p></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-600 mr-4"><AlertTriangle className="h-6 w-6" /></div>
              <div><p className="text-sm text-slate-500 font-medium">Low Stock</p><p className="text-2xl font-bold text-slate-900">{stats.low_stock}</p></div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center">
              <div className="p-3 bg-red-50 rounded-lg text-red-600 mr-4"><AlertTriangle className="h-6 w-6" /></div>
              <div><p className="text-sm text-slate-500 font-medium">Out of Stock</p><p className="text-2xl font-bold text-slate-900">{stats.out_of_stock}</p></div>
          </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 rounded-t-2xl">
            <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50">
                    All Products <span className="ml-2 bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">142</span>
                </button>
                <button className="flex items-center px-3 py-2 bg-transparent border border-transparent rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-900">
                    Active
                </button>
                <button className="flex items-center px-3 py-2 bg-transparent border border-transparent rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-100 hover:text-slate-900">
                    Drafts
                </button>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search product name, SKU..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                    />
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                    <Filter className="h-5 w-5" />
                </button>
            </div>
        </div>

        {/* Product Grid / Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold w-12"><input type="checkbox" className="rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]" /></th>
                        <th className="px-6 py-4 font-semibold">Product</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Price</th>
                        <th className="px-6 py-4 font-semibold">Stock</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {initialProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]" /></td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-white rounded-lg border border-slate-200 p-1 mr-3">
                                        <img src={product.images} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">{product.name}</div>
                                        <div className="text-xs text-slate-500">{product.sku}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{product.category.name}</td>
                            <td className="px-6 py-4 font-medium text-slate-900">KES {product.price.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <span className={`font-medium ${product.stock < 50 ? 'text-amber-600' : 'text-slate-700'}`}>{product.stock}</span>
                                    {product.stock < 100 && <AlertTriangle className="h-3 w-3 text-amber-500 ml-1.5" />}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    product.stock > 0
                                    ? 'bg-green-50 text-green-700 border border-green-100'
                                    : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            {/* Simple Pagination */}
            <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Showing 8 of 142 products</span>
                <div className="space-x-2">
                    <button className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50 disabled:opacity-50">Prev</button>
                    <button className="px-3 py-1 border border-slate-200 bg-white rounded hover:bg-slate-50">Next</button>
                </div>
            </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
