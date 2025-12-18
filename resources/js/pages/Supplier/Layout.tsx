import React, { useState, PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3,
  Settings, LogOut, Menu, X, Bell, User, Truck,
  ShieldCheck, Wallet, FileText, ChevronDown
} from 'lucide-react';
import { initializeTheme } from '../../hooks/use-appearance';

// Ensure theme is initialized
initializeTheme();

const SidebarItem = ({ icon: Icon, label, href, active, badge }: any) => (
  <Link
    href={href}
    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 mb-1 group ${
      active
        ? 'bg-[#0d9488]/10 text-[#0d9488] font-semibold shadow-sm'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${active ? 'text-[#0d9488]' : 'text-slate-400 group-hover:text-slate-600'}`} />
        <span>{label}</span>
    </div>
    {badge && (
        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {badge}
        </span>
    )}
  </Link>
);

export const SupplierLayout = ({ children }: PropsWithChildren) => {
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
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100 bg-slate-50/50">
           <Link href="/" className="flex items-center space-x-2">
              <div className="bg-[#0d9488] p-1.5 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                  <span className="text-lg font-bold text-slate-800 tracking-tight block leading-none">MediConnect</span>
                  <span className="text-[10px] font-bold text-[#0d9488] tracking-widest uppercase">Supplier Portal</span>
              </div>
           </Link>
           <button
             className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
             onClick={() => setSidebarOpen(false)}
           >
             <X className="h-6 w-6" />
           </button>
        </div>

        {/* Supplier Profile Card */}
        <div className="px-6 py-6">
            <div className="flex items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                    DP
                </div>
                <div className="ml-3 overflow-hidden flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">Davita Pharma</p>
                    <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                        <p className="text-xs text-slate-500 truncate">Verified Seller</p>
                    </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
            <div>
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Business Overview</p>
                <SidebarItem
                  icon={LayoutDashboard}
                  label="Dashboard"
                  href="/supplier/dashboard"
                  active={url === '/supplier/dashboard'}
                />
                <SidebarItem
                  icon={BarChart3}
                  label="Analytics & Reports"
                  href="/supplier/analytics"
                  active={url.startsWith('/supplier/analytics')}
                />
            </div>

            <div>
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sales & Logistics</p>
                <SidebarItem
                  icon={ShoppingCart}
                  label="Orders"
                  href="/supplier/orders"
                  active={url.startsWith('/supplier/orders')}
                  badge="5"
                />
                <SidebarItem
                  icon={Package}
                  label="My Products"
                  href="/supplier/products"
                  active={url.startsWith('/supplier/products')}
                />
                <SidebarItem
                  icon={Truck}
                  label="Shipments"
                  href="/supplier/shipments"
                  active={url.startsWith('/supplier/shipments')}
                />
            </div>

            <div>
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Finance</p>
                <SidebarItem
                  icon={Wallet}
                  label="Earnings & Payouts"
                  href="/supplier/finance"
                  active={url.startsWith('/supplier/finance')}
                />
                <SidebarItem
                  icon={FileText}
                  label="Invoices"
                  href="/supplier/invoices"
                  active={url.startsWith('/supplier/invoices')}
                />
            </div>

            <div>
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Settings</p>
                <SidebarItem
                  icon={Settings}
                  label="Company Profile"
                  href="/supplier/settings"
                  active={url.startsWith('/supplier/settings')}
                />
            </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
             <Link href="/logout" method="post" as="button" className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-white hover:text-red-600 hover:shadow-sm transition-all text-sm font-medium border border-transparent hover:border-slate-200">
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
            </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-6 lg:px-8 shadow-sm z-10">
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="mr-4 lg:hidden text-slate-500 hover:text-slate-700"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
                    Dashboard
                </h1>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-6">
                <div className="hidden md:flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100 text-sm font-medium">
                    <span className="relative flex h-2.5 w-2.5 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    System Operational
                </div>

                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                <button className="relative p-2 text-slate-400 hover:text-[#0d9488] hover:bg-teal-50 rounded-full transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 scroll-smooth">
            {children}
        </main>
      </div>
    </div>
  );
};
