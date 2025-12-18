
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  Wallet, TrendingUp, ArrowUpRight, Download, CreditCard,
  Banknote, History, ArrowDownLeft, Search, Filter,
  CheckCircle2, Clock, AlertCircle, ChevronRight, X
} from 'lucide-react';

export default function SupplierFinance() {
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const transactions = [
    { id: 'TXN-88291', type: 'Order Income', ref: 'ORD-7782', amount: 45000, date: 'Oct 24, 2023', status: 'Completed', method: 'MediConnect Balance' },
    { id: 'TXN-88285', type: 'Payout', ref: 'PAY-1102', amount: -150000, date: 'Oct 22, 2023', status: 'Processing', method: 'Standard Chartered (****4421)' },
    { id: 'TXN-88280', type: 'Order Income', ref: 'ORD-7781', amount: 128000, date: 'Oct 21, 2023', status: 'Completed', method: 'MediConnect Balance' },
    { id: 'TXN-88275', type: 'Order Income', ref: 'ORD-7779', amount: 8900, date: 'Oct 20, 2023', status: 'Completed', method: 'MediConnect Balance' },
    { id: 'TXN-88270', type: 'Payout', ref: 'PAY-1098', amount: -85000, date: 'Oct 15, 2023', status: 'Completed', method: 'M-PESA Till (552910)' },
  ];

  const metrics = [
    { title: 'Total Revenue', value: 'KES 4,250,000', change: '+12.5%', icon: Wallet, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'Available Balance', value: 'KES 312,450', change: 'Ready', icon: Banknote, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending Clearance', value: 'KES 85,200', change: '7 days', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
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
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Statement
          </button>
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="flex items-center px-6 py-2 bg-[#0d9488] text-white rounded-lg font-bold hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all"
          >
            Request Payout
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
                  <m.icon className="h-6 w-6" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                   m.change.startsWith('+') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-100 text-slate-600'
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
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Revenue Growth</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold rounded-md bg-teal-50 text-[#0d9488] border border-teal-100">Monthly</button>
              <button className="px-3 py-1 text-xs font-bold rounded-md text-slate-500 hover:bg-slate-50">Weekly</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 55, 45, 70, 85, 60, 75, 95, 80, 65, 85, 100].map((val, i) => (
              <div key={i} className="flex-1 bg-slate-50 rounded-t-lg relative group h-full">
                <div
                  className="absolute bottom-0 w-full bg-[#0d9488]/80 group-hover:bg-[#0d9488] rounded-t-lg transition-all duration-500"
                  style={{ height: `${val}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  KES {val * 10}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* Payout Methods */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Payout Methods</h3>
            <button className="text-xs font-bold text-[#0d9488] hover:underline">Manage</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border-2 border-[#0d9488] bg-teal-50/50 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center mr-3 shadow-sm">
                   <CreditCard className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-900">Standard Chartered</p>
                   <p className="text-xs text-slate-500">Checking • ****4421</p>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-[#0d9488]" />
            </div>
            <div className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center group cursor-pointer">
              <div className="h-10 w-10 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center mr-3 group-hover:bg-white transition-colors">
                 <div className="text-xs font-black text-green-600">Till</div>
              </div>
              <div className="flex-1">
                 <p className="text-sm font-bold text-slate-700">M-PESA Business</p>
                 <p className="text-xs text-slate-500">Till Number • 552910</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
            <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:border-[#0d9488] hover:text-[#0d9488] hover:bg-teal-50 transition-all flex items-center justify-center">
               <Plus className="h-4 w-4 mr-2" /> Add New Method
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
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
              {transactions.map((txn) => (
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
                    <span className="text-slate-500 font-medium">{txn.ref}</span>
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
                      txn.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-700 border-red-100'
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
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-400 font-medium">Showing latest financial activities</p>
          <button className="text-sm font-bold text-[#0d9488] hover:underline">View All Ledger</button>
        </div>
      </div>

      {/* Payout Modal */}
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
              <div className="p-6">
                <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100 flex justify-between items-center">
                   <div>
                      <p className="text-xs text-teal-600 font-bold uppercase mb-1">Available for Withdrawal</p>
                      <p className="text-2xl font-black text-[#0d9488]">KES 312,450</p>
                   </div>
                   <Wallet className="h-8 w-8 text-[#0d9488] opacity-20" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Amount to Withdraw</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">KES</span>
                      <input type="number" className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-[#0d9488] focus:border-[#0d9488] font-bold text-lg" placeholder="0.00" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Destination Account</label>
                    <div className="p-3 border border-[#0d9488] bg-teal-50 rounded-xl flex items-center">
                       <CreditCard className="h-5 w-5 text-[#0d9488] mr-3" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Standard Chartered</p>
                          <p className="text-xs text-slate-500">Checking • ****4421</p>
                       </div>
                    </div>
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
                 <button onClick={() => setIsPayoutModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-900">Cancel</button>
                 <button
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="flex-1 py-3 bg-[#0d9488] text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-[#0f766e] transition-all"
                 >
                   Confirm Payout
                 </button>
              </div>
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
