import React from 'react';
import { Head } from '@inertiajs/react';
import { AdminLayout } from './Layout';
import {
  Users, Package, Wallet, TrendingUp, ArrowUpRight,
  ArrowDownRight, Activity, ShoppingBag, AlertCircle
} from 'lucide-react';

interface Metrics {
  suppliers: {
    total: number;
    active: number;
    new_this_month: number;
    growth: number;
  };
  products: {
    total: number;
    active: number;
    low_stock: number;
  };
  revenue: {
    total: number;
    this_month: number;
    growth: number;
    formatted: string;
  };
  payouts: {
    pending_count: number;
    pending_amount: number;
    formatted: string;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
  };
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

interface TopSupplier {
  id: number;
  name: string;
  email: string;
  revenue: number;
  orders: number;
}

interface Activity {
  type: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface DashboardProps {
  metrics: Metrics;
  revenueOverTime: RevenueData[];
  topSuppliers: TopSupplier[];
  recentActivities: Activity[];
  orderStatusBreakdown: OrderStatus[];
}

const StatCard = ({ title, value, subtitle, change, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color.bg}`}>
        <Icon className={`h-6 w-6 ${color.text}`} />
      </div>
      {change !== undefined && (
        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
          change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {change >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
    <p className="text-sm font-medium text-slate-500">{title}</p>
    {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
  </div>
);

export default function AdminDashboard({
  metrics,
  revenueOverTime,
  topSuppliers,
  recentActivities,
  orderStatusBreakdown
}: DashboardProps) {
  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Monitor platform performance and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Suppliers"
          value={metrics.suppliers.total}
          subtitle={`${metrics.suppliers.active} active`}
          change={metrics.suppliers.growth}
          icon={Users}
          color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
        />
        <StatCard
          title="Total Products"
          value={metrics.products.total}
          subtitle={`${metrics.products.low_stock} low stock`}
          icon={Package}
          color={{ bg: 'bg-purple-50', text: 'text-purple-600' }}
        />
        <StatCard
          title="Platform Revenue"
          value={metrics.revenue.formatted}
          change={metrics.revenue.growth}
          icon={TrendingUp}
          color={{ bg: 'bg-green-50', text: 'text-green-600' }}
        />
        <StatCard
          title="Pending Payouts"
          value={metrics.payouts.pending_count}
          subtitle={metrics.payouts.formatted}
          icon={Wallet}
          color={{ bg: 'bg-amber-50', text: 'text-amber-600' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Revenue Over Time</h3>
            <div className="text-xs text-slate-400 font-medium">Last 30 Days</div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {revenueOverTime && revenueOverTime.length > 0 ? (
              (() => {
                const maxRevenue = Math.max(...revenueOverTime.map(d => d.revenue));
                return revenueOverTime.map((day, i) => {
                  const heightPercent = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={i} className="flex-1 bg-slate-50 rounded-t-lg relative group h-full">
                      <div
                        className="absolute bottom-0 w-full bg-teal-500/80 group-hover:bg-teal-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${Math.max(heightPercent, 3)}%`, minHeight: '4px' }}
                      ></div>
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-2 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        <div className="font-bold">KES {day.revenue.toLocaleString()}</div>
                        <div className="text-slate-300">{day.orders} orders</div>
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="flex items-center justify-center w-full h-full text-slate-400">
                <p className="text-sm">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Order Status</h3>
          <div className="space-y-4">
            {orderStatusBreakdown.map((status, index) => {
              const colors = [
                'bg-amber-500',
                'bg-blue-500',
                'bg-purple-500',
                'bg-green-500',
                'bg-slate-400'
              ];
              const total = orderStatusBreakdown.reduce((sum, s) => sum + s.count, 0);
              const percentage = total > 0 ? (status.count / total) * 100 : 0;
              
              return (
                <div key={status.status}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">{status.status}</span>
                    <span className="text-xs font-black text-slate-400">{status.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`${colors[index % colors.length]} h-full rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Suppliers */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Top Suppliers This Month</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {topSuppliers && topSuppliers.length > 0 ? (
              topSuppliers.map((supplier, index) => (
                <div key={supplier.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{supplier.name}</p>
                        <p className="text-xs text-slate-500">{supplier.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">KES {supplier.revenue.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">Revenue</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p className="text-sm">No supplier data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${
                      activity.type === 'supplier_joined' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {activity.icon === 'user' ? <Users className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}