
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Download, ArrowRight, Home } from 'lucide-react';
import { Layout } from './Layout';

export default function PaymentConfirmation() {
  const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;

  return (
    <Layout>
      <Head title="Order Confirmed" />
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl border border-slate-100 p-10 text-center">
            <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
                <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-500 text-lg mb-8">Thank you for your purchase.</p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Order Reference</p>
                <p className="text-2xl font-mono font-bold text-slate-800 tracking-wider">{orderId}</p>
                <div className="my-4 border-t border-slate-200"></div>
                <p className="text-sm text-slate-600">
                    A confirmation email and ETIMS receipt have been sent to your registered email address.
                </p>
            </div>

            <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                    <Download className="h-5 w-5 mr-2" /> Download Invoice
                </button>
                <Link href="/marketplace" className="w-full flex items-center justify-center px-4 py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all">
                    Continue Shopping <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
            </div>
        </div>
      </div>
    </Layout>
  );
}
