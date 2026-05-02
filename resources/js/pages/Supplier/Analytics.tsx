import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  BarChart3, TrendingUp, Users, ShoppingBag,
  ArrowDownRight, Download, Calendar, Activity,
  Pill, Building2, ChevronRight, Map, Zap, Package
} from 'lucide-react';

interface Metric {
  value: number;
  formatted?: string;
  change: number;
  trend: 'up' | 'down';
}

interface AnalyticsMetrics {
  grossSales: Metric;
  orderVolume: Metric;
  avgOrderValue: Metric;
  newCustomers: Metric;
}

interface RevenuePerformanceData {
  date: string;
  revenue: number;
}

interface RegionalSale {
  region: string;
  sales: number;
  orders: number;
  percentage: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface CategorySale {
  category: string;
  revenue: number;
  orders: number;
}

interface StatusBreakdown {
  status: string;
  count: number;
}

interface PaymentBreakdown {
  status: string;
  count: number;
  amount: number;
}

interface PageProps {
  metrics: AnalyticsMetrics;
  revenuePerformance: RevenuePerformanceData[];
  regionalSales: RegionalSale[];
  topRegion: RegionalSale | null;
  topProducts: TopProduct[];
  salesByCategory: CategorySale[];
  orderStatusBreakdown: StatusBreakdown[];
  paymentStatusBreakdown: PaymentBreakdown[];
}

const StatCard = ({
  title, value, change, trend, icon: Icon,
}: {
  title: string; value: string; change: number;
  trend: 'up' | 'down'; icon: React.ElementType;
}) => {
  const isPositive = trend === 'up';
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[#0d9488]">
          <Icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {isPositive
            ? <TrendingUp className="h-3 w-3 mr-1" />
            : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
    </div>
  );
};

export default function SupplierAnalytics() {
  const {
    metrics,
    revenuePerformance,
    regionalSales,
    topRegion,
    topProducts,
    salesByCategory,
    orderStatusBreakdown,
    paymentStatusBreakdown,
  } = usePage<PageProps>().props;

  const [timeRange, setTimeRange] = useState('Last 30 Days');

  // Chart: max revenue for scaling bars
  const maxRevenue = useMemo(
    () => Math.max(...revenuePerformance.map(d => d.revenue), 1),
    [revenuePerformance]
  );

  // Show last 15 points for the bar chart (avoid crowding)
  const chartData = revenuePerformance.slice(-15);

  const regionalDataWithColors = regionalSales.slice(0, 4).map((region, index) => ({
    ...region,
    color: ['bg-[#0d9488]', 'bg-teal-400', 'bg-teal-200', 'bg-slate-200'][index] ?? 'bg-slate-200',
  }));

  const statusColors: Record<string, string> = {
    Processing: 'bg-blue-100 text-blue-700',
    Shipped:    'bg-amber-100 text-amber-700',
    Delivered:  'bg-emerald-100 text-emerald-700',
    Cancelled:  'bg-slate-100 text-slate-600',
  };

  const paymentColors: Record<string, string> = {
    Paid:    'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
    Overdue: 'bg-red-100 text-red-700',
  };

  return (
    <SupplierLayout>
      <Head title="Business Analytics" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500">Track your business performance and growth metrics.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:ring-[#0d9488]"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <button className="flex items-center px-4 py-2 bg-[#0d9488] text-white rounded-lg text-sm font-bold hover:bg-[#0f766e] transition-all shadow-lg shadow-teal-500/20">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Gross Sales"
          value={metrics.grossSales.formatted ?? `KES ${metrics.grossSales.value.toLocaleString()}`}
          change={metrics.grossSales.change}
          trend={metrics.grossSales.trend}
          icon={BarChart3}
        />
        <StatCard
          title="Order Volume"
          value={String(metrics.orderVolume.value)}
          change={metrics.orderVolume.change}
          trend={metrics.orderVolume.trend}
          icon={ShoppingBag}
        />
        <StatCard
          title="Avg. Order Value"
          value={metrics.avgOrderValue.formatted ?? `KES ${metrics.avgOrderValue.value.toLocaleString()}`}
          change={metrics.avgOrderValue.change}
          trend={metrics.avgOrderValue.trend}
          icon={Zap}
        />
        <StatCard
          title="Unique Customers"
          value={String(metrics.newCustomers.value)}
          change={metrics.newCustomers.change}
          trend={metrics.newCustomers.trend}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#0d9488]" />
              Revenue Performance
            </h3>
            <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center text-slate-400">
                <span className="h-3 w-3 rounded-full bg-slate-200 mr-1.5" /> Previous
              </div>
              <div className="flex items-center text-[#0d9488]">
                <span className="h-3 w-3 rounded-full bg-[#0d9488] mr-1.5" /> Current
              </div>
            </div>
          </div>

          {chartData.length > 0 ? (
            <>
              <div className="h-72 flex items-end justify-between gap-1.5 px-2">
                {chartData.map((point, i) => {
                  const heightPct = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
                  const prevHeight = heightPct * 0.7;
                  return (
                    <div key={i} className="flex-1 group relative h-full flex items-end">
                      <div
                        className="absolute bottom-0 w-full bg-slate-100 rounded-t-lg transition-all"
                        style={{ height: `${prevHeight}%` }}
                      />
                      <div
                        className="relative w-full bg-[#0d9488]/80 group-hover:bg-[#0d9488] rounded-t-lg transition-all duration-300"
                        style={{ height: `${heightPct}%`, minHeight: point.revenue > 0 ? '4px' : '0' }}
                      />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                        KES {(point.revenue / 1000).toFixed(1)}k
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-4 px-1 text-[10px] font-bold text-slate-400 uppercase">
                {chartData.length > 0 && (
                  <>
                    <span>{chartData[0]?.date}</span>
                    <span>{chartData[Math.floor(chartData.length / 3)]?.date}</span>
                    <span>{chartData[Math.floor((chartData.length * 2) / 3)]?.date}</span>
                    <span>{chartData[chartData.length - 1]?.date}</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No revenue data for this period.</p>
              </div>
            </div>
          )}
        </div>

        {/* Regional Sales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center">
            <Map className="h-5 w-5 mr-2 text-[#0d9488]" />
            Regional Sales
          </h3>

          {regionalDataWithColors.length > 0 ? (
            <div className="space-y-5">
              {regionalDataWithColors.map(data => (
                <div key={data.region}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-bold text-slate-700">{data.region}</span>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-500">{data.percentage}%</span>
                      <span className="text-[10px] text-slate-400 ml-1">({data.orders} orders)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${data.color} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}

              {topRegion && (
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 flex items-start gap-3">
                    <Activity className="h-5 w-5 text-[#0d9488] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-teal-800 font-medium leading-relaxed">
                      <strong>{topRegion.region}</strong> is your top market this month with{' '}
                      KES {topRegion.sales.toLocaleString()} in sales.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Map className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No regional data yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center">
              <Pill className="h-5 w-5 mr-2 text-[#0d9488]" />
              Top Moving Products
            </h3>
          </div>

          {topProducts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {topProducts.map((product, i) => (
                <div key={product.name} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center text-xs font-black text-[#0d9488]">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">
                      KES {product.revenue.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No product sales this period.</p>
            </div>
          )}
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-[#0d9488]" />
              Sales by Category
            </h3>
          </div>

          {salesByCategory.length > 0 ? (
            <div className="p-6 space-y-4">
              {(() => {
                const maxCat = Math.max(...salesByCategory.map(c => c.revenue), 1);
                return salesByCategory.map((cat, i) => (
                  <div key={cat.category}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-slate-700">{cat.category}</span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          KES {cat.revenue.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">• {cat.orders} orders</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0d9488] h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(cat.revenue / maxCat) * 100}%`,
                          opacity: 1 - i * 0.15,
                        }}
                      />
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No category data this period.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order & Payment Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#0d9488]" />
              Order Status Breakdown
            </h3>
          </div>
          <div className="p-6 space-y-3">
            {orderStatusBreakdown.length > 0 ? orderStatusBreakdown.map(item => (
              <div key={item.status} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[item.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {item.status}
                </span>
                <span className="text-sm font-bold text-slate-900">{item.count} orders</span>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-4">No orders this period.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#0d9488]" />
              Payment Status Breakdown
            </h3>
          </div>
          <div className="p-6 space-y-3">
            {paymentStatusBreakdown.length > 0 ? paymentStatusBreakdown.map(item => (
              <div key={item.status} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentColors[item.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {item.status}
                </span>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    KES {item.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">{item.count} orders</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-4">No payment data this period.</p>
            )}
          </div>
        </div>
      </div>

    </SupplierLayout>
  );
}
