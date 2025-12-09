import React from 'react';
import { CartItem } from '../../../types';
import { X, Trash2, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQty, onCheckout }) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.16; // 16% VAT in Kenya
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 overflow-hidden z-[60]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-slate-200">
              <h2 className="text-lg font-medium text-slate-900 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-primary-600" />
                Your Procurement Cart
              </h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-slate-100 p-6 rounded-full mb-4">
                        <ShoppingBag className="h-10 w-10 text-slate-300" />
                    </div>
                    <p className="text-slate-500 text-lg">Your cart is empty.</p>
                    <p className="text-slate-400 text-sm mt-2">Start adding medical supplies from the marketplace.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {items.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-slate-900">
                            <h3 className="line-clamp-2 leading-tight mr-4">{item.name}</h3>
                            <p className="whitespace-nowrap">KES {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{item.supplier}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border border-slate-300 rounded-md">
                            <button
                                onClick={() => onUpdateQty(item.id, -1)}
                                className="px-3 py-1 hover:bg-slate-100 text-slate-600"
                                disabled={item.quantity <= 1}
                            >-</button>
                            <span className="px-2 font-medium text-slate-900">{item.quantity}</span>
                            <button
                                onClick={() => onUpdateQty(item.id, 1)}
                                className="px-3 py-1 hover:bg-slate-100 text-slate-600"
                            >+</button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className="font-medium text-red-600 hover:text-red-500 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="border-t border-slate-200 py-6 px-4 sm:px-6 bg-slate-50">
                    <div className="flex justify-between text-base font-medium text-slate-900 mb-2">
                        <p>Subtotal</p>
                        <p>KES {subtotal.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500 mb-4">
                        <p>VAT (16%)</p>
                        <p>KES {tax.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-slate-900 mb-6">
                        <p>Total</p>
                        <p>KES {total.toLocaleString()}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500 mb-4">
                        Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                        <button
                        onClick={onCheckout}
                        className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 transition-colors"
                        >
                        Checkout
                        </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-slate-500">
                        <p>
                        or{' '}
                        <button
                            type="button"
                            className="font-medium text-primary-600 hover:text-primary-500"
                            onClick={onClose}
                        >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </button>
                        </p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
