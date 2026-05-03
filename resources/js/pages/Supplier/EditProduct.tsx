import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  ArrowLeft, Upload, Info, DollarSign, Package,
  FileText, Image as ImageIcon, Save, X, AlertCircle, Trash2
} from 'lucide-react';
import { route } from 'ziggy-js';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ExistingDocument {
  name: string;
  path: string;
}

interface Product {
  id: number;
  name: string;
  category_id: number;
  generic_name: string | null;
  description: string;
  price: number;
  cost_price: number | null;
  stock: number;
  low_stock_threshold: number;
  pack_size: string | null;
  dosage: string | null;
  form: string | null;
  manufacturer: string | null;
  country_of_origin: string | null;
  batch_number: string | null;
  expiry_date: string | null;
  requires_prescription: boolean;
  requires_cold_chain: boolean;
  status: 'draft' | 'active' | 'discontinued';
  images: string[];
  documents: ExistingDocument[];
}

interface Props {
  product: Product;
  categories: Category[];
}

export default function EditProduct({ product, categories }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    _method:               'PUT',
    name:                  product.name,
    category_id:           String(product.category_id),
    generic_name:          product.generic_name          ?? '',
    description:           product.description,
    price:                 String(product.price),
    cost_price:            product.cost_price            ? String(product.cost_price) : '',
    stock:                 String(product.stock),
    low_stock_threshold:   String(product.low_stock_threshold ?? 50),
    pack_size:             product.pack_size             ?? '',
    dosage:                product.dosage                ?? '',
    form:                  product.form                  ?? '',
    manufacturer:          product.manufacturer          ?? '',
    country_of_origin:     product.country_of_origin     ?? 'Kenya',
    batch_number:          product.batch_number          ?? '',
    expiry_date:           product.expiry_date           ?? '',
    requires_prescription: product.requires_prescription,
    requires_cold_chain:   product.requires_cold_chain,
    status:                product.status,
    images:                [] as File[],
    existing_images:       Array.isArray(product.images) ? product.images : [],
    documents:             [] as File[],
    existing_documents:    Array.isArray(product.documents) ? product.documents : [],
  });

  // New image previews (just uploaded)
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const totalImages = data.existing_images.length + data.images.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    if (totalImages + newFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    if (newFiles.some(f => f.size > 2 * 1024 * 1024)) {
      alert('Some images exceed 2MB limit');
      return;
    }

    setData('images', [...data.images, ...newFiles]);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setNewImagePreviews(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    const updated = [...data.existing_images];
    updated.splice(index, 1);
    setData('existing_images', updated);
  };

  const removeNewImage = (index: number) => {
    const updatedFiles = [...data.images];
    updatedFiles.splice(index, 1);
    setData('images', updatedFiles);

    const updatedPreviews = [...newImagePreviews];
    updatedPreviews.splice(index, 1);
    setNewImagePreviews(updatedPreviews);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const totalDocs = data.existing_documents.length + data.documents.length;

    if (totalDocs + newFiles.length > 5) {
      alert('Maximum 5 documents allowed');
      return;
    }
    if (newFiles.some(f => f.size > 5 * 1024 * 1024)) {
      alert('Some documents exceed 5MB limit');
      return;
    }

    setData('documents', [...data.documents, ...newFiles]);
  };

  const removeExistingDocument = (index: number) => {
    const updated = [...data.existing_documents];
    updated.splice(index, 1);
    setData('existing_documents', updated);
  };

  const removeNewDocument = (index: number) => {
    const updated = [...data.documents];
    updated.splice(index, 1);
    setData('documents', updated);
  };

  const handleSubmit = (e: React.FormEvent, status: 'draft' | 'active' | 'discontinued') => {
    e.preventDefault();
    setData('status', status);

    post(route('supplier.products.update', product.id), {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  return (
    <SupplierLayout>
      <Head title={`Edit — ${product.name}`} />

      <form onSubmit={(e) => handleSubmit(e, data.status)}>
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                href={route('supplier.products.index')}
                className="mr-4 p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
                <p className="text-slate-500 text-sm mt-0.5">Updating: <span className="font-medium text-slate-700">{product.name}</span></p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={processing}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'discontinued')}
                disabled={processing}
                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Discontinue
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-[#0d9488] text-white rounded-lg font-bold hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all flex items-center disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Please fix the following errors:</h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-0.5">
                    {Object.entries(errors).map(([key, value]) => (
                      <li key={key}>{value}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Basic Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-slate-400" /> Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      className={`w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${errors.name ? 'border-red-300' : ''}`}
                      placeholder="e.g. Amoxicillin 500mg Capsules"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Generic Name</label>
                      <input
                        type="text"
                        value={data.generic_name}
                        onChange={e => setData('generic_name', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                        placeholder="e.g. Amoxicillin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        className={`w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${errors.category_id ? 'border-red-300' : ''}`}
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={data.dosage}
                        onChange={e => setData('dosage', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                        placeholder="e.g. 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Form</label>
                      <input
                        type="text"
                        value={data.form}
                        onChange={e => setData('form', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                        placeholder="e.g. Tablets"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Pack Size</label>
                      <input
                        type="text"
                        value={data.pack_size}
                        onChange={e => setData('pack_size', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                        placeholder="e.g. 1 Box"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      className={`w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${errors.description ? 'border-red-300' : ''}`}
                      placeholder="Describe the product, usage, and packaging details..."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-slate-400" /> Product Images
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {/* Existing images */}
                  {data.existing_images.map((path, idx) => (
                    <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={`/storage/${path}`} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-1 left-1 bg-[#0d9488] text-white text-xs px-2 py-0.5 rounded">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}

                  {/* New image previews */}
                  {newImagePreviews.map((preview, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-teal-300 group">
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-teal-500 text-white text-xs px-2 py-0.5 rounded">
                        New
                      </div>
                    </div>
                  ))}

                  {/* Upload slot */}
                  {totalImages < 5 && (
                    <label className="border-2 border-dashed border-slate-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#0d9488] hover:bg-teal-50 transition-colors">
                      <Upload className="h-6 w-6 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-500 font-medium">Add Image</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {totalImages}/5 images. First image is the cover. New images are highlighted in teal.
                </p>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-400" /> Documents
                </h3>

                <div className="space-y-2 mb-4">
                  {/* Existing docs */}
                  {data.existing_documents.map((doc, idx) => (
                    <div key={`existing-doc-${idx}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{doc.name}</span>
                        <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Saved</span>
                      </div>
                      <button type="button" onClick={() => removeExistingDocument(idx)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* New docs */}
                  {data.documents.map((doc, idx) => (
                    <div key={`new-doc-${idx}`} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-200">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-teal-500" />
                        <span className="text-sm text-slate-700">{doc.name}</span>
                        <span className="text-xs text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">New</span>
                      </div>
                      <button type="button" onClick={() => removeNewDocument(idx)} className="text-red-400 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {(data.existing_documents.length + data.documents.length) < 5 && (
                  <label className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#0d9488] hover:bg-teal-50 transition-colors">
                    <Upload className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-700 font-medium">Upload Documents</span>
                    <span className="text-xs text-slate-500 mt-1">Certificate of Analysis, Import License, etc.</span>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" multiple onChange={handleDocumentUpload} />
                  </label>
                )}
                <p className="text-xs text-slate-500 mt-2">Max 5 documents, 5MB each.</p>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-slate-400" /> Inventory & Logistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={data.stock}
                      onChange={e => setData('stock', e.target.value)}
                      className={`w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${errors.stock ? 'border-red-300' : ''}`}
                      min="0"
                    />
                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Alert</label>
                    <input
                      type="number"
                      value={data.low_stock_threshold}
                      onChange={e => setData('low_stock_threshold', e.target.value)}
                      className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      id="prescription"
                      type="checkbox"
                      checked={data.requires_prescription}
                      onChange={e => setData('requires_prescription', e.target.checked)}
                      className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-slate-300 rounded"
                    />
                    <label htmlFor="prescription" className="text-sm text-slate-700">
                      Prescription Required (POM)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="coldchain"
                      type="checkbox"
                      checked={data.requires_cold_chain}
                      onChange={e => setData('requires_cold_chain', e.target.checked)}
                      className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-slate-300 rounded"
                    />
                    <label htmlFor="coldchain" className="text-sm text-slate-700">
                      Requires Cold Chain Storage (2°C - 8°C)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">

              {/* Status */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-slate-400" /> Status
                </h3>
                <div className="space-y-2">
                  {(['active', 'draft', 'discontinued'] as const).map(s => (
                    <label
                      key={s}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        data.status === s
                          ? s === 'active'       ? 'bg-emerald-50 border-emerald-200'
                          : s === 'discontinued' ? 'bg-red-50 border-red-200'
                          :                        'bg-slate-50 border-slate-300'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={data.status === s}
                        onChange={() => setData('status', s)}
                        className="text-[#0d9488] focus:ring-[#0d9488]"
                      />
                      <span className={`text-sm font-medium capitalize ${
                        data.status === s && s === 'active'       ? 'text-emerald-700' :
                        data.status === s && s === 'discontinued' ? 'text-red-700'     : 'text-slate-700'
                      }`}>
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-slate-400" /> Pricing
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unit Price (KES) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-slate-500 sm:text-sm">KES</span>
                      </div>
                      <input
                        type="number"
                        value={data.price}
                        onChange={e => setData('price', e.target.value)}
                        className={`block w-full rounded-lg border-slate-300 pl-12 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${errors.price ? 'border-red-300' : ''}`}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price (Optional)</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-slate-500 sm:text-sm">KES</span>
                      </div>
                      <input
                        type="number"
                        value={data.cost_price}
                        onChange={e => setData('cost_price', e.target.value)}
                        className="block w-full rounded-lg border-slate-300 pl-12 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">For internal tracking only.</p>
                  </div>
                </div>
              </div>

              {/* Organisation */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-400" /> Organisation
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Batch Number</label>
                    <input
                      type="text"
                      value={data.batch_number}
                      onChange={e => setData('batch_number', e.target.value)}
                      className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                      placeholder="BATCH-1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={data.expiry_date}
                      onChange={e => setData('expiry_date', e.target.value)}
                      className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.expiry_date && <p className="mt-1 text-sm text-red-600">{errors.expiry_date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                    <input
                      type="text"
                      value={data.manufacturer}
                      onChange={e => setData('manufacturer', e.target.value)}
                      className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                      placeholder="e.g. GlaxoSmithKline"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Country of Origin</label>
                    <input
                      type="text"
                      value={data.country_of_origin}
                      onChange={e => setData('country_of_origin', e.target.value)}
                      className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                      placeholder="e.g. Kenya"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </SupplierLayout>
  );
}