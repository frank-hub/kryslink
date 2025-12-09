import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { DashboardLayout } from './layout';
import {
  Search, Filter, Download, Eye, FileText,
  ChevronLeft, ChevronRight, MoreVertical
} from 'lucide-react';

interface Order {
  id: string;
  supplier: string;
  date: string;
  items: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-9921', supplier: 'Davita Pharma Ltd', date: '2023-10-25', items: 12, total: 45000, status: 'Processing', paymentStatus: 'Paid' },
  { id: 'ORD-9920', supplier: 'Nairobi Med Supplies', date: '2023-10-24', items: 5, total: 12500, status: 'Shipped', paymentStatus: 'Paid' },
  { id: 'ORD-9919', supplier: 'MedPlus Kenya', date: '2023-10-24', items: 8, total: 28900, status: 'Delivered', paymentStatus: 'Paid' },
  { id: 'ORD-9918', supplier: 'Kenya Generics', date: '2023-10-23', items: 24, total: 112000, status: 'Delivered', paymentStatus: 'Paid' },
  { id: 'ORD-9917', supplier: 'SafeHealth Distributors', date: '2023-10-22', items: 3, total: 8500, status: 'Cancelled', paymentStatus: 'Pending' },
  { id: 'ORD-9916', supplier: 'Davita Pharma Ltd', date: '2023-10-20', items: 15, total: 56000, status: 'Delivered', paymentStatus: 'Overdue' },
  { id: 'ORD-9915', supplier: 'Nairobi Med Supplies', date: '2023-10-18', items: 10, total: 32000, status: 'Delivered', paymentStatus: 'Paid' },
];

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Shipped': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Cancelled': return 'bg-slate-50 text-slate-600 border-slate-100';
        default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getPaymentColor = (status: string) => {
    switch(status) {
        case 'Paid': return 'text-emerald-600 bg-emerald-50';
        case 'Pending': return 'text-amber-600 bg-amber-50';
        case 'Overdue': return 'text-red-600 bg-red-50';
        default: return 'text-slate-600';
    }
  };

  return (
    <DashboardLayout>
      <Head title="Orders" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Procurement Orders</h1>
            <p className="text-slate-500 mt-1">Manage and track your pharmaceutical supplies.</p>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 shadow-sm transition-colors">
                <Download className="h-4 w-4 mr-2" /> Export
            </button>
            <Link href="/marketplace" className="flex items-center px-4 py-2 bg-[#0d9488] text-white rounded-lg font-medium hover:bg-[#0f766e] shadow-sm shadow-teal-500/20 transition-colors">
                <span className="mr-2">+</span> New Order
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         {/* Filters Bar */}
         <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by Order ID or Supplier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] block p-2"
                >
                    <option value="All">All Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
         </div>

         {/* Orders Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Order Details</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Total Amount</th>
                        <th className="px-6 py-4 font-semibold">Payment</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{order.id}</div>
                                    <div className="text-slate-500 text-xs mt-0.5">{order.supplier} • {order.items} Items</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{order.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">KES {order.total.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPaymentColor(order.paymentStatus)}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${order.paymentStatus === 'Paid' ? 'bg-emerald-500' : order.paymentStatus === 'Pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-slate-400 hover:text-[#0d9488] hover:bg-teal-50 rounded" title="View Details">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded" title="Download Invoice">
                                            <FileText className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                No orders found matching your criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>

         {/* Pagination Footer */}
         <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900">1-{filteredOrders.length}</span> of {MOCK_ORDERS.length}</span>
            <div className="flex gap-2">
                <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white disabled:opacity-50" disabled>
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-[#0d9488] hover:border-[#0d9488]">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
         </div>
      </div>
    </DashboardLayout>
  );
}
