
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  Search, Filter, Download, Eye, Truck, CheckCircle,
  XCircle, Clock, MoreHorizontal, Calendar, ChevronDown, X,
  MapPin, ClipboardList, Info, RefreshCw
} from 'lucide-react';

export default function SupplierOrders() {
  const [activeTab, setActiveTab] = useState('All');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = [
    { id: 'ORD-7782', customer: 'City Square Pharmacy', date: 'Oct 24, 2023', amount: 45000, payment: 'Paid', status: 'Pending', items: 12 },
    { id: 'ORD-7781', customer: 'Westlands Health Centre', date: 'Oct 24, 2023', amount: 128000, payment: 'Paid', status: 'Processing', items: 45 },
    { id: 'ORD-7780', customer: 'MediLife Hospital', date: 'Oct 23, 2023', amount: 24500, payment: 'Pending', status: 'Shipped', items: 8 },
    { id: 'ORD-7779', customer: 'GoodHope Chemists', date: 'Oct 22, 2023', amount: 8900, payment: 'Paid', status: 'Delivered', items: 3 },
    { id: 'ORD-7778', customer: 'Nairobi West Hosp.', date: 'Oct 21, 2023', amount: 210000, payment: 'Failed', status: 'Cancelled', items: 62 },
    { id: 'ORD-7775', customer: 'Afya Centre Pharmacy', date: 'Oct 20, 2023', amount: 56000, payment: 'Paid', status: 'Delivered', items: 15 },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
        case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Cancelled': return 'bg-slate-50 text-slate-600 border-slate-100';
        default: return 'bg-slate-50 text-slate-600';
    }
  };

  const handleOpenDispatch = (order: any) => {
    setSelectedOrder(order);
    setIsDispatchModalOpen(true);
  };

  const handleOpenUpdateStatus = (order: any) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  return (
    <SupplierLayout>
      <Head title="Orders Management" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
            <p className="text-slate-500">Manage and fulfill incoming orders from pharmacies.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
                <Download className="h-4 w-4 mr-2" /> Export
            </button>
            <button className="flex items-center px-4 py-2 bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition-colors shadow-lg shadow-teal-500/20">
                <Filter className="h-4 w-4 mr-2" /> Filter
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="flex p-1 bg-slate-100 rounded-lg w-full md:w-auto overflow-x-auto">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(tab => (
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
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Search orders..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-[#0d9488]" />
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Order Details</th>
                        <th className="px-6 py-4 font-semibold">Customer</th>
                        <th className="px-6 py-4 font-semibold">Order Date</th>
                        <th className="px-6 py-4 font-semibold">Fulfillment</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {orders.filter(o => activeTab === 'All' || o.status === activeTab).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="font-bold text-[#0d9488]">{order.id}</div>
                                <div className="text-xs text-slate-500">KES {order.amount.toLocaleString()} • {order.items} Items</div>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-900">
                                {order.customer}
                                <div className="text-[10px] text-slate-400 font-normal">Nairobi, KE</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center text-slate-600">
                                    <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                    {order.date}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleOpenUpdateStatus(order)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Update Status"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenDispatch(order)}
                                        className="flex items-center px-3 py-1.5 bg-teal-50 text-[#0d9488] rounded-lg text-xs font-bold hover:bg-[#0d9488] hover:text-white transition-all shadow-sm"
                                        title="Create Shipment"
                                    >
                                        <Truck className="h-3.5 w-3.5 mr-1.5" /> Dispatch
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* 1. Update Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsStatusModalOpen(false)}></div>
                <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-md">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">Update Fulfillment</h3>
                        <button onClick={() => setIsStatusModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                             <p className="text-xs text-slate-400 font-bold uppercase mb-1">Current Order Status</p>
                             <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                                {selectedOrder.status}
                             </span>
                        </div>

                        <div className="space-y-3">
                             <p className="text-sm font-bold text-slate-700 mb-2">Select New Status</p>
                             {[
                                { id: 'Pending', icon: Clock, color: 'text-amber-500', desc: 'Order received, waiting for confirmation.' },
                                { id: 'Processing', icon: ClipboardList, color: 'text-blue-500', desc: 'Items are being picked and packed.' },
                                { id: 'Delivered', icon: CheckCircle, color: 'text-emerald-500', desc: 'Medicine has reached the pharmacy.' },
                                { id: 'Cancelled', icon: XCircle, color: 'text-red-500', desc: 'Order will be terminated.' }
                             ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        console.log(`Update ${selectedOrder.id} to ${item.id}`);
                                        setIsStatusModalOpen(false);
                                    }}
                                    className="w-full flex items-center p-3 rounded-xl border border-slate-200 hover:border-[#0d9488] hover:bg-teal-50 transition-all text-left group"
                                >
                                    <div className={`p-2 rounded-lg bg-white shadow-sm border border-slate-100 mr-4 ${item.color}`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900 group-hover:text-[#0d9488]">{item.id}</p>
                                        <p className="text-[10px] text-slate-500">{item.desc}</p>
                                    </div>
                                    <div className="h-4 w-4 border-2 border-slate-300 rounded-full group-hover:border-[#0d9488]"></div>
                                </button>
                             ))}
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
                         <button onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500">Close</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 2. Dispatch Order / Create Shipment Modal */}
      {isDispatchModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDispatchModalOpen(false)}></div>
                <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-lg">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Create Shipment</h3>
                            <p className="text-xs text-slate-500">Dispatching Order {selectedOrder.id}</p>
                        </div>
                        <button onClick={() => setIsDispatchModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-start p-4 bg-teal-50 rounded-xl border border-teal-100">
                            <Info className="h-5 w-5 text-[#0d9488] mr-3 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-[#0f766e] leading-relaxed">
                                Creating a shipment will notify <strong>{selectedOrder.customer}</strong> and provide them with real-time tracking updates. Ensure the medicine is properly packed.
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-800">Logistics Carrier</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Fargo Courier', 'Wells Fargo', 'In-House Delivery', 'G4S Logistics'].map(carrier => (
                                    <button key={carrier} className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-xl hover:border-[#0d9488] hover:bg-teal-50 transition-all text-center group">
                                        <Truck className="h-6 w-6 text-slate-400 group-hover:text-[#0d9488] mb-2" />
                                        <span className="text-xs font-semibold text-slate-600 group-hover:text-[#0d9488]">{carrier}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number / Waybill</label>
                                <div className="relative">
                                    <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-[#0d9488] focus:border-[#0d9488]" placeholder="e.g. FG-882910" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Arrival</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input type="date" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-[#0d9488] focus:border-[#0d9488]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-[#0d9488] focus:border-[#0d9488]" placeholder="e.g. Nairobi Depot" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button onClick={() => setIsDispatchModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900">Cancel</button>
                        <button onClick={() => {
                            console.log("Shipment Created");
                            setIsDispatchModalOpen(false);
                        }} className="px-6 py-2 bg-[#0d9488] text-white rounded-lg text-sm font-bold hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all">
                            Confirm Dispatch
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </SupplierLayout>
  );
}
