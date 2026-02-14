import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { SupplierLayout } from './Layout';

import {
  CreditCard, Plus, X, CheckCircle2, Edit2, Trash2,
  Building2, Smartphone, AlertCircle, Shield
} from 'lucide-react';

interface PayoutMethod {
  id: number;
  type: string;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  mpesa_number: string | null;
  till_number: string | null;
  is_primary: boolean;
  is_verified: boolean;
}

interface PayoutMethodsProps {
  methods: PayoutMethod[];
}

export default function PayoutMethods({ methods }: PayoutMethodsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PayoutMethod | null>(null);
  const [methodType, setMethodType] = useState<'bank' | 'mpesa'>('bank');

  const { data, setData, post, patch, processing, errors, reset } = useForm({
    type: 'bank' as 'bank' | 'mpesa',
    bank_name: '',
    account_name: '',
    account_number: '',
    mpesa_number: '',
    till_number: '',
    is_primary: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    

    router.patch(`/supplier/payout-methods/${editingMethod?.id}`, data, {
    onSuccess: () => {
        setIsAddModalOpen(false);
        setEditingMethod(null);
        reset();
    },
    });

    console.log('Submitting payout method:', data);


    router.post('/supplier/payout-methods', data, {
    onSuccess: () => {
        setIsAddModalOpen(false);
        reset();
    },
    });

  };

  const handleEdit = (method: PayoutMethod) => {
    setEditingMethod(method);
    setMethodType(method.type as 'bank' | 'mpesa');
    setData({
      type: method.type as 'bank' | 'mpesa',
      bank_name: method.bank_name || '',
      account_name: method.account_name || '',
      account_number: method.account_number || '',
      mpesa_number: method.mpesa_number || '',
      till_number: method.till_number || '',
      is_primary: method.is_primary,
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (methodId: number) => {
    if (confirm('Are you sure you want to delete this payout method?')) {
    //   router.delete(route('supplier.payout-methods.destroy', methodId));
    }
  };

  const handleSetPrimary = (methodId: number) => {
    // router.post(route('supplier.payout-methods.set-primary', methodId));
  };

  const openAddModal = () => {
    setEditingMethod(null);
    reset();
    setMethodType('bank');
    setIsAddModalOpen(true);
  };

  return (
    <SupplierLayout>
      <Head title="Payout Methods" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payout Methods</h1>
          <p className="text-slate-500">Manage your bank accounts and payment methods for receiving funds.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-6 py-2 bg-[#0d9488] text-white rounded-lg font-bold hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Method
        </button>
      </div>

      {/* Payout Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods && methods.length > 0 ? (
          methods.map((method) => (
            <div
              key={method.id}
              className={`bg-white p-6 rounded-2xl border-2 shadow-sm relative ${
                method.is_primary ? 'border-[#0d9488] bg-teal-50/30' : 'border-slate-200'
              }`}
            >
              {/* Primary Badge */}
              {method.is_primary && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-[#0d9488] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Primary
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  method.type === 'bank' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  {method.type === 'bank' ? (
                    <Building2 className="h-6 w-6" />
                  ) : (
                    <Smartphone className="h-6 w-6" />
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {method.type === 'bank' ? method.bank_name : 'M-PESA'}
                </h3>
                {method.type === 'bank' ? (
                  <>
                    <p className="text-sm text-slate-600">{method.account_name}</p>
                    <p className="text-sm text-slate-500 font-mono">****{method.account_number?.slice(-4)}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-slate-600">{method.mpesa_number}</p>
                    {method.till_number && (
                      <p className="text-sm text-slate-500">Till: {method.till_number}</p>
                    )}
                  </>
                )}
              </div>

              {/* Verification Status */}
              <div className="mb-4">
                {method.is_verified ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span className="font-medium">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="font-medium">Pending Verification</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                {!method.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(method.id)}
                    className="flex-1 px-3 py-2 text-sm font-bold text-[#0d9488] bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => handleEdit(method)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Payout Methods</h3>
            <p className="text-slate-500 mb-6">Add a bank account or M-PESA number to receive payments</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-6 py-3 bg-[#0d9488] text-white rounded-lg font-bold hover:bg-[#0f766e] shadow-lg shadow-teal-500/20 transition-all"
            >
              <Plus className="h-5 w-5 mr-2" /> Add Your First Method
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-lg">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingMethod ? 'Edit Payout Method' : 'Add Payout Method'}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-5">
                  {/* Method Type Selector */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Payment Method Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setMethodType('bank');
                          setData('type', 'bank');
                        }}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          methodType === 'bank'
                            ? 'border-[#0d9488] bg-teal-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Building2 className={`h-6 w-6 mx-auto mb-2 ${methodType === 'bank' ? 'text-[#0d9488]' : 'text-slate-400'}`} />
                        <p className={`text-sm font-bold ${methodType === 'bank' ? 'text-[#0d9488]' : 'text-slate-600'}`}>
                          Bank Account
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMethodType('mpesa');
                          setData('type', 'mpesa');
                        }}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          methodType === 'mpesa'
                            ? 'border-[#0d9488] bg-teal-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Smartphone className={`h-6 w-6 mx-auto mb-2 ${methodType === 'mpesa' ? 'text-[#0d9488]' : 'text-slate-400'}`} />
                        <p className={`text-sm font-bold ${methodType === 'mpesa' ? 'text-[#0d9488]' : 'text-slate-600'}`}>
                          M-PESA
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Bank Account Fields */}
                  {methodType === 'bank' && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Bank Name</label>
                        <input
                          type="text"
                          value={data.bank_name}
                          onChange={(e) => setData('bank_name', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-[#0d9488] focus:border-[#0d9488]"
                          placeholder="e.g., Standard Chartered"
                          required={methodType === 'bank'}
                        />
                        {errors.bank_name && <p className="text-xs text-red-500 mt-1">{errors.bank_name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Account Name</label>
                        <input
                          type="text"
                          value={data.account_name}
                          onChange={(e) => setData('account_name', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-[#0d9488] focus:border-[#0d9488]"
                          placeholder="Full name on account"
                          required={methodType === 'bank'}
                        />
                        {errors.account_name && <p className="text-xs text-red-500 mt-1">{errors.account_name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Account Number</label>
                        <input
                          type="text"
                          value={data.account_number}
                          onChange={(e) => setData('account_number', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-[#0d9488] focus:border-[#0d9488]"
                          placeholder="1234567890"
                          required={methodType === 'bank'}
                        />
                        {errors.account_number && <p className="text-xs text-red-500 mt-1">{errors.account_number}</p>}
                      </div>
                    </>
                  )}

                  {/* M-PESA Fields */}
                  {methodType === 'mpesa' && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">M-PESA Number</label>
                        <input
                          type="tel"
                          value={data.mpesa_number}
                          onChange={(e) => setData('mpesa_number', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-[#0d9488] focus:border-[#0d9488]"
                          placeholder="0712345678"
                          required={methodType === 'mpesa'}
                        />
                        {errors.mpesa_number && <p className="text-xs text-red-500 mt-1">{errors.mpesa_number}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Till Number (Optional)</label>
                        <input
                          type="text"
                          value={data.till_number}
                          onChange={(e) => setData('till_number', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-[#0d9488] focus:border-[#0d9488]"
                          placeholder="552910"
                        />
                        {errors.till_number && <p className="text-xs text-red-500 mt-1">{errors.till_number}</p>}
                      </div>
                    </>
                  )}

                  {/* Set as Primary */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_primary"
                      checked={data.is_primary}
                      onChange={(e) => setData('is_primary', e.target.checked)}
                      className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-slate-300 rounded"
                    />
                    <label htmlFor="is_primary" className="ml-2 text-sm font-medium text-slate-700">
                      Set as primary payout method
                    </label>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Your payment information is encrypted and secure. Our admin will verify your details before approving payouts.
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 py-3 bg-[#0d9488] text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-[#0f766e] transition-all disabled:opacity-50"
                  >
                    {processing ? 'Saving...' : editingMethod ? 'Update Method' : 'Add Method'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </SupplierLayout>
  );
}