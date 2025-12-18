
import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  ShoppingCart, Menu, Search, User, ShieldCheck, X, Trash2,
  ShoppingBag, Building2, MessageSquare, Send, Bot, Loader2,
  Phone, Mail, MapPin, LogOut
} from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { CartItem, ChatMessage, Product } from '../../../types';
import { KENYA_COUNTIES } from '../constants';

// --- Shared Components for Layout ---

const Navbar = ({ cartCount, onOpenCart, isLoggedIn, onAuthOpen }: any) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="bg-[#0d9488] p-2 rounded-lg mr-2">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">MediConnect<span className="text-[#0d9488]">KE</span></span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-slate-600 hover:text-[#0d9488] font-medium transition-colors">Home</Link>
            <Link href="/marketplace" className="text-slate-600 hover:text-[#0d9488] font-medium transition-colors">Marketplace</Link>
            <button className="text-slate-600 hover:text-[#0d9488] font-medium transition-colors">Suppliers</button>
            <button className="text-slate-600 hover:text-[#0d9488] font-medium transition-colors">Track Order</button>
          </div>

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
               <Link href="/dashboard/index" className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                 <User className="h-5 w-5" />
               </Link>
            ) : (
              <button
                onClick={onAuthOpen}
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg p-4 z-40">
           <div className="flex flex-col space-y-4">
              <Link href="/" className="text-slate-600 hover:text-[#0d9488] font-medium transition-colors py-2 border-b border-slate-100">Home</Link>
              <Link href="/marketplace" className="text-slate-600 hover:text-[#0d9488] font-medium transition-colors py-2 border-b border-slate-100">Marketplace</Link>
              <button className="text-left text-slate-600 hover:text-[#0d9488] font-medium transition-colors py-2 border-b border-slate-100">Suppliers</button>
              <button className="text-left text-slate-600 hover:text-[#0d9488] font-medium transition-colors py-2 border-b border-slate-100">Track Order</button>
              {!isLoggedIn && (
                <button
                  onClick={() => { onAuthOpen(); setIsMobileMenuOpen(false); }}
                  className="w-full text-center px-4 py-2 bg-[#0d9488] text-white rounded-md font-medium"
                >
                  Sign In
                </button>
              )}
           </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
               <div className="bg-[#0d9488] p-2 rounded-lg mr-2">
                  <ShieldCheck className="h-6 w-6 text-white" />
               </div>
               <span className="text-xl font-bold text-slate-900 tracking-tight">MediConnect<span className="text-[#0d9488]">KE</span></span>
            </div>
            <p className="text-sm text-slate-500">
              Connecting Kenya's healthcare providers with trusted pharmaceutical suppliers. Seamless, compliant, and efficient.
            </p>
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/marketplace" className="hover:text-[#0d9488]">Marketplace</Link></li>
              <li><a href="#" className="hover:text-[#0d9488]">List as Supplier</a></li>
              <li><a href="#" className="hover:text-[#0d9488]">Pharmacy Registration</a></li>
              <li><a href="#" className="hover:text-[#0d9488]">PPB Compliance</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-[#0d9488]">Help Center</a></li>
              <li><a href="#" className="hover:text-[#0d9488]">Returns Policy</a></li>
              <li><a href="#" className="hover:text-[#0d9488]">Dispute Resolution</a></li>
              <li><a href="#" className="hover:text-[#0d9488]">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center"><Phone className="h-4 w-4 mr-2 text-[#0d9488]" /> +254 700 123 456</li>
              <li className="flex items-center"><Mail className="h-4 w-4 mr-2 text-[#0d9488]" /> support@mediconnect.co.ke</li>
              <li className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-[#0d9488]" /> Westlands, Nairobi, Kenya</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 mt-12 pt-8 text-sm text-center text-slate-400">
          &copy; {new Date().getFullYear()} MediConnect Kenya. All rights reserved.
        </div>
      </div>
    </footer>
);

const CartDrawer = ({ isOpen, onClose, items, onRemove, onUpdateQty }: any) => {
    if (!isOpen) return null;
    const subtotal = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    return (
      <div className="fixed inset-0 overflow-hidden z-[60]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-slate-200">
                <h2 className="text-lg font-medium text-slate-900 flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-[#0d9488]" /> Your Procurement Cart
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-500"><X className="h-6 w-6" /></button>
              </div>
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="bg-slate-100 p-6 rounded-full mb-4"><ShoppingBag className="h-10 w-10 text-slate-300" /></div>
                      <p className="text-slate-500 text-lg">Your cart is empty.</p>
                      <p className="text-slate-400 text-sm mt-2">Start adding medical supplies from the marketplace.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-200">
                    {items.map((item: CartItem) => (
                      <li key={item.id} className="py-6 flex">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-slate-900">
                              <h3 className="line-clamp-2 leading-tight mr-4">{item.name}</h3>
                              <p className="whitespace-nowrap">KES {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{item.supplier}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center border border-slate-300 rounded-md">
                              <button onClick={() => onUpdateQty(item.id, -1)} className="px-3 py-1 hover:bg-slate-100 text-slate-600" disabled={item.quantity <= 1}>-</button>
                              <span className="px-2 font-medium text-slate-900">{item.quantity}</span>
                              <button onClick={() => onUpdateQty(item.id, 1)} className="px-3 py-1 hover:bg-slate-100 text-slate-600">+</button>
                            </div>
                            <button type="button" onClick={() => onRemove(item.id)} className="font-medium text-red-600 hover:text-red-500 flex items-center">
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {items.length > 0 && (
                  <div className="border-t border-slate-200 py-6 px-4 sm:px-6 bg-slate-50">
                      <div className="flex justify-between text-base font-medium text-slate-900 mb-2"><p>Subtotal</p><p>KES {subtotal.toLocaleString()}</p></div>
                      <div className="flex justify-between text-sm text-slate-500 mb-4"><p>VAT (16%)</p><p>KES {tax.toLocaleString()}</p></div>
                      <div className="flex justify-between text-lg font-bold text-slate-900 mb-6"><p>Total</p><p>KES {total.toLocaleString()}</p></div>
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/cart"
                            className="w-full flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            View Cart
                        </Link>
                        <Link
                            href="/checkout"
                            className="w-full flex items-center justify-center rounded-lg border border-transparent bg-[#0d9488] px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#0f766e] transition-colors"
                        >
                            Checkout
                        </Link>
                      </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

const AuthModal = ({ isOpen, onClose, onLogin }: any) => {
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('PHARMACY');
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[70] overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-500"><X className="h-6 w-6" /></button>
              </div>
              <div className="flex flex-col md:flex-row h-full">
                  <div className="hidden md:flex md:w-5/12 bg-[#0d9488] p-8 flex-col justify-between text-white">
                      <div><Building2 className="h-10 w-10 mb-4 text-primary-200" /><h3 className="text-2xl font-bold mb-2">Join MediConnect</h3><p className="text-primary-100 text-sm">Access Kenya's largest network of verified pharmaceutical suppliers.</p></div>
                      <div className="space-y-4 text-xs text-primary-200">
                          <div className="flex items-center"><div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>Bulk Pricing</div>
                          <div className="flex items-center"><div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>Next Day Delivery</div>
                      </div>
                  </div>
                  <div className="w-full md:w-7/12 p-8">
                      <div className="mb-6"><h2 className="text-2xl font-bold text-slate-900">{isLogin ? 'Sign In' : 'Create Account'}</h2></div>
                      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                          {!isLogin && (
                             <>
                               <div className="grid grid-cols-2 gap-4 mb-2">
                                  <button type="button" onClick={() => setUserType('PHARMACY')} className={`py-2 px-4 text-sm font-medium rounded-md text-center border ${userType === 'PHARMACY' ? 'border-[#0d9488] bg-teal-50 text-[#0d9488]' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>Pharmacy</button>
                                  <button type="button" onClick={() => setUserType('HOSPITAL')} className={`py-2 px-4 text-sm font-medium rounded-md text-center border ${userType === 'HOSPITAL' ? 'border-[#0d9488] bg-teal-50 text-[#0d9488]' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>Hospital</button>
                               </div>
                               <input type="text" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Business Name" required />
                               <div className="grid grid-cols-2 gap-4">
                                  <input type="text" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="KRA PIN" required />
                                  <select className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">{KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
                               </div>
                             </>
                          )}
                          <input type="email" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Email" required />
                          <input type="password" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Password" required />
                          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e]">{isLogin ? 'Sign In' : 'Submit for Verification'}</button>
                      </form>
                      <div className="mt-6 text-center"><button onClick={() => setIsLogin(!isLogin)} className="font-medium text-[#0d9488] hover:text-[#0f766e] text-sm">{isLogin ? 'Register Now' : 'Sign In'}</button></div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
};

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'model', text: "Jambo! I'm Daktari AI 🤖. How can I assist your pharmacy today?", timestamp: new Date() }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const responseText = await generateAIResponse(userMsg.text);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isOpen ? 'bg-red-500 rotate-90' : 'bg-[#0d9488] hover:bg-[#0f766e]'} text-white`}>
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200" style={{ maxHeight: '600px', height: '80vh' }}>
          <div className="bg-[#0d9488] p-4 flex items-center text-white"><div className="bg-white/20 p-2 rounded-full mr-3"><Bot className="h-6 w-6" /></div><div><h3 className="font-bold">Daktari AI</h3><p className="text-xs text-primary-100">Online</p></div></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#0d9488] text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'}`}>{msg.text}</div>
              </div>
            ))}
            {isLoading && <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2"><Loader2 className="h-4 w-4 animate-spin text-[#0d9488]" /><span className="text-xs text-slate-500">Thinking...</span></div></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#0d9488]" />
            <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-2 bg-[#0d9488] text-white rounded-full hover:bg-[#0f766e] disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </>
  );
};

// --- Main Layout Component ---

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mediconnect_cart') : null;
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('mediconnect_cart', JSON.stringify(cart));
  }, [cart]);

  // Listen for "add-to-cart" event from any page
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

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Navbar
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        isLoggedIn={isLoggedIn}
        onAuthOpen={() => setIsAuthOpen(true)}
      />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      <AIChatBot />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateQty}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={() => { setIsLoggedIn(true); setIsAuthOpen(false); }}
      />
    </div>
  );
};
