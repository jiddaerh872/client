import React from 'react';
import { FaShoppingBag, FaUser, FaUtensils, FaClipboardList, FaSignOutAlt, FaUserShield, FaHamburger } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const isAdmin = user && (user.is_admin === 1 || user.is_admin === true);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div 
          className="brand-logo" 
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('menu')}
        >
          <FaHamburger size={28} color="var(--color-primary)" style={{ marginRight: '6px' }} />
          <span>Bite<span style={{ color: 'var(--color-primary)' }}>Swift</span></span>
          <span className="brand-badge">Local Eats</span>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <FaUtensils size={16} />
            <span>Menu</span>
          </button>

          {isAuthenticated && (
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FaClipboardList size={16} />
              <span>My Orders</span>
            </button>
          )}

          {isAdmin && (
            <button 
              className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              style={{
                color: activeTab === 'admin' ? 'var(--color-primary)' : '#F59E0B',
                fontWeight: 700
              }}
            >
              <FaUserShield size={16} color="#F59E0B" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button 
            className="cart-btn"
            onClick={() => setIsCartOpen(true)}
          >
            <FaShoppingBag size={18} />
            <span>Cart</span>
            {totalItemCount > 0 && <span className="cart-count">{totalItemCount}</span>}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#E2E8F0' }}>
                <FaUser size={14} color="var(--color-primary)" />
                <span>{user.name.split(' ')[0]}</span>
              </div>
              <button 
                className="btn-icon" 
                title="Log Out"
                onClick={logout}
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '14px', marginLeft: '8px' }}
              onClick={onOpenAuth}
            >
              <FaUser size={14} />
              <span>Sign In</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
