
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Trash2, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Layout } from './Layout';
import { CartItem } from '../../../types';

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mediconnect_cart') : null;
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mediconnect_cart', JSON.stringify(cart));
    // Trigger global update for navbar count
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }, [cart]);

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  return (
    <Layout>
      <Head title="Shopping Cart" />
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Procurement Cart</h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="bg-slate-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
              <p className="text-slate-500 mb-8">Looks like you haven't added any medical supplies yet.</p>
              <Link href="/marketplace" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#0d9488] hover:bg-[#0f766e] transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" /> Return to Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {cart.map((item) => (
                      <div key={item.id} className="p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center w-full">
                          <div className="h-20 w-20 flex-shrink-0 bg-slate-50 rounded-lg border border-slate-100 p-2 mr-4">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg md:text-base">{item.name}</h3>
                            <p className="text-sm text-slate-500">{item.supplier}</p>
                            <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm flex items-center mt-2 hover:text-red-600 md:hidden">
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </button>
                          </div>
                        </div>
                        <div className="col-span-2 text-center w-full flex justify-between md:block px-4 md:px-0">
                          <span className="md:hidden text-slate-500 font-medium">Price:</span>
                          <span className="text-slate-900">KES {item.price.toLocaleString()}</span>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="inline-flex items-center border border-slate-300 rounded-lg">
                            <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 text-slate-600 hover:bg-slate-100">-</button>
                            <span className="px-3 font-medium text-slate-900 min-w-[2rem]">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 text-slate-600 hover:bg-slate-100">+</button>
                          </div>
                        </div>
                        <div className="col-span-2 text-right w-full flex justify-between md:block px-4 md:px-0 mt-2 md:mt-0">
                          <span className="md:hidden text-slate-500 font-medium">Total:</span>
                          <div className="font-bold text-slate-900">KES {(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                         <button onClick={() => removeItem(item.id)} className="hidden md:block absolute right-6 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>VAT (16%)</span>
                      <span>KES {vat.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-lg text-slate-900">
                      <span>Total</span>
                      <span>KES {total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link href="/checkout" className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-[#0d9488] hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98]">
                      Proceed to Checkout <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                    <p className="mt-4 text-xs text-center text-slate-400">
                      Secure checkout powered by MediConnect Payments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
