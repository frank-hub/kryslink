import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  Wallet, TrendingUp, ArrowUpRight, Download, CreditCard,
  Banknote, History, ArrowDownLeft, Search, Filter,
  CheckCircle2, Clock, AlertCircle, ChevronRight, X
} from 'lucide-react';

interface Metric {
  value: number;
  formatted: string;
  change?: string;
  status?: string;
  days?: string;
}

interface FinanceMetrics {
  totalRevenue: Metric;
  availableBalance: Metric;
  pendingClearance: Metric;
}

interface RevenueGrowthData {
  month: string;
  revenue: number;
}

interface PayoutMethod {
  id: number;
  type: string;
  name: string;
  bank_name: string | null;
  account_number: string;
  is_primary: boolean;
  is_verified: boolean;
}

interface Transaction {
  id: string;
  type: string;
  reference: string;
  method: string;
  amount: number;
  status: string;
  date: string;
}

interface FinanceProps {
  metrics: FinanceMetrics;
  revenueGrowth: RevenueGrowthData[];
  payoutMethods: PayoutMethod[];
  transactions: Transaction[];
  pendingPayouts: number;
}

export default function SupplierFinance({
  metrics,
  revenueGrowth,
  payoutMethods,
  transactions,
  pendingPayouts
}: FinanceProps) {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    amount: '',
    payout_method_id: 0,
  });

  // Set default payout method
  React.useEffect(() => {
    if (payoutMethods.length > 0 && !selectedMethod) {
      const primary = payoutMethods.find(m => m.is_primary) || payoutMethods[0];
      setSelectedMethod(primary);
      setData('payout_method_id', primary.id);
    }
  }, [payoutMethods]);

  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    post('/supplier/finance/request-payout', {
      onSuccess: () => {
        setIsPayoutModalOpen(false);
        reset();
      },
    });
  };

  const metricsConfig = [
    { 
      title: 'Total Revenue', 
      value: metrics.totalRevenue.formatted, 
      change: metrics.totalRevenue.change, 
      icon: Wallet, 
      color: 'text-teal-600', 
      bg: 'bg-teal-50' 
    },
    { 
      title: 'Available Balance', 
      value: metrics.availableBalance.formatted, 
      change: metrics.availableBalance.status, 
      icon: Banknote, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Pending Clearance', 
      value: metrics.pendingClearance.formatted, 
      change: metrics.pendingClearance.days, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
  ];

  return (
    <SupplierLayout>
      <Head title="Finance & Earnings" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance & Earnings</h1>
          <p className="text-slate-500">Manage your payouts and view detailed financial reports.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.visit('/supplier/payout-methods')}  className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors shadow-sm">
            <Banknote className="h-4 w-4 mr-2" /> Payout Method
          </button>
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="flex items-center px-6 py-2 bg-[#0d9488] text-white rounded-lg font-bold hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all"
          >
            Request Payout
          </button>
        </div>
      </div>

      {/* Metrics Grid - DYNAMIC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metricsConfig.map((m, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
                  <m.icon className="h-6 w-6" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                   m.change?.startsWith('+') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  {m.change}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{m.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{m.value}</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 text-slate-900 group-hover:scale-110 transition-transform">
               <m.icon size={100} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart - DYNAMIC */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Revenue Growth</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold rounded-md bg-teal-50 text-[#0d9488] border border-teal-100">Monthly</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {revenueGrowth && revenueGrowth.length > 0 ? (
              (() => {
                const maxRevenue = Math.max(...revenueGrowth.map(d => d.revenue));
                return revenueGrowth.map((item, i) => {
                  const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={i} className="flex-1 bg-slate-50 rounded-t-lg relative group h-full">
                      <div
                        className="absolute bottom-0 w-full bg-[#0d9488]/80 group-hover:bg-[#0d9488] rounded-t-lg transition-all duration-500"
                        style={{ height: `${Math.max(heightPercent, 3)}%`, minHeight: '8px' }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        KES {item.revenue.toLocaleString()}
                      </div>
                    </div>
                  );
                });
              })()
            ) : (
              <div className="flex items-center justify-center w-full h-full text-slate-400">
                <p className="text-sm">No revenue data available</p>
              </div>
            )}
          </div>
          {revenueGrowth && revenueGrowth.length > 0 && (
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              {revenueGrowth.map((item, i) => (
                <span key={i}>{item.month}</span>
              ))}
            </div>
          )}
        </div>

        {/* Payout Methods - DYNAMIC */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Payout Methods</h3>
            <button className="text-xs font-bold text-[#0d9488] hover:underline">Manage</button>
          </div>
          <div className="space-y-4">
            {payoutMethods && payoutMethods.length > 0 ? (
              payoutMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    method.is_primary 
                      ? 'border-2 border-[#0d9488] bg-teal-50/50' 
                      : 'border border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setSelectedMethod(method);
                    setData('payout_method_id', method.id);
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center mr-3 shadow-sm">
                      {method.type === 'bank' ? (
                        <CreditCard className="h-5 w-5 text-slate-600" />
                      ) : (
                        <div className="text-xs font-black text-green-600">Till</div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {method.type === 'bank' ? method.bank_name : 'M-PESA Business'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {method.type === 'bank' ? 'Checking' : 'Till Number'} • {method.account_number}
                      </p>
                    </div>
                  </div>
                  {method.is_primary && <CheckCircle2 className="h-5 w-5 text-[#0d9488]" />}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400 mb-4">No payout methods added</p>
                <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-[#0d9488] hover:text-[#0d9488] hover:bg-teal-50 transition-all flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" /> Add Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table - DYNAMIC */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
           <h3 className="font-bold text-slate-900">Transaction History</h3>
           <div className="flex gap-2">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <input type="text" placeholder="Search ID or Ref..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-[#0d9488] w-full md:w-64" />
              </div>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100">
                <Filter className="h-4 w-4" />
              </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions && transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-slate-500">{txn.id}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{txn.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {txn.amount > 0 ? (
                          <ArrowDownLeft className="h-3.5 w-3.5 mr-2 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5 mr-2 text-red-500" />
                        )}
                        <span className="font-medium text-slate-700">{txn.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-500 font-medium">{txn.reference}</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{txn.method}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${txn.amount > 0 ? 'text-slate-900' : 'text-red-600'}`}>
                        {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} KES
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                        txn.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                        txn.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                        txn.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-[#0d9488] opacity-0 group-hover:opacity-100 transition-all">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No transactions yet</p>
                    <p className="text-xs mt-1">Your transaction history will appear here</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {transactions && transactions.length > 0 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-400 font-medium">Showing latest {transactions.length} transactions</p>
            <button className="text-sm font-bold text-[#0d9488] hover:underline">View All Ledger</button>
          </div>
        )}
      </div>

      {/* Payout Modal - UPDATED WITH FORM */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsPayoutModalOpen(false)}></div>
            <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-md">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Request Payout</h3>
                <button onClick={() => setIsPayoutModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitPayout}>
                <div className="p-6">
                  <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100 flex justify-between items-center">
                     <div>
                        <p className="text-xs text-teal-600 font-bold uppercase mb-1">Available for Withdrawal</p>
                        <p className="text-2xl font-black text-[#0d9488]">{metrics.availableBalance.formatted}</p>
                     </div>
                     <Wallet className="h-8 w-8 text-[#0d9488] opacity-20" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Amount to Withdraw</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">KES</span>
                        <input 
                          type="number" 
                          value={data.amount}
                          onChange={(e) => setData('amount', e.target.value)}
                          max={metrics.availableBalance.value}
                          min="1"
                          step="0.01"
                          required
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-[#0d9488] focus:border-[#0d9488] font-bold text-lg" 
                          placeholder="0.00" 
                        />
                      </div>
                      {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Destination Account</label>
                      {selectedMethod ? (
                        <div className="p-3 border border-[#0d9488] bg-teal-50 rounded-xl flex items-center">
                           <CreditCard className="h-5 w-5 text-[#0d9488] mr-3" />
                           <div>
                              <p className="text-sm font-bold text-slate-900">
                                {selectedMethod.type === 'bank' ? selectedMethod.bank_name : 'M-PESA Business'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {selectedMethod.type === 'bank' ? 'Checking' : 'Till Number'} • {selectedMethod.account_number}
                              </p>
                           </div>
                        </div>
                      ) : (
                        <p className="text-sm text-red-500">Please add a payout method first</p>
                      )}
                      {errors.payout_method_id && <p className="text-xs text-red-500 mt-1">{errors.payout_method_id}</p>}
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start">
                       <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                       <p className="text-xs text-amber-700 leading-relaxed">
                          Payouts requested before 12:00 PM EAT are typically processed same-day. Weekend requests will be handled on the next business day.
                       </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                   <button 
                    type="button"
                    onClick={() => setIsPayoutModalOpen(false)} 
                    className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-900"
                   >
                    Cancel
                   </button>
                   <button
                    type="submit"
                    disabled={processing || !selectedMethod}
                    className="flex-1 py-3 bg-[#0d9488] text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-[#0f766e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {processing ? 'Processing...' : 'Confirm Payout'}
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </SupplierLayout>
  );
}

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);