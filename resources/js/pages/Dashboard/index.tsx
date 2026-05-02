import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { DashboardLayout } from './layout';
import {
  TrendingUp, ShoppingBag, ArrowRight, Clock,
  CheckCircle2, XCircle, MoreHorizontal, Shield,
  CreditCard, AlertCircle
} from 'lucide-react';

interface Order {
  id: number;
  order_reference: string;
  supplier: { name: string } | null;
  total_amount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status: 'Paid' | 'Pending' | 'Overdue';
  created_at: string;
}

interface Metrics {
  total_spend: number;
  active_orders: number;
  pending_payment: number;
}

interface Compliance {
  is_verified: boolean;
  kra_pin: boolean;
  pharmacy_license: boolean;
  ppb_license: boolean;
  score: number;
}

interface PageProps {
  recentOrders: Order[];
  metrics: Metrics;
  compliance: Compliance;
  auth: { user: { name: string } };
}

const MetricCard = ({
  title, value, sub, icon: Icon, iconBg,
}: {
  title: string; value: string; sub: string;
  icon: React.ElementType; iconBg: string;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
    <div className="mt-4">
      <span className="text-xs text-slate-400">{sub}</span>
    </div>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'Shipped':    return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'Delivered':  return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Cancelled':  return 'bg-slate-50 text-slate-600 border-slate-100';
    default:           return 'bg-slate-50 text-slate-600';
  }
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-KE', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

export default function DashboardIndex() {
  const { recentOrders, metrics, compliance, auth } = usePage<PageProps>().props;

  const COMPLIANCE_ITEMS = [
    { label: 'Account Verified',  passed: compliance.is_verified      },
    { label: 'KRA PIN',           passed: compliance.kra_pin          },
    { label: 'Pharmacy License',  passed: compliance.pharmacy_license },
    { label: 'PPB License',       passed: compliance.ppb_license      },
  ];

  const scorePct = Math.round((compliance.score / 4) * 100);
  const scoreColor =
    compliance.score === 4 ? 'bg-emerald-500' :
    compliance.score >= 2  ? 'bg-amber-400'   : 'bg-red-400';

  return (
    <DashboardLayout>
      <Head title="Dashboard" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, {auth.user.name}.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Spend"
          value={`KES ${Number(metrics.total_spend).toLocaleString()}`}
          sub="All time across all orders"
          icon={ShoppingBag}
          iconBg="bg-[#0d9488]"
        />
        <MetricCard
          title="Active Orders"
          value={String(metrics.active_orders)}
          sub="Processing or shipped"
          icon={Clock}
          iconBg="bg-blue-500"
        />
        <MetricCard
          title="Pending Payment"
          value={`KES ${Number(metrics.pending_payment).toLocaleString()}`}
          sub="Outstanding invoices"
          icon={CreditCard}
          iconBg="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Orders</h3>
            <Link
              href="/orders"
              className="text-sm font-medium text-[#0d9488] hover:text-[#0f766e] flex items-center"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Order</th>
                    <th className="px-6 py-4 font-semibold">Supplier</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{order.order_reference}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{formatDate(order.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{order.supplier?.name ?? '—'}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        KES {Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-slate-400 hover:text-[#0d9488] p-1 inline-block"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <ShoppingBag className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No orders yet.</p>
              <Link href="/marketplace" className="text-xs text-[#0d9488] mt-1 inline-block hover:underline">
                Browse the marketplace →
              </Link>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* CTA */}
          <div className="bg-[#0d9488] rounded-2xl p-6 text-white shadow-lg shadow-teal-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-2">Need to restock?</h3>
              <p className="text-teal-100 text-sm mb-6">
                Browse thousands of pharmaceutical products from verified suppliers.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center bg-white text-[#0d9488] px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-50 transition-colors"
              >
                Shop Now <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-teal-900/10 rounded-full blur-xl" />
          </div>

          {/* Compliance widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#0d9488]" />
                Compliance
              </h3>
              <Link
                href="/compliance"
                className="text-xs text-[#0d9488] hover:underline font-medium"
              >
                View details →
              </Link>
            </div>

            {/* Score bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Score</span>
                <span className="font-semibold text-slate-700">{compliance.score}/4</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${scoreColor}`}
                  style={{ width: `${scorePct}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {COMPLIANCE_ITEMS.map(({ label, passed }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${
                    passed
                      ? 'bg-emerald-50 border-emerald-100'
                      : 'bg-red-50 border-red-100'
                  }`}
                >
                  <span className={`font-medium ${passed ? 'text-slate-700' : 'text-slate-600'}`}>
                    {label}
                  </span>
                  {passed
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    : <XCircle className="h-4 w-4 text-red-400" />
                  }
                </div>
              ))}
            </div>

            {compliance.score < 4 && (
              <Link
                href="/dashboard/settings"
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                Complete your profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
