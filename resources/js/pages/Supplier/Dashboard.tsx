
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  TrendingUp, TrendingDown, DollarSign, Package,
  ShoppingCart, ArrowUpRight, MoreHorizontal,
  AlertCircle, CheckCircle2, Clock, Eye
} from 'lucide-react';

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

export default function SupplierDashboard() {
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
                value="KES 4.2M"
                change="+12.5%"
                trend="up"
                icon={DollarSign}
                colorClass="bg-emerald-500"
            />
            <StatCard
                title="Pending Orders"
                value="18"
                change="+4"
                trend="up"
                icon={ShoppingCart}
                colorClass="bg-amber-500"
            />
            <StatCard
                title="Active Products"
                value="142"
                change="-2"
                trend="down"
                icon={Package}
                colorClass="bg-blue-500"
            />
             <StatCard
                title="Product Views"
                value="8.5K"
                change="+24%"
                trend="up"
                icon={Eye}
                colorClass="bg-purple-500"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">

                {/* Sales Chart Area Placeholder */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900">Revenue Analytics</h3>
                        <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    {/* Visual Placeholder for Chart */}
                    <div className="h-64 w-full flex items-end justify-between space-x-2 px-2">
                         {[35, 45, 30, 60, 75, 50, 65, 80, 70, 45, 60, 90].map((h, i) => (
                             <div key={i} className="w-full bg-teal-50 rounded-t-lg relative group">
                                 <div
                                    className="absolute bottom-0 w-full bg-[#0d9488] rounded-t-lg transition-all duration-500 opacity-80 group-hover:opacity-100"
                                    style={{ height: `${h}%` }}
                                 ></div>
                                 <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                                     KES {h}k
                                 </div>
                             </div>
                         ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-4 px-2">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
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
