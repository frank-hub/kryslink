
import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';

import {
  Search, MapPin, ShieldCheck, CheckCircle, TrendingUp, Building2, Truck,
  ShoppingCart, Menu, X, Trash2, ShoppingBag, MessageSquare,
  Send, Bot, Loader2, Phone, Mail, Star, Plus, User
} from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { KENYA_COUNTIES, MOCK_PRODUCTS } from '../constants';
import { CartItem, ChatMessage, Product , NewUser } from '../../../types';
// NOTE: Since the user requested the Welcome page to be self-contained but we also have a Layout,
// we will duplicate the "Shell" logic here to ensure it works standalone as requested previously,
// OR better, we will wrap the content in the same structural divs.
// However, to keep it simple and consistent with the "Layout" request, we will duplicate the specialized Navbar for the Landing page if needed,
// but for now, reusing the Logic is best.
// The previous prompt asked for Welcome.tsx to be self-contained.
// We will use the Components defined in Layout.tsx to avoid massive code duplication if we were refactoring,
// but since this is a specific file request, I will include the necessary parts to make it function.

// However, to make the "Add to Cart" work seamlessly with the other pages which use Layout.tsx,
// this page should ALSO write to localStorage or use the same event system.


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
    const [newUser , setNewUser] = useState<NewUser>({
    id: '',
    name :'',
    email :'',
    password :'',
    password_confirmation :'',
    business_name :'',
    role : 'CUSTOMER',
    kra_pin :'',
    county :'',
    user_type : 'PHARMACY',
    isVerified : false,
})

const handleNewUser = async() => {
    const missingFields = [];
    if (!newUser.business_name) missingFields.push('Business Name');
    if (!newUser.kra_pin) missingFields.push('KRA PIN');
    if (!newUser.email) missingFields.push('Email');
    if (!newUser.password) missingFields.push('Password');
    if (!newUser.password_confirmation) missingFields.push('Password Confirmation');

    if (missingFields.length > 0) {
        alert(`Please fill in the following required fields:\n\n${missingFields.map(field => `• ${field}`).join('\n')}`);
        return;
    }

    try {
        const response = await axios.post('/register',newUser);

        alert(`Your Account Under ${newUser.business_name} was created`)
    }catch(error:any){
        console.error('Registration Error:', error.response);
        alert(`Registration Failed: ${error.response?.data?.message || error.message}`);
    }

}

const handleLogin = async() => {
    if (!newUser.email || !newUser.password) {
        alert('Please enter both email and password to sign in.');
        return;
    }
    try {
        const response = await axios.post('/authlogin',{email: newUser.email, password: newUser.password});

        alert('Login successful!');
        onClose();
    } catch (error: any) {
        console.error('Login Error:', error.response);
        alert(`Login Failed: ${error.response?.data?.message || error.message}`);
    }
}

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
                                <button type="button"
                                    onClick={() => {
                                    setUserType('PHARMACY');
                                    setNewUser({...newUser, user_type: 'PHARMACY'});
                                    }}
                                    className={`py-2 px-4 text-sm font-medium rounded-md text-center border ${userType === 'PHARMACY' ? 'border-[#0d9488] bg-teal-50 text-[#0d9488]' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                                    Pharmacy
                                </button>
                                <button type="button"
                                    onClick={() => {
                                    setUserType('HOSPITAL');
                                    setNewUser({...newUser, user_type: 'HOSPITAL'});
                                    }}
                                    className={`py-2 px-4 text-sm font-medium rounded-md text-center border ${userType === 'HOSPITAL' ? 'border-[#0d9488] bg-teal-50 text-[#0d9488]' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                                    Hospital
                                </button>
                                </div>
                               <input type="text"
                               value={newUser.business_name}
                               onChange={(e) => setNewUser({...newUser,business_name: e.target.value})}
                               className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Business Name" required />
                               <div className="grid grid-cols-2 gap-4">
                                  <input type="text"
                                  value={newUser.kra_pin}
                                  onChange={(e) => setNewUser({...newUser,kra_pin: e.target.value})}
                                   className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="KRA PIN" required />
                                   <select
                                        value={newUser.county}
                                        onChange={(e) => setNewUser({...newUser, county: e.target.value})}
                                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                                        <option value="">Select County</option>
                                        {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                               </div>
                             </>
                          )}
                          <input type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser,email: e.target.value})}
                           className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Email" required />
                          <input type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser,password: e.target.value})}
                           className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Password" required />
                          <button type="submit"
                          onClick={() => {  handleLogin(); }}
                           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e]">{isLogin ? 'Sign In' : 'Submit for Verification'}</button>
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

