
import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
// Added Info to the lucide-react import list
import {
  FileText, Search, Filter, Plus, Download, Send,
  CheckCircle2, Clock, AlertCircle, MoreHorizontal,
  X, Trash2, Calculator, ShieldCheck, Mail, Calendar,
  ArrowRight, Info
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function SupplierInvoices() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [newItems, setNewItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);

  const invoices = [
    { id: 'INV-2023-001', customer: 'City Square Pharmacy', date: 'Oct 24, 2023', due: 'Nov 24, 2023', amount: 45000, status: 'Paid', etims: true },
    { id: 'INV-2023-002', customer: 'Westlands Health Centre', date: 'Oct 22, 2023', due: 'Nov 22, 2023', amount: 128000, status: 'Sent', etims: true },
    { id: 'INV-2023-003', customer: 'MediLife Hospital', date: 'Sep 15, 2023', due: 'Oct 15, 2023', amount: 24500, status: 'Overdue', etims: true },
    { id: 'INV-2023-004', customer: 'GoodHope Chemists', date: 'Oct 25, 2023', due: 'Nov 25, 2023', amount: 8900, status: 'Draft', etims: false },
    { id: 'INV-2023-005', customer: 'Nairobi West Hosp.', date: 'Oct 10, 2023', due: 'Nov 10, 2023', amount: 210000, status: 'Paid', etims: true },
  ];

  const subtotal = newItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Sent': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Overdue': return 'bg-red-50 text-red-700 border-red-100';
        case 'Draft': return 'bg-slate-50 text-slate-600 border-slate-100';
        default: return 'bg-slate-50 text-slate-600';
    }
  };

  const addItem = () => {
    setNewItems([...newItems, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (newItems.length > 1) {
      setNewItems(newItems.filter(i => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setNewItems(newItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SupplierLayout>
      <Head title="Invoices Management" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-500">Generate and manage tax-compliant pharmaceutical invoices.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-6 py-2 bg-[#0d9488] text-white rounded-lg font-bold hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" /> Generate Invoice
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Outstanding</p>
           <h3 className="text-xl font-black text-slate-900">KES 152,500</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-red-500 uppercase mb-1">Total Overdue</p>
           <h3 className="text-xl font-black text-red-600">KES 24,500</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-emerald-500 uppercase mb-1">Collected (30d)</p>
           <h3 className="text-xl font-black text-emerald-600">KES 2.4M</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">ETIMS Status</p>
              <h3 className="text-sm font-bold text-green-600 flex items-center">
                 <ShieldCheck className="h-4 w-4 mr-1.5" /> Synchronized
              </h3>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="flex p-1 bg-slate-100 rounded-lg overflow-x-auto w-full md:w-auto">
                {['All', 'Paid', 'Sent', 'Overdue', 'Draft'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                            activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" placeholder="Search invoices..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-[#0d9488] w-full" />
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500"><Filter className="h-5 w-5" /></button>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4">Invoice #</th>
                        <th className="px-6 py-4">Pharmacy / Hospital</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Compliance</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {invoices.filter(i => activeTab === 'All' || i.status === activeTab).map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-mono font-bold text-slate-600">{invoice.id}</td>
                            <td className="px-6 py-4">
                                <p className="font-bold text-slate-900">{invoice.customer}</p>
                                <p className="text-[10px] text-slate-400 uppercase">Due: {invoice.due}</p>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900">KES {invoice.amount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(invoice.status)}`}>
                                    {invoice.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {invoice.etims ? (
                                    <div className="flex items-center text-green-600 text-[10px] font-black uppercase">
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> ETIMS Valid
                                    </div>
                                ) : (
                                    <div className="flex items-center text-slate-400 text-[10px] font-black uppercase">
                                        <Clock className="h-3.5 w-3.5 mr-1" /> Pending Sync
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-slate-400 hover:text-[#0d9488] hover:bg-teal-50 rounded" title="Send Email"><Mail className="h-4 w-4" /></button>
                                    <button className="p-1.5 text-slate-400 hover:text-[#0d9488] hover:bg-teal-50 rounded" title="Download"><Download className="h-4 w-4" /></button>
                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"><MoreHorizontal className="h-4 w-4" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateModalOpen(false)}></div>
                <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-4xl">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">New Tax Invoice</h3>
                            <p className="text-xs text-slate-500">MediConnect ETIMS Compliant System</p>
                        </div>
                        <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto max-h-[70vh]">
                        {/* Left: Invoice Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Pharmacy / Customer</label>
                                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-[#0d9488]">
                                        <option>Select Customer</option>
                                        <option>City Square Pharmacy</option>
                                        <option>Westlands Health Centre</option>
                                        <option>MediLife Hospital</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">Order Reference</label>
                                    <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="e.g. ORD-9921" />
                                </div>
                            </div>

                            {/* Line Items */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Line Items</label>
                                    <button onClick={addItem} className="text-xs font-bold text-[#0d9488] flex items-center hover:underline">
                                        <Plus className="h-3 w-3 mr-1" /> Add Medicine
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {newItems.map((item) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="col-span-6">
                                                <label className="block text-[10px] font-bold text-slate-400 mb-1">Medicine Description</label>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                                    placeholder="e.g. Amoxicillin 500mg"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-bold text-slate-400 mb-1">Qty</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <label className="block text-[10px] font-bold text-slate-400 mb-1">Unit Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">KES</span>
                                                    <input
                                                        type="number"
                                                        value={item.unitPrice}
                                                        onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                                                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-1 pb-1">
                                                <button onClick={() => removeItem(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Summary & Settings */}
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 h-fit space-y-6">
                            <h4 className="text-sm font-black text-slate-900 uppercase">Calculation Summary</h4>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-700">KES {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>VAT (16%)</span>
                                    <span className="font-bold text-slate-700">KES {vat.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-slate-200"></div>
                                <div className="flex justify-between text-lg font-black text-slate-900">
                                    <span>Total</span>
                                    <span className="text-[#0d9488]">KES {total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Due Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm" />
                                    </div>
                                </div>
                                <div className="p-4 bg-teal-100/50 rounded-2xl border border-teal-100">
                                    <p className="text-[10px] text-teal-800 leading-relaxed font-medium">
                                        <ShieldCheck className="h-3 w-3 inline mr-1" />
                                        Automatic ETIMS validation will be triggered upon publishing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center text-xs text-slate-400">
                           <Info className="h-4 w-4 mr-2" />
                           Line items are editable until the invoice is sent.
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900">Save Draft</button>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="flex-1 sm:flex-none flex items-center justify-center px-8 py-2.5 bg-[#0d9488] text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-[#0f766e] transition-all"
                            >
                                <Send className="h-4 w-4 mr-2" /> Send & Sync ETIMS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </SupplierLayout>
  );
}
