import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { DashboardLayout } from './layout';
import {
  ArrowLeft, Package, Truck, CheckCircle2, XCircle,
  Clock, CreditCard, MapPin, FileText, Building2
} from 'lucide-react';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

interface Order {
  id: number;
  order_reference: string;
  supplier: Supplier;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total_amount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status: 'Paid' | 'Pending' | 'Overdue';
  payment_method: string;
  shipping_address: {
    street?: string;
    city?: string;
    county?: string;
    postal_code?: string;
  };
  billing_details: {
    name?: string;
    email?: string;
    phone?: string;
  };
  created_at: string;
}

interface PageProps {
  order: Order;
}

const STATUS_STEPS = ['Processing', 'Shipped', 'Delivered'] as const;

export default function OrderDetail() {
  const { order } = usePage<PageProps>().props;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const formatCurrency = (amount: number) =>
    `KES ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing': return <Clock className="h-5 w-5" />;
      case 'Shipped':    return <Truck className="h-5 w-5" />;
      case 'Delivered':  return <CheckCircle2 className="h-5 w-5" />;
      case 'Cancelled':  return <XCircle className="h-5 w-5" />;
      default:           return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'Processing': return { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',   icon: 'text-blue-500'   };
      case 'Shipped':    return { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',  icon: 'text-amber-500'  };
      case 'Delivered':  return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',icon: 'text-emerald-500'};
      case 'Cancelled':  return { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',    icon: 'text-red-500'    };
      default:           return { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200',  icon: 'text-slate-400'  };
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'Paid':    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue': return 'bg-red-50 text-red-700 border-red-200';
      default:        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const isCancelled = order.status === 'Cancelled';
  const currentStepIndex = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);
  const statusColors = getStatusColors(order.status);

  return (
    <DashboardLayout>
      <Head title={`Order ${order.order_reference}`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/orders"
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-[#0d9488] hover:border-[#0d9488] transition-colors shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{order.order_reference}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Placed on {formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
            <span className={statusColors.icon}>{getStatusIcon(order.status)}</span>
            {order.status}
          </span>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getPaymentBadge(order.payment_status)}`}>
            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
            {order.payment_status}
          </span>
        </div>
      </div>

      {/* Order Progress — hidden if cancelled */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-6">Order Progress</h2>
          <div className="flex items-center">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = currentStepIndex >= index;
              const isActive    = currentStepIndex === index;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-[#0d9488] border-[#0d9488] text-white'
                        : 'bg-white border-slate-200 text-slate-300'
                    } ${isActive ? 'ring-4 ring-teal-100' : ''}`}>
                      {isCompleted ? (
                        index === currentStepIndex && step !== 'Delivered'
                          ? getStatusIcon(step)
                          : <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        getStatusIcon(step)
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-semibold ${isCompleted ? 'text-[#0d9488]' : 'text-slate-400'}`}>
                      {step}
                    </span>
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 rounded-full transition-all ${
                      currentStepIndex > index ? 'bg-[#0d9488]' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column — items + summary */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Package className="h-4 w-4 text-[#0d9488]" />
              <h2 className="font-semibold text-slate-900">
                Order Items <span className="text-slate-400 font-normal ml-1">({order.items.length})</span>
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item, index) => (
                <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-xs font-bold text-[#0d9488]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.product_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900 whitespace-nowrap">
                    {formatCurrency(item.total_price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>VAT (16%)</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-[#0d9488]">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — metadata */}
        <div className="space-y-6">

          {/* Supplier */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-4 w-4 text-[#0d9488]" />
              <h2 className="font-semibold text-slate-900">Supplier</h2>
            </div>
            <p className="font-medium text-slate-900">{order.supplier?.name ?? '—'}</p>
            {order.supplier?.email && (
              <p className="text-sm text-slate-500 mt-1">{order.supplier.email}</p>
            )}
            {order.supplier?.phone && (
              <p className="text-sm text-slate-500 mt-0.5">{order.supplier.phone}</p>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-4 w-4 text-[#0d9488]" />
              <h2 className="font-semibold text-slate-900">Payment</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-medium text-slate-900 capitalize">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className={`font-semibold ${
                  order.payment_status === 'Paid' ? 'text-emerald-600' :
                  order.payment_status === 'Overdue' ? 'text-red-600' : 'text-amber-600'
                }`}>{order.payment_status}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-[#0d9488]" />
                <h2 className="font-semibold text-slate-900">Shipping Address</h2>
              </div>
              <div className="text-sm text-slate-600 space-y-0.5">
                {order.shipping_address.street    && <p>{order.shipping_address.street}</p>}
                {order.shipping_address.city      && <p>{order.shipping_address.city}</p>}
                {order.shipping_address.county    && <p>{order.shipping_address.county}</p>}
                {order.shipping_address.postal_code && <p>{order.shipping_address.postal_code}</p>}
              </div>
            </div>
          )}

          {/* Billing */}
          {order.billing_details && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-[#0d9488]" />
                <h2 className="font-semibold text-slate-900">Billing Details</h2>
              </div>
              <div className="text-sm text-slate-600 space-y-0.5">
                {order.billing_details.name  && <p className="font-medium text-slate-900">{order.billing_details.name}</p>}
                {order.billing_details.email && <p>{order.billing_details.email}</p>}
                {order.billing_details.phone && <p>{order.billing_details.phone}</p>}
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
