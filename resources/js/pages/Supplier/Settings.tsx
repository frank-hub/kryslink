import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
// Added Settings to the lucide-react import list
import {
  Building2, ShieldCheck, MapPin, Globe, Mail, Phone,
  CreditCard, Bell, Lock, Save, Camera, FileText,
  CheckCircle2, AlertCircle, ExternalLink, UserPlus, Trash2, Plus, Settings
} from 'lucide-react';

export default function SupplierSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'compliance', label: 'Compliance & Legal', icon: ShieldCheck },
    { id: 'payouts', label: 'Payout Settings', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <SupplierLayout>
      <Head title="Company Settings" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your company presence, compliance status, and account preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#0d9488] shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-[#0d9488]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {activeTab === 'profile' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900">General Information</h3>
                <button className="flex items-center px-4 py-2 bg-[#0d9488] text-white rounded-lg text-sm font-bold hover:bg-[#0f766e] transition-colors shadow-lg shadow-teal-500/20">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </button>
              </div>

              <div className="space-y-8">
                {/* Logo Upload */}
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 group-hover:border-[#0d9488] transition-colors overflow-hidden">
                       <Building2 className="h-10 w-10 text-slate-400 group-hover:text-[#0d9488]" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-slate-200 rounded-full shadow-md text-slate-600 hover:text-[#0d9488]">
                       <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Company Logo</h4>
                    <p className="text-sm text-slate-500">PNG or JPG, max 2MB. 400x400px recommended.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Display Name</label>
                    <input type="text" defaultValue="Davita Pharma Ltd" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-[#0d9488]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Legal Business Name</label>
                    <input type="text" defaultValue="Davita Pharmaceuticals Kenya Limited" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-[#0d9488]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Company Bio / Tagline</label>
                  <textarea rows={3} defaultValue="Leading distributor of quality pharmaceutical products in East Africa since 2005." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-[#0d9488]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Support Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type="email" defaultValue="orders@davitapharma.co.ke" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-[#0d9488]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type="tel" defaultValue="+254 712 345 678" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-[#0d9488]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type="text" defaultValue="www.davitapharma.co.ke" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-[#0d9488]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Headquarters Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type="text" defaultValue="Enterprise Road, Industrial Area, Nairobi" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-[#0d9488]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Regulatory Compliance</h3>
                  <p className="text-sm text-slate-500">Your documents are essential for operating as a licensed supplier.</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* PPB License */}
                <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/30 flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-emerald-100 mr-4">
                      <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center">
                        Pharmacy & Poisons Board License
                        <span className="ml-3 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded">Verified</span>
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">License No: <strong>PPB/DIST/2023/8821</strong></p>
                      <p className="text-xs text-slate-400 mt-1">Expiry Date: Dec 31, 2025</p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-[#0d9488] flex items-center hover:underline">
                    View Document <ExternalLink className="h-3 w-3 ml-1.5" />
                  </button>
                </div>

                {/* KRA PIN */}
                <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50/30 flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-blue-100 mr-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center">
                        KRA PIN & Tax Compliance
                        <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded">Verified</span>
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">PIN: <strong>P051234567Z</strong></p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 mr-1" /> ETIMS Integration Connected
                      </p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-[#0d9488] flex items-center hover:underline">
                    Update PIN <ExternalLink className="h-3 w-3 ml-1.5" />
                  </button>
                </div>

                {/* Alert for expired documents */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-800">License Renewal Reminder</p>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                      Your wholesale distribution license (PPB) will expire in 9 months. Please ensure your annual renewal is submitted 60 days before expiry to avoid marketplace suspension.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4">Request New Verification</h4>
                    <p className="text-sm text-slate-500 mb-4">If you've updated your business model (e.g., added Manufacturing), upload your new licenses here for review.</p>
                    <button className="px-6 py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-600 font-bold hover:border-[#0d9488] hover:text-[#0d9488] transition-all">
                      + Upload New Regulatory Certificate
                    </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900">Payout & Payment Settings</h3>
                <button className="flex items-center px-4 py-2 bg-[#0d9488] text-white rounded-lg text-sm font-bold hover:bg-[#0f766e]">
                   <Plus className="h-4 w-4 mr-2" /> Add Account
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-5 rounded-2xl border-2 border-[#0d9488] bg-teal-50/50 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mr-4">
                      <Building2 className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Standard Chartered Kenya</h4>
                      <p className="text-sm text-slate-500">Business Checking • ****4421</p>
                      <div className="flex items-center mt-1">
                        <span className="text-[10px] font-bold text-[#0d9488] uppercase bg-white px-2 py-0.5 rounded border border-teal-100">Primary Payout Method</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600"><Settings className="h-5 w-5" /></button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-slate-300 transition-all cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center mr-4">
                      <CreditCard className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700">M-PESA Business Till</h4>
                      <p className="text-sm text-slate-500">Till Number • 552910</p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1 text-xs font-bold text-[#0d9488] hover:underline">Set as Primary</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4">Payout Schedule</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <label className="flex items-center p-4 border-2 border-[#0d9488] bg-teal-50 rounded-xl cursor-pointer">
                          <input type="radio" name="schedule" defaultChecked className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488]" />
                          <div className="ml-3">
                             <p className="text-sm font-bold text-slate-900">Automatic (Daily)</p>
                             <p className="text-xs text-slate-500">Withdraw available balance every 24h</p>
                          </div>
                       </label>
                       <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                          <input type="radio" name="schedule" className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488]" />
                          <div className="ml-3">
                             <p className="text-sm font-bold text-slate-700">Manual Withdrawals</p>
                             <p className="text-xs text-slate-500">Payout only when requested</p>
                          </div>
                       </label>
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Notification Preferences</h3>

              <div className="space-y-6">
                {[
                  { id: 'orders', title: 'New Orders', desc: 'Notify when a pharmacy places an order.' },
                  { id: 'stock', title: 'Low Stock Alerts', desc: 'Receive alerts when inventory falls below threshold.' },
                  { id: 'payouts', title: 'Payout Confirmation', desc: 'Notifications for successful bank transfers.' },
                  { id: 'compliance', title: 'Legal & Compliance', desc: 'Critical alerts about license expiry or PPB notices.' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <div className="flex space-x-6">
                      <div className="flex items-center">
                        <input type="checkbox" defaultChecked id={`email-${item.id}`} className="h-4 w-4 text-[#0d9488] rounded border-slate-300" />
                        <label htmlFor={`email-${item.id}`} className="ml-2 text-xs font-medium text-slate-500">Email</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id={`sms-${item.id}`} className="h-4 w-4 text-[#0d9488] rounded border-slate-300" />
                        <label htmlFor={`sms-${item.id}`} className="ml-2 text-xs font-medium text-slate-500">SMS</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-8">Security & Access Control</h3>

              <div className="space-y-8">
                {/* Team Access */}
                <div>
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-800">Team Members</h4>
                      <button className="text-xs font-bold text-[#0d9488] flex items-center hover:underline">
                        <UserPlus className="h-3 w-3 mr-1" /> Add Staff
                      </button>
                   </div>
                   <div className="space-y-3">
                      {[
                        { name: 'John Doe', role: 'Account Manager', email: 'john@davitapharma.co.ke' },
                        { name: 'Alice Wangari', role: 'Warehouse Lead', email: 'alice@davitapharma.co.ke' }
                      ].map((member, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-bold text-slate-900">{member.name}</p>
                              <p className="text-[10px] text-slate-500">{member.role} • {member.email}</p>
                            </div>
                          </div>
                          <button className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Change Password */}
                <div className="pt-8 border-t border-slate-100">
                   <h4 className="font-bold text-slate-800 mb-4">Update Password</h4>
                   <div className="max-w-md space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                      </div>
                      <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800">Update Password</button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
}
