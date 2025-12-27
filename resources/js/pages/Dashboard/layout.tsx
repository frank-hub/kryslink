
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, ShoppingCart, Package, FileText,
  Settings, LogOut, Menu, X, Bell, User, Shield,
  Building2, History, Truck, Search
} from 'lucide-react';
import { initializeTheme } from '../../hooks/use-appearance';

// Ensure theme is initialized
initializeTheme();

const SidebarItem = ({ icon: Icon, label, href, active }: any) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 group ${
      active
        ? 'bg-[#0d9488]/10 text-[#0d9488] font-semibold shadow-sm'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon className={`h-5 w-5 ${active ? 'text-[#0d9488]' : 'text-slate-400 group-hover:text-slate-600'}`} />
    <span>{label}</span>
  </Link>
);

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { url } = usePage();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
- fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col
- ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
+ fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col
+ transition-transform duration-300 ease-in-out
+ ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
`}>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
           <Link href="/" className="flex items-center space-x-2">
              <div className="bg-[#0d9488] p-1.5 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">MediConnect<span className="text-[#0d9488]">KE</span></span>
           </Link>
           <button
             className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
             onClick={() => setSidebarOpen(false)}
           >
             <X className="h-6 w-6" />
           </button>
        </div>

        {/* User Info (Mini) */}
        <div className="px-6 py-6">
            <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-[#0d9488] font-bold text-lg border-2 border-white shadow-sm">
                    CP
                </div>
                <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">City Pharmacy</p>
                    <p className="text-xs text-slate-500 truncate">KRA: P051234567Z</p>
                </div>
            </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
            <div>
                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Overview</p>
                <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard/index" active={url === '/dashboard'} />
                <SidebarItem icon={History} label="Recent Orders" href="/dashboard/orders" active={url.startsWith('/dashboard/orders')} />
            </div>

            <div>
                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Procurement</p>
                <SidebarItem icon={ShoppingCart} label="Marketplace" href="/marketplace" active={false} />
                <SidebarItem icon={Truck} label="Suppliers" href="/dashboard/suppliers" active={url.startsWith('/dashboard/suppliers')} />
            </div>

            <div>
                <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Finance & Admin</p>
                <SidebarItem icon={Shield} label="Compliance" href="/dashboard/compliance" active={url.startsWith('/dashboard/compliance')} />
                <SidebarItem icon={Settings} label="Settings" href="/dashboard/settings" active={url.startsWith('/dashboard/settings')} />
            </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100">
             <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
            </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-6 lg:px-8 shadow-sm">
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="mr-4 lg:hidden text-slate-500 hover:text-slate-700"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="hidden md:flex relative max-w-md w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search orders, invoices, or products..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                 <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900">Dr. Sarah K.</p>
                        <p className="text-xs text-slate-500">Chief Pharmacist</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                        <User className="h-full w-full p-2 text-slate-400" />
                    </div>
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
};
