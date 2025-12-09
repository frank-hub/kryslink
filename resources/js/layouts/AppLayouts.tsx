import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { AuthModal } from '../components/AuthModal';
import { AIChatBot } from '../components/AIChatBot';
import { CartItem, Page } from '../../../types';

interface AppLayoutProps {
  children: React.ReactNode;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  onNavigate: (page: Page) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  cart,
  isCartOpen,
  setIsCartOpen,
  isAuthOpen,
  setIsAuthOpen,
  isLoggedIn,
  setIsLoggedIn,
  onNavigate,
  onRemoveFromCart,
  onUpdateQty,
  onCheckout
}) => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Navbar
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onNavigate={onNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        isLoggedIn={isLoggedIn}
      />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      <AIChatBot />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={onRemoveFromCart}
        onUpdateQty={onUpdateQty}
        onCheckout={onCheckout}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={() => {
            setIsLoggedIn(true);
            setIsAuthOpen(false);
        }}
      />
    </div>
  );
};
