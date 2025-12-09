import React from 'react';
import { ShoppingCart, Menu, Search, User, ShieldCheck } from 'lucide-react';
import { Page } from '../../../types';

interface NavbarProps {
  cartCount: number;
  onNavigate: (page: Page) => void;
  onOpenCart: () => void;
  isLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onNavigate, onOpenCart, isLoggedIn }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate(Page.HOME)}>
            <div className="bg-primary p-2 rounded-lg mr-2">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">MediConnect<span className="text-primary-600">KE</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => onNavigate(Page.HOME)} className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Home</button>
            <button onClick={() => onNavigate(Page.MARKETPLACE)} className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Marketplace</button>
            <button className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Suppliers</button>
            <button className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Track Order</button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
              <Search className="h-5 w-5" />
            </button>

            <button onClick={onOpenCart} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
               <button onClick={() => onNavigate(Page.PROFILE)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                 <User className="h-5 w-5" />
               </button>
            ) : (
              <button
                onClick={() => onNavigate(Page.AUTH)}
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Sign In
              </button>
            )}

            <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
