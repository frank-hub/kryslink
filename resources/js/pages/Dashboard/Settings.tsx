import React, { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { DashboardLayout } from './layout';
import {route } from 'ziggy-js';
import {
  User, Mail, Phone, Building2, MapPin, Lock,
  ShieldCheck, FileText, Stethoscope, Landmark,
  CheckCircle2, XCircle, Save, Eye, EyeOff,
  AlertCircle, ChevronRight
} from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  organization_name: string | null;
  organization_type: string;
  county: string | null;
  location: string | null;
  kra_pin: string | null;
  pharmacy_license: string | null;
  ppb_license: string | null;
  is_verified: boolean;
}

interface PageProps {
  user: UserData;
  flash: { success?: string };
}

type Tab = 'profile' | 'compliance' | 'security';

const KENYA_COUNTIES = [
  'Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa',
  'Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi',
  'Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos',
  'Makueni','Mandera','Marsabit','Meru','Migori','Mombasa','Murang\'a',
  'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri',
  'Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia',
  'Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot',
];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900
        placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]
        disabled:bg-slate-50 disabled:text-slate-400 transition-colors ${className}`}
    />
  );
}

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'profile',    label: 'Profile',    Icon: User       },
  { id: 'compliance', label: 'Compliance', Icon: ShieldCheck },
  { id: 'security',   label: 'Security',   Icon: Lock       },
];

export default function Settings() {
  const { user, flash } = usePage<PageProps>().props;
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Profile form
  const profileForm = useForm({
    name:              user.name              ?? '',
    email:             user.email             ?? '',
    phone:             user.phone             ?? '',
    organization_name: user.organization_name ?? '',
    county:            user.county            ?? '',
    location:          user.location          ?? '',
  });

  // Compliance form
  const complianceForm = useForm({
    kra_pin:          user.kra_pin          ?? '',
    pharmacy_license: user.pharmacy_license ?? '',
    ppb_license:      user.ppb_license      ?? '',
  });

  // Password form
  const passwordForm = useForm({
    current_password:      '',
    password:              '',
    password_confirmation: '',
  });

  const submitProfile = () => {
    profileForm.put(route('settings.update'));
  };

  const submitCompliance = () => {
    complianceForm.put(route('settings.update'));
  };

  const submitPassword = () => {
    passwordForm.put(route('settings.password'), {
      onSuccess: () => passwordForm.reset(),
    });
  };

  const complianceChecks = [
    { label: 'Account Verified',  value: user.is_verified,       readonly: true  },
    { label: 'KRA PIN',           value: !!user.kra_pin,         readonly: false },
    { label: 'Pharmacy License',  value: !!user.pharmacy_license,readonly: false },
    { label: 'PPB License',       value: !!user.ppb_license,     readonly: false },
  ];
  const score = complianceChecks.filter(c => c.value).length;

  return (
    <DashboardLayout>
      <Head title="Settings" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile, compliance documents and security.</p>
      </div>

      {flash?.success && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          {flash.success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar */}
        <div className="space-y-3">

          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-50 border-4 border-white ring-2 ring-[#0d9488]/30 flex items-center justify-center text-2xl font-bold text-[#0d9488] mx-auto mb-3">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Compliance</span>
                <span className="font-semibold text-slate-700">{score}/4</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    score === 4 ? 'bg-emerald-500' : score >= 2 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${(score / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors border-b border-slate-100 last:border-0
                  ${activeTab === id
                    ? 'bg-teal-50 text-[#0d9488]'
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${activeTab === id ? 'rotate-90 text-[#0d9488]' : 'text-slate-300'}`} />
              </button>
            ))}
          </nav>
        </div>

        {/* Main panel */}
        <div className="lg:col-span-3">

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-500 mt-0.5">Update your name, contact details and location.</p>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name" error={profileForm.errors.name}>
                    <Input
                      value={profileForm.data.name}
                      onChange={e => profileForm.setData('name', e.target.value)}
                      placeholder="Your full name"
                    />
                  </Field>
                  <Field label="Email Address" error={profileForm.errors.email}>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="email"
                        value={profileForm.data.email}
                        onChange={e => profileForm.setData('email', e.target.value)}
                        placeholder="you@example.com"
                        className="pl-9"
                      />
                    </div>
                  </Field>
                  <Field label="Phone Number" error={profileForm.errors.phone}>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={profileForm.data.phone}
                        onChange={e => profileForm.setData('phone', e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="pl-9"
                      />
                    </div>
                  </Field>
                  <Field label="Organisation Name" error={profileForm.errors.organization_name}>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={profileForm.data.organization_name}
                        onChange={e => profileForm.setData('organization_name', e.target.value)}
                        placeholder="Your organisation"
                        className="pl-9"
                      />
                    </div>
                  </Field>
                  <Field label="County" error={profileForm.errors.county}>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                      <select
                        value={profileForm.data.county}
                        onChange={e => profileForm.setData('county', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900
                          focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-colors appearance-none"
                      >
                        <option value="">Select county</option>
                        {KENYA_COUNTIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </Field>
                  <Field label="Location / Street" error={profileForm.errors.location}>
                    <Input
                      value={profileForm.data.location}
                      onChange={e => profileForm.setData('location', e.target.value)}
                      placeholder="Street or area"
                    />
                  </Field>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex justify-end">
                <button
                  onClick={submitProfile}
                  disabled={profileForm.processing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-xl shadow-sm shadow-teal-500/20 transition-colors disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {profileForm.processing ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* ── COMPLIANCE TAB ── */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">

              {/* Status summary */}
              <div className={`rounded-2xl border p-5 flex items-center gap-4 ${
                score === 4 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <ShieldCheck className={`h-8 w-8 flex-shrink-0 ${score === 4 ? 'text-emerald-500' : 'text-amber-500'}`} />
                <div>
                  <p className={`font-semibold ${score === 4 ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {score === 4 ? 'Fully compliant — all checks passed!' : `${4 - score} item${4 - score > 1 ? 's' : ''} still pending`}
                  </p>
                  <p className={`text-sm mt-0.5 ${score === 4 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    Complete all fields below to reach full compliance.
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <span className={`text-2xl font-bold ${score === 4 ? 'text-emerald-700' : 'text-amber-700'}`}>{score}/4</span>
                </div>
              </div>

              {/* Verification status (read-only) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.is_verified ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
                    <ShieldCheck className={`h-5 w-5 ${user.is_verified ? 'text-emerald-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Account Verification</p>
                    <p className="text-xs text-slate-500">Reviewed and approved by MediConnect admin.</p>
                  </div>
                </div>
                {user.is_verified ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                    <AlertCircle className="h-3 w-3" /> Pending Review
                  </span>
                )}
              </div>

              {/* Editable compliance fields */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-900">Regulatory Documents</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Enter your license and tax identification numbers.</p>
                </div>

                <div className="p-6 space-y-5">
                  <Field label="KRA PIN" error={complianceForm.errors.kra_pin}>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={complianceForm.data.kra_pin}
                        onChange={e => complianceForm.setData('kra_pin', e.target.value)}
                        placeholder="e.g. P051234567A"
                        className="pl-9"
                      />
                    </div>
                    {user.kra_pin && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Currently on file: <span className="font-mono">{user.kra_pin}</span>
                      </p>
                    )}
                  </Field>

                  <Field label="Pharmacy License Number" error={complianceForm.errors.pharmacy_license}>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={complianceForm.data.pharmacy_license}
                        onChange={e => complianceForm.setData('pharmacy_license', e.target.value)}
                        placeholder="Pharmacy operating license number"
                        className="pl-9"
                      />
                    </div>
                    {user.pharmacy_license && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Currently on file: <span className="font-mono">{user.pharmacy_license}</span>
                      </p>
                    )}
                  </Field>

                  <Field label="PPB License Number" error={complianceForm.errors.ppb_license}>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={complianceForm.data.ppb_license}
                        onChange={e => complianceForm.setData('ppb_license', e.target.value)}
                        placeholder="Pharmacy & Poisons Board certificate number"
                        className="pl-9"
                      />
                    </div>
                    {user.ppb_license && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Currently on file: <span className="font-mono">{user.ppb_license}</span>
                      </p>
                    )}
                  </Field>
                </div>

                <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={submitCompliance}
                    disabled={complianceForm.processing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-xl shadow-sm shadow-teal-500/20 transition-colors disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {complianceForm.processing ? 'Saving…' : 'Save Documents'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Change Password</h2>
                <p className="text-sm text-slate-500 mt-0.5">Use a strong password of at least 8 characters.</p>
              </div>

              <div className="p-6 space-y-5 max-w-md">
                <Field label="Current Password" error={passwordForm.errors.current_password}>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type={showCurrent ? 'text' : 'password'}
                      value={passwordForm.data.current_password}
                      onChange={e => passwordForm.setData('current_password', e.target.value)}
                      placeholder="Current password"
                      className="pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                <Field label="New Password" error={passwordForm.errors.password}>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type={showNew ? 'text' : 'password'}
                      value={passwordForm.data.password}
                      onChange={e => passwordForm.setData('password', e.target.value)}
                      placeholder="New password"
                      className="pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                <Field label="Confirm New Password" error={passwordForm.errors.password_confirmation}>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      value={passwordForm.data.password_confirmation}
                      onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                      placeholder="Confirm new password"
                      className="pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
              </div>

              <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex justify-end">
                <button
                  onClick={submitPassword}
                  disabled={passwordForm.processing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-semibold rounded-xl shadow-sm shadow-teal-500/20 transition-colors disabled:opacity-60"
                >
                  <Lock className="h-4 w-4" />
                  {passwordForm.processing ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
