import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { SupplierLayout } from './Layout';
import {
  ArrowLeft, Upload, Info, DollarSign, Package,
  FileText, Image as ImageIcon, Save, X, AlertCircle
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
}

interface ProductFormData {
  name: string;
  category_id: string;
  generic_name: string;
  description: string;
  price: string;
  cost_price: string;
  stock: string;
  low_stock_threshold: string;
  pack_size: string;
  dosage: string;
  form: string;
  manufacturer: string;
  country_of_origin: string;
  batch_number: string;
  expiry_date: string;
  requires_prescription: boolean;
  requires_cold_chain: boolean;
  status: 'draft' | 'active';
  images: File[];
  documents: File[];
}

export default function CreateProduct({ categories }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm<ProductFormData>({
    name: '',
    category_id: '',
    generic_name: '',
    description: '',
    price: '',
    cost_price: '',
    stock: '',
    low_stock_threshold: '50',
    pack_size: '',
    dosage: '',
    form: '',
    manufacturer: '',
    country_of_origin: 'Kenya',
    batch_number: '',
    expiry_date: '',
    requires_prescription: false,
    requires_cold_chain: false,
    status: 'active',
    images: [],
    documents: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [documentNames, setDocumentNames] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const currentImages = Array.from(data.images);

      // Limit to 5 images
      if (currentImages.length + newFiles.length > 5) {
        alert('Maximum 5 images allowed');
        return;
      }

      // Check file size (max 2MB per image)
      const oversizedFiles = newFiles.filter(file => file.size > 2 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        alert('Some images exceed 2MB limit');
        return;
      }

      // Add new images
      setData('images', [...currentImages, ...newFiles]);

      // Create previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = Array.from(data.images);
    newImages.splice(index, 1);
    setData('images', newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const currentDocs = Array.from(data.documents);

      // Limit to 5 documents
      if (currentDocs.length + newFiles.length > 5) {
        alert('Maximum 5 documents allowed');
        return;
      }

      // Check file size (max 5MB per document)
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        alert('Some documents exceed 5MB limit');
        return;
      }

      setData('documents', [...currentDocs, ...newFiles]);
      setDocumentNames(prev => [...prev, ...newFiles.map(f => f.name)]);
    }
  };

  const removeDocument = (index: number) => {
    const newDocs = Array.from(data.documents);
    newDocs.splice(index, 1);
    setData('documents', newDocs);

    const newNames = [...documentNames];
    newNames.splice(index, 1);
    setDocumentNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent, status: 'draft' | 'active') => {
    e.preventDefault();
    setData('status', status);

    // Use FormData for file uploads
    // post(route('supplier.products.store'), {
    //   forceFormData: true,
    //   preserveScroll: true,
    //   onSuccess: () => {
    //     reset();
    //     setImagePreviews([]);
    //     setDocumentNames([]);
    //   },
    // });
  };

  return (
    <SupplierLayout>
      <Head title="Add New Product" />

      <form onSubmit={(e) => handleSubmit(e, 'active')}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                href=""
                className="mr-4 p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
                <p className="text-slate-500">Create a new listing for your pharmaceutical inventory.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e as any, 'draft')}
                disabled={processing}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-[#0d9488] text-white rounded-lg font-bold hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all flex items-center disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {processing ? 'Publishing...' : 'Publish Product'}
              </button>
            </div>
          </div>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {Object.entries(errors).map(([key, value]) => (
                      <li key={key}>{value}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

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
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className={`w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${
                        errors.name ? 'border-red-300' : ''
                      }`}
                      placeholder="e.g. Amoxicillin 500mg Capsules"
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Generic Name
                      </label>
                      <input
                        type="text"
                        value={data.generic_name}
                        onChange={(e) => setData('generic_name', e.target.value)}
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
                        onChange={(e) => setData('category_id', e.target.value)}
                        className={`w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${
                          errors.category_id ? 'border-red-300' : ''
                        }`}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={data.dosage}
                        onChange={(e) => setData('dosage', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                        placeholder="e.g. 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Form
                      </label>
                      <input
                        type="text"
                        value={data.form}
                        onChange={(e) => setData('form', e.target.value)}
                        className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                        placeholder="e.g. Tablets"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Pack Size
                      </label>
                      <input
                        type="text"
                        value={data.pack_size}
                        onChange={(e) => setData('pack_size', e.target.value)}
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
                      onChange={(e) => setData('description', e.target.value)}
                      className={`w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${
                        errors.description ? 'border-red-300' : ''
                      }`}
                      placeholder="Describe the product, usage, and packaging details..."
                      required
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Media */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <ImageIcon className="h-5 w-5 text-slate-400 mr-2" /> Product Images
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {imagePreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                    >
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
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
                  {imagePreviews.length < 5 && (
                    <label className="border-2 border-dashed border-slate-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#0d9488] hover:bg-teal-50 transition-colors">
                      <Upload className="h-6 w-6 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-500 font-medium">Upload Image</span>
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
                  Upload high-quality images. First image will be the cover. Max 5 images, 2MB each.
                </p>
                {errors.images && (
                  <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                )}
              </div>

              {/* 3. Documents */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-slate-400 mr-2" /> Documents
                </h3>

                <div className="space-y-2 mb-4">
                  {documentNames.map((name, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-700">{name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#0d9488] hover:bg-teal-50 transition-colors">
                  <Upload className="h-6 w-6 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-700 font-medium">Upload Documents</span>
                  <span className="text-xs text-slate-500 mt-1">
                    Certificate of Analysis, Import License, etc.
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={handleDocumentUpload}
                  />
                </label>
                <p className="text-xs text-slate-500 mt-2">Max 5 documents, 5MB each.</p>
              </div>

              {/* 4. Inventory & Logistics */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 text-slate-400 mr-2" /> Inventory & Logistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={data.stock}
                      onChange={(e) => setData('stock', e.target.value)}
                      className={`w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${
                        errors.stock ? 'border-red-300' : ''
                      }`}
                      placeholder="0"
                      min="0"
                      required
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      value={data.low_stock_threshold}
                      onChange={(e) => setData('low_stock_threshold', e.target.value)}
                      className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                      placeholder="50"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="prescription"
                      type="checkbox"
                      checked={data.requires_prescription}
                      onChange={(e) => setData('requires_prescription', e.target.checked)}
                      className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-slate-300 rounded"
                    />
                    <label htmlFor="prescription" className="ml-2 block text-sm text-slate-700">
                      Prescription Required (POM)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="coldchain"
                      type="checkbox"
                      checked={data.requires_cold_chain}
                      onChange={(e) => setData('requires_cold_chain', e.target.checked)}
                      className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-slate-300 rounded"
                    />
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Unit Price (KES) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-slate-500 sm:text-sm">KES</span>
                      </div>
                      <input
                        type="number"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        className={`block w-full rounded-lg border-slate-300 pl-12 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm ${
                          errors.price ? 'border-red-300' : ''
                        }`}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Cost Price (Optional)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-slate-500 sm:text-sm">KES</span>
                      </div>
                      <input
                        type="number"
                        value={data.cost_price}
                        onChange={(e) => setData('cost_price', e.target.value)}
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

              {/* Organization */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 text-slate-400 mr-2" /> Organization
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={data.batch_number}
                      onChange={(e) => setData('batch_number', e.target.value)}
                      className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                      placeholder="BATCH-1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={data.expiry_date}
                      onChange={(e) => setData('expiry_date', e.target.value)}
                      className="w-full rounded-lg border-slate-300 focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.expiry_date && (
                      <p className="mt-1 text-sm text-red-600">{errors.expiry_date}</p>
                    )}
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
