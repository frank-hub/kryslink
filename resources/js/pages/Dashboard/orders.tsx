import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { DashboardLayout } from './layout';
import {
  Search, Filter, Download, Eye, FileText,
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
}

interface Order {
  id: number;
  order_reference: string;
  supplier: Supplier;
  created_at: string;
  total_amount: number;
  subtotal: number;
  tax: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status: 'Paid' | 'Pending' | 'Overdue';
  payment_method: string;
}

interface PageProps {
  orders: Order[];
}

export default function Orders() {
  const { orders } = usePage<PageProps>().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.order_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, orders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Shipped':    return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Delivered':  return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Cancelled':  return 'bg-slate-50 text-slate-600 border-slate-100';
      default:           return 'bg-slate-50 text-slate-600';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'Paid':    return 'text-emerald-600 bg-emerald-50';
      case 'Pending': return 'text-amber-600 bg-amber-50';
      case 'Overdue': return 'text-red-600 bg-red-50';
      default:        return 'text-slate-600';
    }
  };

  const getPaymentDot = (status: string) => {
    switch (status) {
      case 'Paid':    return 'bg-emerald-500';
      case 'Pending': return 'bg-amber-500';
      case 'Overdue': return 'bg-red-500';
      default:        return 'bg-slate-400';
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
          <Link
            href="/marketplace"
            className="flex items-center px-4 py-2 bg-[#0d9488] text-white rounded-lg font-medium hover:bg-[#0f766e] shadow-sm shadow-teal-500/20 transition-colors"
          >
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
                      <div className="font-bold text-slate-900">{order.order_reference}</div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        {order.supplier?.name ?? '—'} • {order.payment_method}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      KES {Number(order.total_amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPaymentColor(order.payment_status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getPaymentDot(order.payment_status)}`} />
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={route('orders.show', order.id)}
                          className="p-1.5 text-slate-400 hover:text-[#0d9488] hover:bg-teal-50 rounded"
                          title="View Order Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                          title="Download Invoice"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-slate-500 font-medium">No orders found.</p>
                    <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{filteredOrders.length}</span> of{' '}
            <span className="font-medium text-slate-900">{orders.length}</span> orders
          </span>
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
