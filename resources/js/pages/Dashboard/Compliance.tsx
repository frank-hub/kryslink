import React, { useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { DashboardLayout } from './layout';
import {
  ShieldCheck, ShieldAlert, ShieldX,
  CheckCircle2, XCircle, BadgeCheck,
  Building2, MapPin, Mail, User,
  FileText, Stethoscope, Landmark
} from 'lucide-react';

interface ComplianceUser {
  id: number;
  name: string;
  email: string;
  organization_name: string | null;
  organization_type: string;
  kra_pin: string | null;
  pharmacy_license: string | null;
  ppb_license: string | null;
  is_verified: boolean;
  county: string | null;
  created_at: string;
}

interface PageProps {
  user: ComplianceUser;
}

const MAX_SCORE = 4;

const CHECKS = [
  {
    key: 'is_verified' as const,
    label: 'Account Verified',
    description: 'Your account has been reviewed and approved by MediConnect.',
    Icon: BadgeCheck,
  },
  {
    key: 'kra_pin' as const,
    label: 'KRA PIN',
    description: 'Kenya Revenue Authority Personal Identification Number.',
    Icon: Landmark,
  },
  {
    key: 'pharmacy_license' as const,
    label: 'Pharmacy License',
    description: 'Valid pharmacy operating license issued by the relevant authority.',
    Icon: Stethoscope,
  },
  {
    key: 'ppb_license' as const,
    label: 'PPB License',
    description: 'Pharmacy and Poisons Board registration certificate.',
    Icon: FileText,
  },
];

export default function Compliance() {
  const { user } = usePage<PageProps>().props;

  const score = useMemo(() =>
    CHECKS.filter(c => !!user[c.key]).length,
    [user]
  );

  const pct = Math.round((score / MAX_SCORE) * 100);

  const { label, ringColor, barColor, badgeBg, badgeText, ShieldIcon } = useMemo(() => {
    if (score === MAX_SCORE) return {
      label: 'Fully Compliant',
      ringColor: 'ring-emerald-400',
      barColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 border-emerald-200',
      badgeText: 'text-emerald-700',
      ShieldIcon: ShieldCheck,
    };
    if (score >= 2) return {
      label: 'Partially Compliant',
      ringColor: 'ring-amber-400',
      barColor: 'bg-amber-400',
      badgeBg: 'bg-amber-50 border-amber-200',
      badgeText: 'text-amber-700',
      ShieldIcon: ShieldAlert,
    };
    return {
      label: 'Non-Compliant',
      ringColor: 'ring-red-400',
      barColor: 'bg-red-400',
      badgeBg: 'bg-red-50 border-red-200',
      badgeText: 'text-red-700',
      ShieldIcon: ShieldX,
    };
  }, [score]);

  return (
    <DashboardLayout>
      <Head title="My Compliance" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Compliance Status</h1>
        <p className="text-slate-500 mt-1">Your regulatory and verification compliance overview.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — Profile + Score */}
        <div className="space-y-6">

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full bg-teal-50 border-4 ${ringColor} ring-4 ring-offset-2 flex items-center justify-center text-2xl font-bold text-[#0d9488] mb-4`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>

              <span className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg} ${badgeText}`}>
                <ShieldIcon className="h-3.5 w-3.5" />
                {label}
              </span>
            </div>

            <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
              {user.organization_name && (
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  {user.organization_name}
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
                {user.organization_type}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                {user.email}
              </div>
              {user.county && (
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  {user.county}
                </div>
              )}
            </div>
          </div>

          {/* Score card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Compliance Score</p>

            {/* Circular score */}
            <div className="flex items-center justify-center mb-5">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={score === MAX_SCORE ? '#10b981' : score >= 2 ? '#f59e0b' : '#f87171'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${badgeText}`}>{score}</span>
                  <span className="text-xs text-slate-400">of {MAX_SCORE}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              {CHECKS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  {user[key] ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Check Items */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Requirements</p>

          {CHECKS.map(({ key, label, description, Icon }) => {
            const passed = !!user[key];
            const value  = user[key];

            return (
              <div
                key={key}
                className={`bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-4 transition-all ${
                  passed ? 'border-slate-200' : 'border-red-100 bg-red-50/30'
                }`}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  passed ? 'bg-teal-50 border border-teal-100' : 'bg-red-50 border border-red-100'
                }`}>
                  <Icon className={`h-5 w-5 ${passed ? 'text-[#0d9488]' : 'text-red-400'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{label}</p>
                    {passed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200 flex-shrink-0">
                        <XCircle className="h-3 w-3" /> Missing
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{description}</p>
                  {passed && typeof value === 'string' && (
                    <p className="mt-2 text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg inline-block">
                      {value}
                    </p>
                  )}
                  {!passed && (
                    <p className="mt-2 text-xs text-red-500 font-medium">
                      ⚠ Please update your profile to add this information.
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Overall banner */}
          <div className={`rounded-2xl border p-5 flex items-center gap-4 mt-2 ${
            score === MAX_SCORE
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <ShieldIcon className={`h-8 w-8 flex-shrink-0 ${score === MAX_SCORE ? 'text-emerald-500' : 'text-amber-500'}`} />
            <div>
              <p className={`font-semibold ${score === MAX_SCORE ? 'text-emerald-800' : 'text-amber-800'}`}>
                {score === MAX_SCORE
                  ? 'You are fully compliant — great work!'
                  : `${MAX_SCORE - score} requirement${MAX_SCORE - score > 1 ? 's' : ''} still pending`}
              </p>
              <p className={`text-sm mt-0.5 ${score === MAX_SCORE ? 'text-emerald-600' : 'text-amber-600'}`}>
                {score === MAX_SCORE
                  ? 'All your regulatory and verification checks have passed.'
                  : 'Complete the missing items above to reach full compliance.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