export default function Welcome() {
  const [searchTerm, setSearchTerm] = useState('');

  // Cart Logic duplication for standalone welcome page
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

  const featuredProducts = MOCK_PRODUCTS.slice(0, 8); // Display top 8 products

  const addToCart = (product: Product) => {
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Head title="Welcome" />

      {/* Navbar */}
      <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} isLoggedIn={isLoggedIn} onAuthOpen={() => setIsAuthOpen(true)} />

      {/* Main Content */}
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
                    <span>Trusted by 1,200+ Kenyan Pharmacies</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-tight">
                    Sourcing Medical Supplies <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-teal-500">Made Simple.</span>
                </h1>
                <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12">
                    Connect directly with verified manufacturers and distributors. Get wholesale pricing, PPB-compliant documentation, and nationwide delivery.
                </p>
                <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative flex items-center px-4">
                        <Search className="h-5 w-5 text-slate-400 absolute left-4" />
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="w-full pl-9 py-3 bg-transparent border-none text-slate-900 placeholder-slate-400 focus:ring-0 focus:outline-none text-lg" placeholder="What are you looking for today?" />
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
                    <button onClick={handleSearch} className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-teal-500/20 active:scale-95">Search</button>
                </div>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
                    <div className="bg-white/50 backdrop-blur p-4 rounded-xl border border-slate-100 shadow-sm"><ShieldCheck className="h-8 w-8 text-[#0d9488] mb-3" /><h3 className="font-bold text-slate-900">Verified Suppliers</h3><p className="text-sm text-slate-500 mt-1">100% PPB Licensed</p></div>
                    <div className="bg-white/50 backdrop-blur p-4 rounded-xl border border-slate-100 shadow-sm"><Building2 className="h-8 w-8 text-[#0d9488] mb-3" /><h3 className="font-bold text-slate-900">Wholesale Prices</h3><p className="text-sm text-slate-500 mt-1">Direct from source</p></div>
                    <div className="bg-white/50 backdrop-blur p-4 rounded-xl border border-slate-100 shadow-sm"><CheckCircle className="h-8 w-8 text-[#0d9488] mb-3" /><h3 className="font-bold text-slate-900">KRA Compliant</h3><p className="text-sm text-slate-500 mt-1">ETIMS Invoicing</p></div>
                    <div className="bg-white/50 backdrop-blur p-4 rounded-xl border border-slate-100 shadow-sm"><Truck className="h-8 w-8 text-[#0d9488] mb-3" /><h3 className="font-bold text-slate-900">Fast Delivery</h3><p className="text-sm text-slate-500 mt-1">Nationwide logistics</p></div>
                </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-12">
                  <div><h2 className="text-3xl font-bold text-slate-900 tracking-tight">Popular Categories</h2><p className="mt-2 text-slate-500 text-lg">Essential supplies for your facility.</p></div>
                  <Link href="/marketplace" className="text-[#0d9488] font-semibold hover:text-[#0f766e] flex items-center">View Marketplace <TrendingUp className="h-4 w-4 ml-1" /></Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[{ name: 'Antibiotics', count: '320+ Products', color: 'bg-blue-50 text-blue-600' }, { name: 'Pain Relief', count: '150+ Products', color: 'bg-red-50 text-red-600' }, { name: 'Surgicals', count: '500+ Products', color: 'bg-teal-50 text-teal-600' }, { name: 'Diabetes Care', count: '80+ Products', color: 'bg-orange-50 text-orange-600' }].map((cat, idx) => (
                      <Link href="/marketplace" key={idx} className="group bg-white p-8 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer">
                          <div className={`h-16 w-16 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><span className="font-bold text-2xl">{cat.name[0]}</span></div>
                          <h3 className="font-bold text-slate-900 text-xl group-hover:text-[#0d9488] transition-colors">{cat.name}</h3>
                          <p className="text-sm text-slate-400 mt-2 font-medium">{cat.count}</p>
                      </Link>
                  ))}
              </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-12">
                  <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Featured Supplies</h2>
                      <p className="mt-2 text-slate-500 text-lg">Top-rated pharmaceuticals available for immediate dispatch.</p>
                  </div>
                  <Link href="/marketplace" className="text-[#0d9488] font-semibold hover:text-[#0f766e] flex items-center transition-colors">
                      View All Products <TrendingUp className="h-4 w-4 ml-1" />
                  </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featuredProducts.map((product) => (
                      <div
                          key={product.id}
                          className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                          onClick={() => router.visit(`/product/${product.id}`)}
                      >
                          {/* Image */}
                          <div className="relative aspect-[4/3] bg-slate-50 p-6 flex items-center justify-center overflow-hidden border-b border-slate-50">
                              <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                              />
                              {product.verified && (
                                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center shadow-sm border border-emerald-100">
                                      <ShieldCheck className="h-3 w-3 mr-1" fill="currentColor" /> Verified
                                  </div>
                              )}
                              <button
                                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                  className="absolute bottom-3 right-3 bg-white text-slate-900 p-2.5 rounded-full shadow-lg hover:bg-[#0d9488] hover:text-white transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 border border-slate-100"
                              >
                                  <Plus className="h-5 w-5" />
                              </button>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-bold tracking-wider text-[#0d9488] uppercase bg-teal-50 px-2 py-0.5 rounded-sm">
                                      {product.category}
                                  </span>
                                  <div className="flex items-center text-amber-400">
                                      <Star className="h-3.5 w-3.5 fill-current" />
                                      <span className="text-xs font-medium text-slate-500 ml-1">{product.rating}</span>
                                  </div>
                              </div>

                              <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-[#0d9488] transition-colors">
                                  {product.name}
                              </h3>
                              <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                                  By <span className="font-medium text-slate-700">{product.supplier}</span>
                              </p>

                              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                  <p className="text-lg font-bold text-slate-900">KES {product.price.toLocaleString()}</p>
                                  {product.stock < 100 && (
                                      <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
                                          Low Stock
                                      </span>
                                  )}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        </div>

      </div>

      {/* Modals & Chat */}
      <Footer />
      <AIChatBot />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={handleRemoveFromCart} onUpdateQty={handleUpdateQty} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={() => { setIsLoggedIn(true); setIsAuthOpen(false); }} />
    </div>
  );
}
