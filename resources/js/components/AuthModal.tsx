import React, { useState } from 'react';
import { X, Upload, Building2 } from 'lucide-react';
import { KENYA_COUNTIES } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'PHARMACY' | 'HOSPITAL'>('PHARMACY');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
            <div className="absolute top-0 right-0 pt-4 pr-4">
                <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                    <X className="h-6 w-6" />
                </button>
            </div>
            
            <div className="flex flex-col md:flex-row h-full">
                {/* Left Side: Brand */}
                <div className="hidden md:flex md:w-5/12 bg-primary-600 p-8 flex-col justify-between text-white">
                    <div>
                        <Building2 className="h-10 w-10 mb-4 text-primary-200" />
                        <h3 className="text-2xl font-bold mb-2">Join MediConnect</h3>
                        <p className="text-primary-100 text-sm">
                            Access Kenya's largest network of verified pharmaceutical suppliers.
                        </p>
                    </div>
                    <div className="space-y-4 text-xs text-primary-200">
                        <div className="flex items-center"><div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>Bulk Pricing</div>
                        <div className="flex items-center"><div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>Next Day Delivery</div>
                        <div className="flex items-center"><div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>Credit Facilities</div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-7/12 p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {isLogin ? 'Welcome back, please enter your details.' : 'Verification required for new accounts.'}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        {!isLogin && (
                           <>
                             <div className="grid grid-cols-2 gap-4 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setUserType('PHARMACY')}
                                    className={`py-2 px-4 text-sm font-medium rounded-md text-center border ${userType === 'PHARMACY' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Pharmacy
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType('HOSPITAL')}
                                    className={`py-2 px-4 text-sm font-medium rounded-md text-center border ${userType === 'HOSPITAL' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Hospital
                                </button>
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Business Name</label>
                                <input type="text" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" placeholder="e.g. City Health Pharmacy" required />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">KRA PIN</label>
                                    <input type="text" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" placeholder="P05..." required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">County</label>
                                    <select className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
                                        {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">PPB License / Registration</label>
                                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-slate-400" />
                                        <div className="flex text-sm text-slate-600">
                                            <label className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
                                    </div>
                                </div>
                             </div>
                           </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" placeholder="admin@pharmacy.co.ke" required />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input type="password" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" placeholder="••••••••" required />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {isLogin ? 'Sign In' : 'Submit for Verification'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            {isLogin ? "Don't have an account?" : "Already verified?"}{' '}
                            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary-600 hover:text-primary-500">
                                {isLogin ? 'Register Now' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};