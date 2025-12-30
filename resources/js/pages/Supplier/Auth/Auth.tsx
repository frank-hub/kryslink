import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  ShieldCheck, ArrowRight, Building2, Mail, Lock,
  Phone, User, FileCheck, CheckCircle2, Globe,
  ArrowLeft, BadgeCheck, Activity
} from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  company_name: string;
  kra_pin: string;
  ppb_license: string;
  contact_person: string;
  email: string;
  password: string;
}

export default function SupplierAuth() {
  const [isLogin, setIsLogin] = useState(true);

  // Login form
  const loginForm = useForm<LoginForm>({
    email: '',
    password: '',
  });

  // Register form
  const registerForm = useForm<RegisterForm>({
    company_name: '',
    kra_pin: '',
    ppb_license: '',
    contact_person: '',
    email: '',
    password: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginForm.post('/supplier/login', {
      onSuccess: () => {
        // Redirect will be handled by Laravel
      },
      onError: (errors) => {
        console.error('Login errors:', errors);
      }
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerForm.post('/supplier/register', {
      onSuccess: () => {
        // Redirect will be handled by Laravel
      },
      onError: (errors) => {
        console.error('Registration errors:', errors);
      }
    });
  };

  const currentForm = isLogin ? loginForm : registerForm;

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <Head title={isLogin ? "Supplier Login" : "Supplier Onboarding"} />

      {/* Left Column: Branding & Features (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0d9488] relative overflow-hidden flex-col justify-between p-16 text-white">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full -ml-32 -mb-32 blur-2xl"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-3 mb-20 group">
             <div className="bg-white p-2 rounded-xl transition-transform group-hover:scale-110">
                <ShieldCheck className="h-8 w-8 text-[#0d9488]" />
             </div>
             <span className="text-2xl font-bold tracking-tight">KrysLink<span className="text-teal-200">Supplier</span></span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-5xl font-black mb-6 leading-tight">
              Powering Kenya's <br />
              <span className="text-teal-200">Medical Supply Chain.</span>
            </h1>
            <p className="text-lg text-teal-50 mb-12 leading-relaxed">
              Join the largest B2B network connecting verified suppliers with thousands of pharmacies and hospitals nationwide.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="p-2 bg-white/10 rounded-lg mr-4"><FileCheck className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-bold text-lg">ETIMS Integrated</h3>
                  <p className="text-teal-100/70 text-sm">Automated tax compliance with direct KRA synchronization for all sales.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-white/10 rounded-lg mr-4"><Activity className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-bold text-lg">Real-time Analytics</h3>
                  <p className="text-teal-100/70 text-sm">Track inventory demand and sales growth across all 47 counties.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-white/10 rounded-lg mr-4"><BadgeCheck className="h-6 w-6" /></div>
                <div>
                  <h3 className="font-bold text-lg">PPB Vetted Access</h3>
                  <p className="text-teal-100/70 text-sm">Exclusively for licensed pharmaceutical manufacturers and distributors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-teal-100/60">
           &copy; {new Date().getFullYear()} KrysLink Kenya. Regulatory Compliance Guaranteed.
        </div>
      </div>

      {/* Right Column: Auth Forms */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-slate-500 hover:text-[#0d9488] mb-12 transition-colors text-sm font-medium">
             <ArrowLeft className="h-4 w-4 mr-2" /> Back to Marketplace
          </Link>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {isLogin ? "Welcome Back" : "Supplier Registration"}
            </h2>
            <p className="text-slate-500">
              {isLogin
                ? "Access your supplier dashboard and manage orders."
                : "Fill in your business details to start selling on the platform."}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8">
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Information</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="Company Name (e.g. Davita Pharma)"
                        value={registerForm.data.company_name}
                        onChange={e => registerForm.setData('company_name', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
                      />
                      {registerForm.errors.company_name && (
                        <p className="text-red-500 text-xs mt-1">{registerForm.errors.company_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="KRA PIN"
                        value={registerForm.data.kra_pin}
                        onChange={e => registerForm.setData('kra_pin', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                      />
                      {registerForm.errors.kra_pin && (
                        <p className="text-red-500 text-xs mt-1">{registerForm.errors.kra_pin}</p>
                      )}
                    </div>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="PPB License #"
                        value={registerForm.data.ppb_license}
                        onChange={e => registerForm.setData('ppb_license', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                      />
                      {registerForm.errors.ppb_license && (
                        <p className="text-red-500 text-xs mt-1">{registerForm.errors.ppb_license}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Details</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="Contact Person Full Name"
                        value={registerForm.data.contact_person}
                        onChange={e => registerForm.setData('contact_person', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                      />
                      {registerForm.errors.contact_person && (
                        <p className="text-red-500 text-xs mt-1">{registerForm.errors.contact_person}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                {isLogin && <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Login Credentials</label>}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    value={isLogin ? loginForm.data.email : registerForm.data.email}
                    onChange={e => isLogin
                      ? loginForm.setData('email', e.target.value)
                      : registerForm.setData('email', e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                  />
                  {currentForm.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{currentForm.errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="password"
                    placeholder="Password"
                    value={isLogin ? loginForm.data.password : registerForm.data.password}
                    onChange={e => isLogin
                      ? loginForm.setData('password', e.target.value)
                      : registerForm.setData('password', e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                  />
                  {currentForm.errors.password && (
                    <p className="text-red-500 text-xs mt-1">{currentForm.errors.password}</p>
                  )}
                </div>
                {isLogin && (
                  <div className="text-right">
                    <button type="button" className="text-xs font-bold text-[#0d9488] hover:underline">Forgot password?</button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={currentForm.processing}
                className="w-full py-4 bg-[#0d9488] text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:bg-[#0f766e] transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70"
              >
                {currentForm.processing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    {isLogin ? "Sign In to Portal" : "Join the Network"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                {isLogin ? "New to KrysLink?" : "Already have a business account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold text-[#0d9488] hover:underline"
                >
                  {isLogin ? "Register your Company" : "Log In"}
                </button>
              </p>
            </div>
          </div>

          {!isLogin && (
            <div className="mt-8 flex items-center justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center space-x-1">
                   <ShieldCheck className="h-4 w-4" />
                   <span className="text-[10px] font-bold uppercase">PPB Verified</span>
                </div>
                <div className="flex items-center space-x-1">
                   <FileCheck className="h-4 w-4" />
                   <span className="text-[10px] font-bold uppercase">KRA ETIMS</span>
                </div>
                <div className="flex items-center space-x-1">
                   <Globe className="h-4 w-4" />
                   <span className="text-[10px] font-bold uppercase">Secure SSL</span>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
