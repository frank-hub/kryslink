
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { DashboardLayout } from './layout';
import {
  TrendingUp, ShoppingBag, AlertCircle, FileCheck,
  ArrowRight, Clock, CheckCircle2, MoreHorizontal, Shield
} from 'lucide-react';

const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" /> {change}
            </span>
            <span className="text-slate-400 ml-2">vs last month</span>
        </div>
    </div>
);

export default function DashboardIndex() {
  const recentOrders = [
    { id: '#ORD-9921', supplier: 'Davita Pharma Ltd', items: 12, total: 45000, status: 'Processing', date: 'Today, 10:30 AM' },
    { id: '#ORD-9920', supplier: 'Nairobi Med Supplies', items: 5, total: 12500, status: 'Shipped', date: 'Yesterday' },
    { id: '#ORD-9918', supplier: 'MedPlus Kenya', items: 24, total: 112000, status: 'Delivered', date: 'Oct 24, 2023' },
    { id: '#ORD-9915', supplier: 'Kenya Generics', items: 8, total: 28000, status: 'Cancelled', date: 'Oct 22, 2023' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Shipped': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Cancelled': return 'bg-slate-50 text-slate-600 border-slate-100';
        default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <DashboardLayout>
        <Head title="Dashboard" />

        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
            <p className="text-slate-500 mt-1">Welcome back, City Square Pharmacy.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                title="Total Spend (Oct)"
                value="KES 1.2M"
                change="+12.5%"
                icon={ShoppingBag}
                color="bg-[#0d9488]"
            />
            <MetricCard
                title="Active Orders"
                value="3"
                change="+1"
                icon={Clock}
                color="bg-blue-500"
            />
            <MetricCard
                title="Pending Invoices"
                value="KES 45K"
                change="-5.2%"
                icon={FileCheck}
                color="bg-amber-500"
            />
            <MetricCard
                title="Low Stock Items"
                value="8"
                change="Urgent"
                icon={AlertCircle}
                color="bg-red-500"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Recent Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent Orders</h3>
                    <Link href="/dashboard/orders" className="text-sm font-medium text-[#0d9488] hover:text-[#0f766e] flex items-center">
                        View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Supplier</th>
                                <th className="px-6 py-4 font-semibold">Total</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-medium">{order.supplier}</span>
                                            <span className="text-xs text-slate-500">{order.items} items • {order.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">KES {order.total.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 p-1">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions & Notifications */}
            <div className="space-y-8">

                {/* Action Card */}
                <div className="bg-[#0d9488] rounded-2xl p-6 text-white shadow-lg shadow-teal-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-2">Restock Inventory?</h3>
                        <p className="text-teal-100 text-sm mb-6">Based on your usage, you are running low on Amoxicillin and Panadol.</p>
                        <Link href="/marketplace" className="inline-flex items-center bg-white text-[#0d9488] px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-50 transition-colors">
                            Order Now <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-teal-900/10 rounded-full blur-xl"></div>
                </div>

                {/* Compliance Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <Shield className="h-5 w-5 text-[#0d9488] mr-2" />
                        Compliance Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-sm font-medium text-slate-700">PPB License</span>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-sm font-medium text-slate-700">KRA Tax Status</span>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Compliant
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </DashboardLayout>
  );
}
