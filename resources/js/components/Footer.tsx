import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center">
               <div className="bg-slate-800 p-2 rounded-lg mr-2">
                  <ShieldCheck className="h-6 w-6 text-white" />
               </div>
               <span className="text-xl font-bold text-white tracking-tight">MediConnect<span className="text-primary-500">KE</span></span>
            </div>
            <p className="text-sm text-slate-400">
              Connecting Kenya's healthcare providers with trusted pharmaceutical suppliers. Seamless, compliant, and efficient.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400">Marketplace</a></li>
              <li><a href="#" className="hover:text-primary-400">List as Supplier</a></li>
              <li><a href="#" className="hover:text-primary-400">Pharmacy Registration</a></li>
              <li><a href="#" className="hover:text-primary-400">PPB Compliance</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-400">Returns Policy</a></li>
              <li><a href="#" className="hover:text-primary-400">Dispute Resolution</a></li>
              <li><a href="#" className="hover:text-primary-400">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary-500" />
                +254 700 123 456
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary-500" />
                support@mediconnect.co.ke
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                Westlands, Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center text-slate-500">
          &copy; {new Date().getFullYear()} MediConnect Kenya. All rights reserved.
        </div>
      </div>
    </footer>
  );
};