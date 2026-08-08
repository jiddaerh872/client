import React from 'react';
import { FaTimes, FaPlus, FaMinus, FaTrash, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

export function CartModal({ isOpen, onClose, onProceedCheckout }) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    total
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 240 }} />
      <div className="cart-drawer">
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaShoppingBag color="var(--color-primary)" size={20} />
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Your Cart</h2>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({cartItems.length} items)</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p style={{ marginTop: '8px', fontSize: '14px' }}>Add some delicious food from our menu to get started!</p>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  style={{ background: 'none', border: 'none', color: '#F87171', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={clearCart}
                >
                  <FaTrash size={12} />
                  <span>Clear All</span>
                </button>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image_url} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>

                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <FaMinus size={12} />
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Est. Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '16px' }}
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
              >
                <span>Checkout Now</span>
                <FaArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
