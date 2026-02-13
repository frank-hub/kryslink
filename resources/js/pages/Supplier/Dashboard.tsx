
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  TrendingUp, TrendingDown, DollarSign, Package,
  ShoppingCart, ArrowUpRight, MoreHorizontal,
  AlertCircle, CheckCircle2, Clock, Eye
} from 'lucide-react';


interface DashboardMetrics {
  totalRevenue: {
    value: number;
    formatted: string;
    change: number;
    trend: 'up' | 'down';
  };
  pendingOrders: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  activeProducts: {
    value: number;
    change: number;
    trend: 'up' | 'down';
  };
  ordersShipped: {
    value: number;
    formatted: string;
    change: number;
    trend: 'up' | 'down';
  };
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface LowStockProduct {
  name: string;
  stock: number;
}

interface DashboardProps {
  metrics: DashboardMetrics;
  revenueAnalytics: RevenueData[];
  lowStockAlerts: LowStockProduct[];
  recentOrders: any[];
}

const StatCard = ({ title, value, change, trend, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
                    <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                {trend === 'up' ? (
                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        <TrendingUp className="h-3 w-3 mr-1" /> {change}
                    </span>
                ) : (
                    <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                        <TrendingDown className="h-3 w-3 mr-1" /> {change}
                    </span>
                )}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        {/* Background decoration */}
        <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-5 group-hover:scale-110 transition-transform ${colorClass}`}></div>
    </div>
);

export default function SupplierDashboard
({ 
  metrics, 
  revenueAnalytics, 
  lowStockAlerts,
  recentOrders 
}: DashboardProps){

  const orders = [
    { id: 'ORD-7782', pharmacy: 'City Square Pharmacy', amount: 45000, date: '10 mins ago', status: 'Pending', items: 12 },
    { id: 'ORD-7781', pharmacy: 'Westlands Health Centre', amount: 128000, date: '1 hour ago', status: 'Processing', items: 45 },
    { id: 'ORD-7780', pharmacy: 'MediLife Hospital', amount: 24500, date: '3 hours ago', status: 'Shipped', items: 8 },
    { id: 'ORD-7779', pharmacy: 'GoodHope Chemists', amount: 8900, date: 'Yesterday', status: 'Delivered', items: 3 },
    { id: 'ORD-7778', pharmacy: 'Nairobi West Hosp.', amount: 210000, date: 'Yesterday', status: 'Cancelled', items: 62 },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
        case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Cancelled': return 'bg-slate-50 text-slate-600 border-slate-100';
        default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <SupplierLayout>
        <Head title="Supplier Dashboard" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                <p className="text-slate-500">Here's what's happening with your store today.</p>
            </div>
            <div className="flex gap-3">
                 <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
                    Download Report
                </button>
                <Link href="/supplier/products/create" className="bg-[#0d9488] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all flex items-center">
                    <Package className="h-4 w-4 mr-2" /> Add Product
                </Link>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Revenue"
                value={metrics.totalRevenue.formatted}
                change={`${metrics.totalRevenue.change}%`}
                trend={metrics.totalRevenue.trend}
                icon={DollarSign}
                colorClass="bg-emerald-500"
            />
            <StatCard
                title="Pending Orders"
                value={metrics.pendingOrders.value}
                change={`${metrics.pendingOrders.change > 0 ? '+' : ''}${metrics.pendingOrders.change}`}
                trend={metrics.pendingOrders.trend}
                icon={ShoppingCart}
                colorClass="bg-amber-500"
            />
            <StatCard
                title="Active Products"
                value={metrics.activeProducts.value}
                change={`${metrics.activeProducts.change > 0 ? '+' : ''}${metrics.activeProducts.change}`}
                trend={metrics.activeProducts.trend}
                icon={Package}
                colorClass="bg-blue-500"
            />
             <StatCard
                title="Shipped Orders"
                value={metrics.ordersShipped.formatted}
                change={`${metrics.ordersShipped.change}%`}
                trend={metrics.ordersShipped.trend}
                icon={Eye}
                colorClass="bg-purple-500"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">

                {/* Revenue Analytics Chart - FIXED */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
                            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        
                        <div className="relative">
                            {/* Y-axis labels */}
                            {revenueAnalytics && revenueAnalytics.length > 0 && (
                                <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-[10px] text-slate-400 pr-2 w-12">
                                    {(() => {
                                        const maxRevenue = Math.max(...revenueAnalytics.map(d => d.revenue));
                                        return [1, 0.75, 0.5, 0.25, 0].map((percent, i) => {
                                            const value = maxRevenue * percent;
                                            return (
                                                <div key={i} className="text-right">
                                                    {value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toFixed(0)}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            )}

                            {/* Chart Container */}
                            <div className="h-64 w-full flex items-end justify-between gap-2 pl-14 pr-2">
                                {revenueAnalytics && revenueAnalytics.length > 0 ? (
                                    (() => {
                                        const maxRevenue = Math.max(...revenueAnalytics.map(d => d.revenue));
                                        return revenueAnalytics.map((day, i) => {
                                            const barHeight = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                                            
                                            return (
                                                <div 
                                                    key={i} 
                                                    className="flex-1 relative group cursor-pointer"
                                                    style={{ minWidth: '40px' }}
                                                >
                                                    {/* Bar background */}
                                                    <div className="absolute bottom-0 w-full h-full bg-teal-50 rounded-t-lg"></div>
                                                    
                                                    {/* Bar fill */}
                                                    <div
                                                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#0d9488] to-[#14b8a6] rounded-t-lg transition-all duration-500 shadow-lg group-hover:shadow-xl"
                                                        style={{ 
                                                            height: `${Math.max(barHeight, 3)}%`,
                                                            minHeight: '8px'
                                                        }}
                                                    ></div>
                                                    
                                                    {/* Tooltip */}
                                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-2 px-3 rounded-lg pointer-events-none transition-all duration-200 whitespace-nowrap z-20 shadow-xl">
                                                        <div className="font-bold text-sm">KES {day.revenue.toLocaleString()}</div>
                                                        <div className="text-[10px] text-emerald-300 mt-1">{day.orders} {day.orders === 1 ? 'order' : 'orders'}</div>
                                                        <div className="text-[10px] text-slate-400 mt-0.5">{day.date}</div>
                                                        {/* Tooltip arrow */}
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <div className="text-center text-slate-400">
                                            <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            <p className="text-sm font-semibold text-slate-600">No Revenue Data</p>
                                            <p className="text-xs mt-1.5 text-slate-500">Revenue from paid orders will appear here</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* X-axis labels */}
                            {revenueAnalytics && revenueAnalytics.length > 0 && (
                                <div className="flex justify-between pl-14 pr-2 mt-3 border-t border-slate-100 pt-2">
                                    {revenueAnalytics.map((day, i) => (
                                        <div 
                                            key={i} 
                                            className="text-[11px] text-slate-600 font-medium text-center flex-1"
                                        >
                                            {day.date}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900">Recent Incoming Orders</h3>
                            <p className="text-sm text-slate-500 mt-1">Manage new orders from pharmacies.</p>
                        </div>
                        <Link href="/supplier/orders" className="text-sm font-medium text-[#0d9488] hover:text-[#0f766e] flex items-center bg-teal-50 px-3 py-1.5 rounded-full transition-colors">
                            View All Orders <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Order ID</th>
                                    <th className="px-6 py-4 font-semibold">Customer</th>
                                    <th className="px-6 py-4 font-semibold">Items</th>
                                    <th className="px-6 py-4 font-semibold">Amount</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {order.id}
                                            <div className="text-[10px] text-slate-400 font-normal">{order.date}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{order.pharmacy}</td>
                                        <td className="px-6 py-4 text-slate-500">{order.items} items</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">KES {order.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Right Sidebar Column */}
            <div className="space-y-8">

                {/* Inventory Alert */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        Low Stock Alerts
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Amoxicillin 500mg', stock: 12, total: 500 },
                            { name: 'Panadol Extra', stock: 45, total: 1000 },
                            { name: 'Surgical Masks', stock: 80, total: 5000 }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-slate-700 text-sm">{item.name}</span>
                                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{item.stock} left</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(item.stock / item.total) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-sm text-slate-600 font-medium hover:text-[#0d9488] transition-colors">
                        View All Inventory
                    </button>
                </div>

                {/* Pending Tasks */}
                <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-900/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-4">Pending Tasks</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <div className="bg-indigo-700 p-1 rounded mt-0.5 mr-3"><Clock className="h-3 w-3" /></div>
                                <span className="text-indigo-100 text-sm">Verify KRA ETIMS integration for new tax year.</span>
                            </li>
                            <li className="flex items-start">
                                <div className="bg-indigo-700 p-1 rounded mt-0.5 mr-3"><CheckCircle2 className="h-3 w-3" /></div>
                                <span className="text-indigo-100 text-sm">Review bulk discount request from City General.</span>
                            </li>
                        </ul>
                    </div>
                    {/* Abstract shapes */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 opacity-20 rounded-full -ml-12 -mb-12 blur-lg"></div>
                </div>

            </div>
        </div>

    </SupplierLayout>
  );
}
