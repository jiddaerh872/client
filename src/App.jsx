import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { FaCheckCircle } from 'react-icons/fa';

function AppContent() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'checkout' | 'orders'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [orderSuccessMessage, setOrderSuccessMessage] = useState(null);

  const { isCartOpen, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  const handleOrderSuccess = (order) => {
    setOrderSuccessMessage(`Order #${order.id} placed successfully! Total: $${order.total_amount.toFixed(2)}`);
    setActiveTab('orders');
    setTimeout(() => {
      setOrderSuccessMessage(null);
    }, 8000);
  };

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {orderSuccessMessage && (
        <div style={{
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: '#FFFFFF',
          padding: '16px 24px',
          textAlign: 'center',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: 'var(--shadow-md)',
          animation: 'modalIn 0.3s ease'
        }}>
          <FaCheckCircle size={18} />
          <span>{orderSuccessMessage}</span>
        </div>
      )}

      <main className="main-content">
        {activeTab === 'menu' && <MenuPage />}

        {activeTab === 'checkout' && (
          <CheckoutPage 
            onBackToMenu={() => setActiveTab('menu')}
            onOrderSuccess={handleOrderSuccess}
            onRequireAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersPage 
            onBackToMenu={() => setActiveTab('menu')}
          />
        )}
      </main>

      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={() => {
          if (!isAuthenticated) {
            setIsAuthOpen(true);
          } else {
            setActiveTab('checkout');
          }
        }}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
