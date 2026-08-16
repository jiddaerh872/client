import React, { useState } from 'react';
import { FaTimes, FaArrowRight, FaUser, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export function AuthModal({ isOpen, onClose }) {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error);
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        return;
      }
      const res = await register(formData.name, formData.email, formData.password, formData.phone);
      if (res.success) {
        onClose();
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#F87171',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            marginBottom: '18px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Alex Johnson"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+234 801 234 5678"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <FaArrowRight size={14} />
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>QUICK DEMO LOGIN</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={async () => {
                const res = await login('alex@example.com', 'password123');
                if (res.success) onClose();
              }}
            >
              <FaUser size={12} color="var(--color-primary)" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--color-primary)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={async () => {
                const res = await login('admin@biteswift.com', 'admin123');
                if (res.success) onClose();
              }}
            >
              <FaUserShield size={13} color="var(--color-primary)" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setMode('register'); setError(''); }}
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setMode('login'); setError(''); }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
