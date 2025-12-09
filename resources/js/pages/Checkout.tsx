
import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Truck, CreditCard, CheckCircle, FileText } from 'lucide-react';
import { Layout } from './Layout';
import { CartItem } from '../../../types';

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mediconnect_cart') : null;
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate processing
    setTimeout(() => {
        // Clear cart
        localStorage.removeItem('mediconnect_cart');
        window.dispatchEvent(new CustomEvent('cart-updated')); // Notify other components
        router.visit('/payment-confirmation');
    }, 1500);
  };

  return (
    <Layout>
      <Head title="Checkout" />
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Secure Checkout</h1>
            <p className="text-slate-500 mt-2">Complete your purchase securely.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Forms */}
            <div className="space-y-6">

                {/* 1. Organization Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center mb-4 text-slate-900 font-semibold">
                        <div className="bg-teal-100 p-2 rounded-full mr-3 text-[#0d9488]"><ShieldCheck className="h-5 w-5" /></div>
                        Organization Details
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                            <input type="text" required className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2.5" placeholder="e.g. City General Hospital" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">KRA PIN</label>
                                <input type="text" required className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2.5" placeholder="P00..." />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">LPO Number (Optional)</label>
                                <input type="text" className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2.5" placeholder="LPO-2024-..." />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Shipping Address */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                     <div className="flex items-center mb-4 text-slate-900 font-semibold">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600"><Truck className="h-5 w-5" /></div>
                        Delivery Address
                    </div>
                     <div className="space-y-4">
                        <input type="text" required className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2.5" placeholder="Street Address / Building" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" required className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2.5" placeholder="City" />
                             <select className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2.5">
                                 <option>Nairobi</option>
                                 <option>Mombasa</option>
                                 <option>Kisumu</option>
                                 <option>Nakuru</option>
                             </select>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <input type="text" required className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2.5" placeholder="Contact Person" />
                             <input type="tel" required className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2.5" placeholder="Phone Number" />
                        </div>
                    </div>
                </div>

                {/* 3. Payment Method */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                     <div className="flex items-center mb-4 text-slate-900 font-semibold">
                        <div className="bg-purple-100 p-2 rounded-full mr-3 text-purple-600"><CreditCard className="h-5 w-5" /></div>
                        Payment Method
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center p-4 border border-[#0d9488] bg-teal-50 rounded-lg cursor-pointer transition-all">
                            <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488]" />
                            <div className="ml-3">
                                <span className="block text-sm font-medium text-slate-900">M-PESA / Mobile Money</span>
                                <span className="block text-xs text-slate-500">Instant confirmation via STK Push</span>
                            </div>
                        </label>
                        <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-all">
                            <input type="radio" name="payment" className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488]" />
                            <div className="ml-3">
                                <span className="block text-sm font-medium text-slate-900">Bank Transfer / EFT</span>
                                <span className="block text-xs text-slate-500">Details will be sent to your email</span>
                            </div>
                        </label>
                        <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-all">
                            <input type="radio" name="payment" className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488]" />
                            <div className="ml-3">
                                <span className="block text-sm font-medium text-slate-900">Credit 30 Days</span>
                                <span className="block text-xs text-slate-500">Subject to credit limit approval</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Right Column: Summary */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
                    <ul className="divide-y divide-slate-100 mb-4 max-h-60 overflow-y-auto">
                        {cart.map(item => (
                            <li key={item.id} className="py-3 flex justify-between text-sm">
                                <span className="text-slate-600"><span className="font-bold text-slate-800">{item.quantity}x</span> {item.name}</span>
                                <span className="text-slate-900 font-medium">KES {(item.price * item.quantity).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-slate-500"><span>Shipping</span><span>Calculated at next step</span></div>
                        <div className="flex justify-between text-slate-500"><span>VAT (16%)</span><span>KES {vat.toLocaleString()}</span></div>
                        <div className="flex justify-between text-slate-900 font-bold text-lg pt-2"><span>Total</span><span>KES {total.toLocaleString()}</span></div>
                    </div>

                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start">
                        <FileText className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                        <p className="text-xs text-yellow-700">An electronic tax invoice (ETIMS) will be generated automatically upon payment completion.</p>
                    </div>

                    <button type="submit" className="mt-6 w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-[#0d9488] hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98]">
                        Confirm & Pay KES {total.toLocaleString()}
                    </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
