
import React from 'react';
import { Head, Link,usePage } from '@inertiajs/react';
import { ArrowLeft, Shield, FileCheck, Truck, CheckCircle, Star, Building2, Package } from 'lucide-react';
import { Layout } from './Layout';
import { MOCK_PRODUCTS } from '../constants';

export default function ProductShow() {
  // In a real Inertia app, props would be passed from the controller.
  // For this static preview, we attempt to find the ID from the URL.
  const path = window.location.pathname;
  const id = path.split('/').pop();
//   const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
interface Supplier {
  name: string;
  organization_name: string;
  contact_email: string;
}

interface ProductData {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  supplier: Supplier;
  rating: number;
  verified: boolean;
}

interface PageProps {
  product: ProductData;
  auth?: {
    user?: any;
  };
}
const { product ,auth } = usePage<PageProps>().props;
  const addToCart = () => {
    window.dispatchEvent(new CustomEvent('add-to-cart', { detail: product }));
  };

  return (
    <Layout>
      <Head title={product.name} />
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/marketplace" className="group flex items-center text-slate-500 hover:text-[#0d9488] mb-6 transition-colors font-medium">
            <div className="bg-white p-2 rounded-full shadow-sm mr-2 group-hover:shadow-md transition-all border border-slate-200"><ArrowLeft className="h-4 w-4" /></div>
            Back to Marketplace
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
                      {product.verified && <div className="absolute top-6 left-6 z-10 flex flex-col gap-2"><div className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg w-fit"><Shield className="h-3 w-3 mr-1.5" fill="currentColor" /> PPB Verified</div></div>}
                      <div className="aspect-[4/3] w-full bg-slate-50 p-12 flex items-center justify-center"><img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-700" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h3 className="font-semibold text-slate-900 mb-2 flex items-center"><FileCheck className="h-5 w-5 text-[#0d9488] mr-2" /> Documentation</h3><ul className="text-sm text-slate-500 space-y-2"><li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-green-500" /> Certificate of Analysis</li><li className="flex items-center"><CheckCircle className="h-3 w-3 mr-2 text-green-500" /> Import License</li></ul></div>
                       <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><h3 className="font-semibold text-slate-900 mb-2 flex items-center"><Truck className="h-5 w-5 text-[#0d9488] mr-2" /> Logistics</h3><p className="text-sm text-slate-500">Ships from Nairobi. Cold chain storage available for sensitive items. Dispatch within 24 hours.</p></div>
                  </div>
              </div>
              <div className="lg:col-span-5">
                  <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sticky top-24">
                      <div className="flex items-center space-x-2 mb-4"><span className="bg-teal-50 text-[#0d9488] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-teal-100">{product.category}</span><div className="flex items-center text-amber-400 text-sm font-medium"><Star className="h-4 w-4 fill-current mr-1" />{product.rating}</div></div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">{product.name}</h1>
                      <div className="flex items-center text-slate-500 text-sm mb-6"><span>Pack Size: 1 Box</span><span className="mx-2">•</span><span>Generic Name: {product.name.split(' ')[0]}</span></div>
                      <div className="mb-8"><p className="text-sm text-slate-500 font-medium mb-1">Wholesale Price (VAT Inclusive)</p><div className="flex items-baseline"><span className="text-4xl font-bold text-slate-900 tracking-tight">KES {product.price.toLocaleString()}</span></div></div>
                      <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100"><div className="flex items-start"><div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"><Building2 className="h-6 w-6" /></div><div className="ml-3 flex-1"><div className="flex justify-between items-start"><div><p className="text-sm font-bold text-slate-900">{product.name}</p><p className="text-xs text-slate-500">Licensed Distributor • Nairobi</p></div><div className="flex flex-col items-end"><span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium mb-1 border border-green-200">KRA Compliant</span></div></div></div></div></div>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm"><div className="flex items-center text-slate-700"><Package className="h-4 w-4 mr-2" /> Stock Status</div><span className={product.stock > 100 ? "text-emerald-600 font-bold" : "text-amber-500 font-bold"}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></div>
                          <button onClick={addToCart} className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white text-lg font-semibold py-4 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center">Add to Purchase Order</button>
                          <p className="text-xs text-center text-slate-400 mt-4">By placing this order, you confirm that your facility is licensed to handle this pharmaceutical product.</p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="mt-12 max-w-4xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Product Description</h2>
              <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 leading-relaxed">{product.description}</p>
                  <p className="text-slate-600 mt-4">Suitable for hospital and pharmacy dispensing. Ensure proper storage conditions as indicated on the packaging. This product is sourced directly from the manufacturer or authorized primary distributor.</p>
              </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
