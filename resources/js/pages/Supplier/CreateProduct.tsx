
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  ArrowLeft, Upload, Info, DollarSign, Package,
  FileText, Image as ImageIcon, Save, X
} from 'lucide-react';

export default function CreateProduct() {
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Create a fake local URL for preview
      const url = URL.createObjectURL(e.target.files[0]);
      setImages([...images, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <SupplierLayout>
      <Head title="Add New Product" />

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
                <Link href="/supplier/products" className="mr-4 p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
                    <p className="text-slate-500">Create a new listing for your pharmaceutical inventory.</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                    Save as Draft
                </button>
                <button className="px-6 py-2 bg-[#0d9488] text-white rounded-lg font-bold hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all flex items-center">
                    <Save className="h-4 w-4 mr-2" /> Publish Product
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Form Area */}
            <div className="lg:col-span-2 space-y-8">

                {/* 1. Basic Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Info className="h-5 w-5 text-slate-400 mr-2" /> Basic Information
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                            <input type="text" className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" placeholder="e.g. Amoxicillin 500mg Capsules" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Generic Name</label>
                                <input type="text" className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" placeholder="e.g. Amoxicillin" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm">
                                    <option>Antibiotics</option>
                                    <option>Pain Relief</option>
                                    <option>Cardiovascular</option>
                                    <option>Respiratory</option>
                                    <option>Supplements</option>
                                    <option>Medical Devices</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea rows={4} className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" placeholder="Describe the product, dosage form, and packaging details..."></textarea>
                        </div>
                    </div>
                </div>

                {/* 2. Media */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <ImageIcon className="h-5 w-5 text-slate-400 mr-2" /> Product Images
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        <label className="border-2 border-dashed border-slate-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#0d9488] hover:bg-teal-50 transition-colors">
                            <Upload className="h-6 w-6 text-slate-400 mb-2" />
                            <span className="text-xs text-slate-500 font-medium">Upload Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                    <p className="text-xs text-slate-500">
                        Upload high-quality images. First image will be the cover. Max 5MB per image.
                    </p>
                </div>

                {/* 3. Inventory & Logistics */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Package className="h-5 w-5 text-slate-400 mr-2" /> Inventory & Logistics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                            <input type="text" className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" placeholder="SKU-12345" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                            <input type="number" className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Alert</label>
                            <input type="number" className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" placeholder="10" />
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center mb-4">
                            <input id="prescription" type="checkbox" className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-slate-300 rounded" />
                            <label htmlFor="prescription" className="ml-2 block text-sm text-slate-700">
                                Prescription Required (POM)
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input id="coldchain" type="checkbox" className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-slate-300 rounded" />
                            <label htmlFor="coldchain" className="ml-2 block text-sm text-slate-700">
                                Requires Cold Chain Storage (2°C - 8°C)
                            </label>
                        </div>
                    </div>
                </div>

            </div>

            {/* Sidebar Settings */}
            <div className="space-y-8">

                {/* Pricing */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <DollarSign className="h-5 w-5 text-slate-400 mr-2" /> Pricing
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price (KES)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-slate-500 sm:text-sm">KES</span>
                                </div>
                                <input type="number" className="block w-full rounded-lg border-slate-300 pl-12 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" placeholder="0.00" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bulk Price (Optional)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-slate-500 sm:text-sm">KES</span>
                                </div>
                                <input type="number" className="block w-full rounded-lg border-slate-300 pl-12 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" placeholder="0.00" />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Applied when purchasing 10+ units.</p>
                        </div>
                    </div>
                </div>

                {/* Organization */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <FileText className="h-5 w-5 text-slate-400 mr-2" /> Organization
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm">
                                <option>Draft</option>
                                <option>Active</option>
                                <option>Archived</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Batch Number</label>
                            <input type="text" className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                            <input type="date" className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm" />
                        </div>
                    </div>
                </div>

            </div>

        </div>
      </div>
    </SupplierLayout>
  );
}
