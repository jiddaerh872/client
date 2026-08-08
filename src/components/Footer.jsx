import React from 'react';
import { FaHeart } from 'react-icons/fa';

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '32px 20px',
      background: 'rgba(15, 23, 42, 0.9)',
      textAlign: 'center',
      marginTop: 'auto',
      fontSize: '14px',
      color: 'var(--text-muted)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
          <span>🍔 BiteSwift Food Ordering</span>
        </div>
        <p>Connecting local food lovers with neighborhood kitchens & food trucks.</p>
        <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '4px' }}>
          Crafted with <FaHeart color="var(--color-primary)" size={12} /> for Capstone Project &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
