import React from 'react';
import { Head } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  Truck, MapPin, Calendar, ExternalLink,
  Package, CheckCircle2, AlertCircle, Clock, Search, Filter
} from 'lucide-react';

export default function SupplierShipments() {
  const shipments = [
    { id: 'SHP-9001', orderId: 'ORD-7781', customer: 'Westlands Health Centre', carrier: 'Fargo Courier', tracking: 'FGO-8829302', status: 'In Transit', eta: 'Today, 2:00 PM', location: 'Dispatch Center, Nairobi', progress: 65 },
    { id: 'SHP-9002', orderId: 'ORD-7780', customer: 'MediLife Hospital', carrier: 'Wells Fargo', tracking: 'WF-110022', status: 'Delivered', eta: 'Yesterday', location: 'Received by Dr. James', progress: 100 },
    { id: 'SHP-9003', orderId: 'ORD-7782', customer: 'City Square Pharmacy', carrier: 'In-House Logistics', tracking: 'IH-552', status: 'Pending Pickup', eta: 'Tomorrow', location: 'Warehouse A', progress: 10 },
    { id: 'SHP-9004', orderId: 'ORD-7775', customer: 'Afya Centre Pharmacy', carrier: 'G4S Logistics', tracking: 'G4S-99201', status: 'Exception', eta: 'Delayed', location: 'Traffic Delay - Mombasa Rd', progress: 40 },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'In Transit': return 'text-blue-600 bg-blue-50 border-blue-100';
        case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        case 'Pending Pickup': return 'text-amber-600 bg-amber-50 border-amber-100';
        case 'Exception': return 'text-red-600 bg-red-50 border-red-100';
        default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <SupplierLayout>
      <Head title="Shipments & Logistics" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Shipments</h1>
            <p className="text-slate-500">Track real-time delivery progress for your customers.</p>
        </div>
        <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Track ID..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-[#0d9488]" />
             </div>
             <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                <Filter className="h-5 w-5" />
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
               <div className="p-3 bg-blue-50 rounded-xl text-blue-600 mr-4"><Truck className="h-6 w-6" /></div>
               <div><p className="text-2xl font-bold text-slate-900">12</p><p className="text-slate-500 text-xs font-medium">In Transit</p></div>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
               <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 mr-4"><CheckCircle2 className="h-6 w-6" /></div>
               <div><p className="text-2xl font-bold text-slate-900">45</p><p className="text-slate-500 text-xs font-medium">Delivered (7d)</p></div>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
               <div className="p-3 bg-amber-50 rounded-xl text-amber-600 mr-4"><Clock className="h-6 w-6" /></div>
               <div><p className="text-2xl font-bold text-slate-900">5</p><p className="text-slate-500 text-xs font-medium">Pending Pickup</p></div>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
               <div className="p-3 bg-red-50 rounded-xl text-red-600 mr-4"><AlertCircle className="h-6 w-6" /></div>
               <div><p className="text-2xl font-bold text-slate-900">2</p><p className="text-slate-500 text-xs font-medium">Exceptions</p></div>
           </div>
      </div>

      <div className="space-y-4">
        {shipments.map((shipment) => (
            <div key={shipment.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Info */}
                    <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{shipment.id}</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(shipment.status)}`}>
                                {shipment.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{shipment.customer}</h3>
                        <p className="text-sm text-slate-500 flex items-center mb-4">
                            <Package className="h-3.5 w-3.5 mr-2" /> Order Ref: <span className="text-[#0d9488] font-bold ml-1">{shipment.orderId}</span>
                        </p>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Carrier & Tracking</p>
                             <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700">{shipment.carrier}</span>
                                <span className="text-sm font-mono text-[#0d9488]">{shipment.tracking}</span>
                             </div>
                        </div>
                    </div>

                    {/* Right: Progress & Map View Placeholder */}
                    <div className="flex-1 space-y-6">
                         <div className="flex justify-between items-end">
                            <div className="flex items-center text-slate-500">
                                <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                                <span className="text-sm">Currently at: <span className="text-slate-900 font-medium">{shipment.location}</span></span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Arrival</p>
                                <p className="text-sm font-bold text-slate-900">{shipment.eta}</p>
                            </div>
                         </div>

                         {/* Progress Bar */}
                         <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-100">
                                <div
                                    style={{ width: `${shipment.progress}%` }}
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${
                                        shipment.status === 'Exception' ? 'bg-red-500' : 'bg-[#0d9488]'
                                    }`}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                                <span>Dispatched</span>
                                <span>In Transit</span>
                                <span>Out for Delivery</span>
                                <span>Delivered</span>
                            </div>
                         </div>

                         <div className="flex justify-end gap-3 pt-2">
                             <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">View Timeline</button>
                             <button className="text-xs font-bold text-[#0d9488] flex items-center hover:underline">
                                 Carrier Site <ExternalLink className="h-3 w-3 ml-1" />
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </SupplierLayout>
  );
}
