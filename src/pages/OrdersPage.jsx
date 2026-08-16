import React, { useState, useEffect } from 'react';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { FaBox, FaClock, FaMapMarkerAlt, FaExclamationCircle, FaSyncAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { formatNaira } from '../utils/currency';

export function OrdersPage({ onBackToMenu }) {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to load order history.');
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Orders error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔒</div>
        <h2>Sign In to View Your Orders</h2>
        <p style={{ marginTop: '8px' }}>Please log in to track your current food orders and order history.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>My Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Track live preparation status and view your past food orders.
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchOrders} title="Refresh orders">
          <FaSyncAlt size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p>Loading your orders...</p>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px'
        }}>
          <FaExclamationCircle size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders placed yet</h3>
          <p style={{ marginTop: '8px', marginBottom: '24px' }}>Looks like you haven't ordered any delicious food yet!</p>
          <button className="btn-primary" onClick={onBackToMenu}>
            Browse Menu
          </button>
        </div>
      )}

      {!loading && !error && orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800 }}>Order #{order.id}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaClock size={12} />
                <span>{new Date(order.created_at).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)' }}>
                {formatNaira(order.total_amount)}
              </span>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.payment_method}</div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaMapMarkerAlt size={13} color="var(--color-primary)" />
              <span><strong>Deliver to:</strong> {order.customer_name} — {order.delivery_address} ({order.customer_phone})</span>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
            {order.items && order.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>
                  <strong>{item.quantity}x</strong> {item.item_name}
                </span>
                <span>{formatNaira(item.price_per_unit * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
