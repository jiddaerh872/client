import React, { useState } from 'react';
import { FaShoppingBag, FaMapMarkerAlt, FaCreditCard, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function CheckoutPage({ onBackToMenu, onOrderSuccess, onRequireAuth }) {
  const { cartItems, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p style={{ marginTop: '8px', marginBottom: '24px' }}>Please add some items to your cart before checking out.</p>
        <button className="btn-primary" onClick={onBackToMenu}>
          <FaArrowLeft size={14} />
          <span>Back to Menu</span>
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (!customerName || !customerPhone || !deliveryAddress) {
      setError('Please provide your name, phone number, and delivery address.');
      return;
    }

    try {
      setLoading(true);
      const orderPayload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        notes,
        payment_method: paymentMethod,
        items: cartItems.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      clearCart();
      onOrderSuccess(data.order);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        className="btn-secondary" 
        onClick={onBackToMenu}
        style={{ marginBottom: '24px', fontSize: '14px' }}
      >
        <FaArrowLeft size={14} />
        <span>Back to Menu</span>
      </button>

      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px' }}>Complete Your Order</h1>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          marginBottom: '24px'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        {/* Delivery Details Form */}
        <form onSubmit={handleSubmitOrder}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaMapMarkerAlt color="var(--color-primary)" size={18} />
              <span>Delivery Details</span>
            </h2>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Alex Johnson"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number for Delivery Updates *</label>
              <input 
                type="tel" 
                className="form-input"
                placeholder="+1 (555) 234-5678"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street & Apartment Delivery Address *</label>
              <textarea 
                className="form-input"
                rows="3"
                placeholder="e.g. 123 University Ave, Apt 4B, Campus View"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Delivery Instructions (Optional)</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Ring doorbell, leave at front desk"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '28px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCreditCard color="var(--color-primary)" size={16} />
              <span>Payment Option</span>
            </h3>

            <div style={{ display: 'flex', gap: '12px' }}>
              {['Cash on Delivery', 'Card on Delivery'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${paymentMethod === method ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    background: paymentMethod === method ? 'var(--color-primary-light)' : 'var(--bg-main)',
                    color: paymentMethod === method ? 'var(--color-primary)' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '14px',
                    textAlign: 'center'
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Order Summary Side Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaShoppingBag color="var(--color-primary)" size={18} />
            <span>Order Summary</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '220px', overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.name}
                </div>
                <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
            onClick={handleSubmitOrder}
            disabled={loading}
          >
            <FaCheckCircle size={16} />
            <span>{loading ? 'Submitting Order...' : 'Place Order Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
