import React, { useState } from 'react';
import { Navbar } from './resources/js/components/Navbar';
import { Welcome } from './resources/js/pages/Welcome';
import { Marketplace } from './resources/js/pages/Marketplace';
import { ProductShow } from './resources/js/pages/ProductShow';
import { Profile } from './resources/js/pages/Profile';
import { CartDrawer } from './resources/js/components/CartDrawer';
import { AuthModal } from './resources/js/components/AuthModal';
import { Footer } from './resources/js/components/Footer';
// import { AIChatBot } from './resources/js/components/AIChatBot';
import { Product, CartItem, Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleNavigate = (page: Page) => {
    if (page === Page.AUTH) {
      setIsAuthOpen(true);
    } else {
      setCurrentPage(page);
    }
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage(Page.PRODUCT_DETAIL);
    window.scrollTo(0, 0);
  };

  // Render Page Content
  const renderContent = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Welcome onNavigate={handleNavigate} />;
      case Page.MARKETPLACE:
        return <Marketplace onProductClick={handleProductClick} onAddToCart={handleAddToCart} />;
      case Page.PRODUCT_DETAIL:
        return selectedProduct ? (
          <ProductShow
            product={selectedProduct}
            onBack={() => setCurrentPage(Page.MARKETPLACE)}
            onAddToCart={handleAddToCart}
          />
        ) : <Marketplace onProductClick={handleProductClick} onAddToCart={handleAddToCart} />;
      case Page.PROFILE:
        return <Profile onLogout={() => setIsLoggedIn(false)} />;
      default:
        return <Welcome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-primary-100 selection:text-primary-900">
      <Navbar
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        isLoggedIn={isLoggedIn}
      />

      <main className="flex-grow">
        {renderContent()}
      </main>

      <Footer />
      {/* <AIChatBot /> */}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateQty}
        onCheckout={() => {
            alert('Processing Purchase Order...');
            setIsCartOpen(false);
        }}
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
}

export default App;
