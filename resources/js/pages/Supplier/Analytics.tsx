
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  BarChart3, TrendingUp, Users, ShoppingBag,
  ArrowUpRight, ArrowDownRight, Download, Filter,
  Calendar, PieChart, Activity, Pill, Building2,
  ChevronRight, Map, Zap
} from 'lucide-react';

const StatCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[#0d9488]">
        <Icon className="h-6 w-6" />
      </div>
      <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
        {change}
      </div>
    </div>
    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
    <h3 className="text-2xl font-black text-slate-900">{value}</h3>
  </div>
);

export default function SupplierAnalytics() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const topProducts = [
    { name: 'Amoxicillin 500mg', sales: 1240, growth: '+12%', stock: 450 },
    { name: 'Panadol Extra', sales: 980, growth: '+5%', stock: 1200 },
    { name: 'Insulin Glargine', sales: 520, growth: '+24%', stock: 85 },
    { name: 'Surgical Masks', sales: 440, growth: '-2%', stock: 5000 },
  ];

  const regionalData = [
    { county: 'Nairobi', percentage: 45, color: 'bg-[#0d9488]' },
    { county: 'Mombasa', percentage: 22, color: 'bg-teal-400' },
    { county: 'Kisumu', percentage: 15, color: 'bg-teal-200' },
    { county: 'Others', percentage: 18, color: 'bg-slate-200' },
  ];

  return (
    <SupplierLayout>
      <Head title="Business Analytics" />

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
               onChange={(e) => setTimeRange(e.target.value)}
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

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Gross Sales" value="KES 2.4M" change="14.2%" isPositive={true} icon={BarChart3} />
        <StatCard title="Order Volume" value="482" change="8.1%" isPositive={true} icon={ShoppingBag} />
        <StatCard title="Avg. Order Value" value="KES 4,975" change="2.4%" isPositive={false} icon={Zap} />
        <StatCard title="New Customers" value="28" change="12.5%" isPositive={true} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#0d9488]" />
              Revenue Performance
            </h3>
            <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wider">
               <div className="flex items-center text-slate-400"><span className="h-3 w-3 rounded-full bg-slate-200 mr-1.5"></span> Previous</div>
               <div className="flex items-center text-[#0d9488]"><span className="h-3 w-3 rounded-full bg-[#0d9488] mr-1.5"></span> Current</div>
            </div>
          </div>

          <div className="h-72 flex items-end justify-between gap-2 px-2">
            {[30, 45, 35, 55, 65, 40, 50, 80, 70, 60, 75, 90, 85, 95, 100].map((val, i) => (
              <div key={i} className="flex-1 group relative h-full flex items-end">
                {/* Previous Period Bar (Shadow) */}
                <div
                  className="absolute bottom-0 w-full bg-slate-100 rounded-t-lg transition-all"
                  style={{ height: `${val * 0.7}%` }}
                ></div>
                {/* Current Period Bar */}
                <div
                  className="relative w-full bg-[#0d9488]/80 group-hover:bg-[#0d9488] rounded-t-lg transition-all duration-500"
                  style={{ height: `${val}%` }}
                ></div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                  KES {val * 10}k
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-1 text-[10px] font-bold text-slate-400 uppercase">
             <span>Week 1</span>
             <span>Week 2</span>
             <span>Week 3</span>
             <span>Week 4</span>
          </div>
        </div>

        {/* Customer Locations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center">
            <Map className="h-5 w-5 mr-2 text-[#0d9488]" />
            Regional Sales
          </h3>
          <div className="space-y-6">
            {regionalData.map((data) => (
              <div key={data.county}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">{data.county}</span>
                  <span className="text-xs font-black text-slate-400">{data.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${data.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${data.percentage}%` }}></div>
                </div>
              </div>
            ))}
            <div className="pt-6 mt-6 border-t border-slate-100">
               <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 flex items-center">
                  <Activity className="h-5 w-5 text-[#0d9488] mr-3" />
                  <p className="text-xs text-teal-800 font-medium leading-relaxed">
                    <strong>Nairobi</strong> continues to be your highest growth market this month.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center">
               <Pill className="h-5 w-5 mr-2 text-[#0d9488]" />
               Top Moving Inventory
            </h3>
            <button className="text-xs font-bold text-[#0d9488] hover:underline">View Inventory Report</button>
          </div>
          <div className="divide-y divide-slate-100">
            {topProducts.map((product) => (
              <div key={product.name} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center mr-4 text-slate-400">
                    <Pill size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{product.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{product.stock} units remaining</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{product.sales.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">{product.growth} Sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent New Customers */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center">
                 <Building2 className="h-5 w-5 mr-2 text-[#0d9488]" />
                 New Client Acquisitions
              </h3>
              <button className="text-xs font-bold text-[#0d9488] hover:underline">CRM Dashboard</button>
           </div>
           <div className="p-2 space-y-1">
              {[
                { name: 'City Square Pharmacy', date: '2 hours ago', totalSpent: 'KES 45,000' },
                { name: 'MediLife Hospital', date: '5 hours ago', totalSpent: 'KES 12,800' },
                { name: 'Westlands Health Centre', date: 'Yesterday', totalSpent: 'KES 89,500' },
                { name: 'Afya First Chemists', date: '2 days ago', totalSpent: 'KES 22,000' },
              ].map((customer) => (
                <div key={customer.name} className="p-4 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-all group cursor-pointer">
                   <div className="flex items-center">
                      <div className="h-10 w-10 bg-teal-50 text-[#0d9488] rounded-full flex items-center justify-center font-black text-xs mr-3">
                         {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors">{customer.name}</p>
                         <p className="text-[10px] text-slate-400 font-medium">Joined {customer.date}</p>
                      </div>
                   </div>
                   <div className="flex items-center text-right">
                      <div className="mr-4">
                         <p className="text-xs font-bold text-slate-700">{customer.totalSpent}</p>
                         <p className="text-[10px] text-slate-400">Total Orders</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
