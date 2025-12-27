
import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { DashboardLayout } from './layout';
import {
  Search, Filter, ShieldCheck, MapPin, Star,
  ExternalLink, Building2, Phone, Mail, ChevronRight,
  BadgeCheck, Info, Globe, ArrowUpRight
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  kraCompliant: boolean;
  specialties: string[];
  description: string;
  joinedDate: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 's1',
    name: 'Davita Pharma Ltd',
    location: 'Industrial Area, Nairobi',
    rating: 4.9,
    reviewCount: 124,
    verified: true,
    kraCompliant: true,
    specialties: ['Antibiotics', 'Vaccines', 'Pediatric'],
    description: 'Premier distributor of globally recognized pharmaceutical brands in East Africa.',
    joinedDate: '2018'
  },
  {
    id: 's2',
    name: 'Nairobi Medical Supplies',
    location: 'Westlands, Nairobi',
    rating: 4.7,
    reviewCount: 89,
    verified: true,
    kraCompliant: true,
    specialties: ['Surgicals', 'Emergency Care', 'Orthopedic'],
    description: 'Leading provider of surgical equipment and emergency medical supplies.',
    joinedDate: '2020'
  },
  {
    id: 's3',
    name: 'MedPlus Kenya',
    location: 'Nyali, Mombasa',
    rating: 4.8,
    reviewCount: 56,
    verified: true,
    kraCompliant: true,
    specialties: ['Diabetes Care', 'Cardiology', 'Hypertension'],
    description: 'Specialized focus on chronic disease management medications and tools.',
    joinedDate: '2019'
  },
  {
    id: 's4',
    name: 'SafeHealth Distributors',
    location: 'CBD, Kisumu',
    rating: 4.5,
    reviewCount: 42,
    verified: true,
    kraCompliant: false,
    specialties: ['General Generics', 'OTC', 'Diagnostics'],
    description: 'Providing affordable generic alternatives and diagnostic kits nationwide.',
    joinedDate: '2021'
  },
  {
    id: 's5',
    name: 'HealthFirst Kenya',
    location: 'Eldoret',
    rating: 4.6,
    reviewCount: 31,
    verified: false,
    kraCompliant: true,
    specialties: ['Oncology', 'Rare Diseases'],
    description: 'Dedicated to specialized medicine and oncology treatment solutions.',
    joinedDate: '2022'
  }
];

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCounty, setFilterCounty] = useState('All Counties');

  const filteredSuppliers = useMemo(() => {
    return MOCK_SUPPLIERS.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCounty = filterCounty === 'All Counties' || s.location.includes(filterCounty);
      return matchesSearch && matchesCounty;
    });
  }, [searchQuery, filterCounty]);

  return (
    <DashboardLayout>
      <Head title="Verified Suppliers" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Suppliers</h1>
          <p className="text-slate-500">Connect with licensed distributors and manufacturers across Kenya.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center">
                <ShieldCheck className="h-4 w-4 text-emerald-600 mr-2" />
                <span className="text-xs font-bold text-emerald-700">100% PPB Vetted Network</span>
            </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, medicine type, or generic..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-[#0d9488]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="w-full md:w-48 bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 focus:ring-[#0d9488]"
            value={filterCounty}
            onChange={(e) => setFilterCounty(e.target.value)}
          >
            <option>All Counties</option>
            <option>Nairobi</option>
            <option>Mombasa</option>
            <option>Kisumu</option>
            <option>Eldoret</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="h-4 w-4 mr-2" /> More Filters
          </button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-[#0d9488] transition-colors">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0d9488] transition-colors flex items-center">
                      {supplier.name}
                      {supplier.verified && <BadgeCheck className="h-4 w-4 text-blue-500 ml-1.5" />}
                    </h3>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" /> {supplier.location}
                      <span className="mx-2">•</span>
                      <Star className="h-3 w-3 mr-1 text-amber-400 fill-current" /> {supplier.rating} ({supplier.reviewCount} reviews)
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   {supplier.kraCompliant && (
                     <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">KRA ETIMS</span>
                   )}
                   <span className="text-[10px] font-bold text-slate-400">Since {supplier.joinedDate}</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed italic">
                "{supplier.description}"
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {supplier.specialties.map(spec => (
                  <span key={spec} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase rounded-full border border-slate-100">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                 <div className="flex items-center gap-4">
                    <button className="text-slate-400 hover:text-[#0d9488] transition-colors"><Phone className="h-4 w-4" /></button>
                    <button className="text-slate-400 hover:text-[#0d9488] transition-colors"><Mail className="h-4 w-4" /></button>
                    <button className="text-slate-400 hover:text-[#0d9488] transition-colors"><Globe className="h-4 w-4" /></button>
                 </div>
                 <Link
                  href={`/marketplace?supplier=${supplier.id}`}
                  className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
                 >
                    View Catalog <ArrowUpRight className="h-4 w-4 ml-2" />
                 </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results State */}
      {filteredSuppliers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4 text-slate-300">
                <Search className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No suppliers found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterCounty('All Counties'); }}
              className="mt-6 text-[#0d9488] font-bold hover:underline"
            >
              Clear all filters
            </button>
        </div>
      )}

      {/* Featured Supplier Banner */}
      <div className="mt-12 p-8 bg-indigo-900 rounded-3xl relative overflow-hidden text-white shadow-xl shadow-indigo-900/20">
         <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-bold mb-4">Want to be a verified supplier?</h3>
            <p className="text-indigo-100 mb-8 leading-relaxed">
              Expand your reach to thousands of pharmacies and hospitals across Kenya. Our automated compliance engine makes B2B distribution simple and tax-compliant.
            </p>
            <button className="px-8 py-3 bg-white text-indigo-900 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-indigo-50 transition-colors">
              Apply to Sell
            </button>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl"></div>
      </div>
    </DashboardLayout>
  );
}
