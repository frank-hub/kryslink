import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';


import {
  Search, MapPin, ShieldCheck, CheckCircle, TrendingUp, Building2, Truck,
  ShoppingCart, Menu, X, Trash2, ShoppingBag, MessageSquare,
  Send, Bot, Loader2, Phone, Mail, Star, Plus, User,
  Clock, Shield, Award, Zap, Users, TrendingDown, Package,
  FileText, ChevronRight, PlayCircle, ArrowRight
} from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { KENYA_COUNTIES } from '../constants';
import { CartItem, ChatMessage, Product, NewUser } from '../../../types';
import { Layout } from './Layout';
import { AIChatBot } from '@/components/AIChatBot';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';

// ... (Keep all your existing component definitions: Navbar, Footer, CartDrawer, AuthModal, AIChatBot)
// I'm showing only the main Welcome component changes below

export default function Welcome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mediconnect_cart') : null;
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.setItem('mediconnect_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleAdd = (e: any) => {
      const product = e.detail;
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        return [...prev, { ...product, quantity: 1 }];
      });
      setIsCartOpen(true);
    };
    window.addEventListener('add-to-cart', handleAdd);
    return () => window.removeEventListener('add-to-cart', handleAdd);
  }, []);

  const handleRemoveFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const handleUpdateQty = (id: string, delta: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));

  const handleSearch = () => {
    router.visit('/marketplace');
  };

  const addToCart = (product: Product) => {
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
  };

  interface PageProps {
    auth?: {
      user?: any;
    };
    canRegister: boolean;
    products: Product[];
    stats: {
      total_products: number;
      total_suppliers: number;
      verified_products: number;
    };
  }

  const { canRegister, products, stats } = usePage<PageProps>().props;
  const featuredProducts = products?.slice(0, 8) || [];

  return (
    <Layout>
      <div className="flex-grow bg-slate-50">
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden pb-16">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-[#0d9488]/10 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-50/60 rounded-full blur-3xl opacity-60"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Trusted by 1,200+ Kenyan Pharmacies & Hospitals</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-tight">
                Your pharmacy's all-in-one <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-teal-500">Marketplace.</span>
              </h1>

              <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12">
                Simplifying how pharmacies find, compare, and order products.
              </p>

              {/* Search Bar */}
              <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative flex items-center px-4">
                  <Search className="h-5 w-5 text-slate-400 absolute left-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-9 py-3 bg-transparent border-none text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none text-lg"
                    placeholder="What are you looking for today?"
                  />
                </div>
                <div className="hidden sm:block w-px bg-slate-100 my-2"></div>
                <div className="flex-shrink-0 flex items-center px-4 sm:w-56">
                  <MapPin className="h-5 w-5 text-slate-400 mr-2" />
                  <select className="w-full bg-transparent border-none text-slate-600 text-sm font-medium focus:ring-0 cursor-pointer">
                    <option>Nairobi Region</option>
                    <option>Mombasa Region</option>
                    <option>All Kenya</option>
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                >
                  Search
                </button>
              </div>

              {/* Updated Benefits Grid */}
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div className="bg-white/70 backdrop-blur p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <Users className="h-8 w-8 text-[#0d9488] mb-3" />
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Multiple Suppliers</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    No more calling around to find medicines
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <ShieldCheck className="h-8 w-8 text-[#0d9488] mb-3" />
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Verified Credibility</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Only PPB licensed suppliers
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <TrendingDown className="h-8 w-8 text-[#0d9488] mb-3" />
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Price Comparison</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Compare prices across multiple suppliers
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <Zap className="h-8 w-8 text-[#0d9488] mb-3" />
                  <h3 className="font-bold text-slate-900 text-sm mb-1">KrysLink Express</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Fast delivery for urgent orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-[#0d9488] to-teal-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stats?.total_products || '5,000'}+</div>
                <div className="text-teal-100 text-sm font-medium">Products Available</div>
              </div>
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stats?.total_suppliers || '200'}+</div>
                <div className="text-teal-100 text-sm font-medium">Verified Suppliers</div>
              </div>
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">1,200+</div>
                <div className="text-teal-100 text-sm font-medium">Active Pharmacies</div>
              </div>
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                <div className="text-teal-100 text-sm font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How KrysLink Works</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Get started in minutes and transform your procurement process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 h-full border border-teal-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#0d9488] text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Create Your Account</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Register your pharmacy or hospital. Upload your PPB license and KRA PIN for verification.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#0d9488] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Quick 5-minute registration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#0d9488] mr-2 mt-0.5 flex-shrink-0" />
                      <span>24-hour verification process</span>
                    </li>
                  </ul>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className="h-8 w-8 text-teal-300" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 h-full border border-teal-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#0d9488] text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Browse & Compare</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Search thousands of products and compare prices from multiple verified suppliers.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#0d9488] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Real-time stock availability</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#0d9488] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Transparent pricing</span>
                    </li>
                  </ul>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className="h-8 w-8 text-teal-300" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 h-full border border-teal-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#0d9488] text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Order & Receive</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Place your order and get delivery within 1-3 business days across Kenya.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#0d9488] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Track your order in real-time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-[#0d9488] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Secure payment options</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-[#0d9488] text-white font-semibold rounded-xl hover:bg-[#0f766e] transition-all shadow-lg shadow-teal-500/30"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Popular Categories</h2>
                <p className="mt-2 text-slate-500 text-lg">Essential supplies for your facility.</p>
              </div>
              <Link href="/marketplace" className="text-[#0d9488] font-semibold hover:text-[#0f766e] flex items-center group">
                View Marketplace
                <TrendingUp className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Antibiotics', count: '320+ Products', color: 'bg-blue-50 text-blue-600', icon: '💊' },
                { name: 'Pain Relief', count: '150+ Products', color: 'bg-red-50 text-red-600', icon: '🩹' },
                { name: 'Surgical Supplies', count: '500+ Products', color: 'bg-teal-50 text-teal-600', icon: '⚕️' },
                { name: 'Diabetes Care', count: '80+ Products', color: 'bg-orange-50 text-orange-600', icon: '💉' }
              ].map((cat, idx) => (
                <Link
                  href="/marketplace"
                  key={idx}
                  className="group bg-white p-8 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className={`h-16 w-16 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-2xl`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-[#0d9488] transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">{cat.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose KrysLink Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Healthcare Providers Trust KrysLink
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Join thousands of pharmacies and hospitals streamlining their procurement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 bg-[#0d9488] rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">100% PPB Verified</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every supplier on our platform is thoroughly vetted and holds valid PPB licenses.
                  Your compliance is our priority.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 bg-[#0d9488] rounded-xl flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Save Time & Money</h3>
                <p className="text-slate-600 leading-relaxed">
                  Compare prices instantly instead of calling multiple suppliers.
                  Reduce procurement time by up to 70%.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 bg-[#0d9488] rounded-xl flex items-center justify-center mb-6">
                  <Truck className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Reliable Delivery</h3>
                <p className="text-slate-600 leading-relaxed">
                  Nationwide delivery network with cold chain capability.
                  Track your orders in real-time from warehouse to doorstep.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 bg-[#0d9488] rounded-xl flex items-center justify-center mb-6">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Complete Documentation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Access Certificates of Analysis, import licenses, and all required documentation
                  with every order.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 bg-[#0d9488] rounded-xl flex items-center justify-center mb-6">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Assurance</h3>
                <p className="text-slate-600 leading-relaxed">
                  All products meet WHO-GMP standards. Regular quality audits ensure you
                  receive only authentic medicines.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
                <div className="w-14 h-14 bg-[#0d9488] rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Dedicated Support</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our team of pharmaceutical experts is available 24/7 to assist with
                  orders, queries, and urgent requests.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#0d9488] to-teal-600 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Procurement?
            </h2>
            <p className="text-xl text-teal-50 mb-10 max-w-2xl mx-auto">
              Join 1,200+ pharmacies and hospitals already saving time and money with KrysLink
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0d9488] font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Browse Products
              </Link>
            </div>
            <p className="text-teal-100 text-sm mt-6">
              No credit card required • Free forever • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Keep your existing components */}
      <AIChatBot />
      <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              items={cart}
              onRemove={handleRemoveFromCart}
              onUpdateQty={handleUpdateQty} onCheckout={function (): void {
                  throw new Error('Function not implemented.');
              } }      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={() => { setIsLoggedIn(true); setIsAuthOpen(false); }}
      />
    </Layout>
  );
}
