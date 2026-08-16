import React, { useState, useEffect } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { FoodCard } from '../components/FoodCard';
import { FaExclamationTriangle } from 'react-icons/fa';

export function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenu();
  }, [activeCategory, searchTerm]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.append('category', activeCategory);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const res = await fetch(`/api/menu?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch menu items from server.');
      }
      const data = await res.json();
      setItems(data.items || []);
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Menu load error:', err);
      setError('Could not load food menu. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Delicious Local Pastries & Drinks Delivered Fast</h1>
        <p className="hero-subtitle">
          Explore freshly prepared Nigerian delicacies like Spring Rolls, Samosa, Meat Pie, Milky Puff Puff, Chin Chin, and refreshing local drinks like Kunu Aya, Zobo & Milkshakes!
        </p>
      </section>

      {/* Filter and Search */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Loading state */}
      {loading && (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p>Loading fresh food items...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '20px 0'
        }}>
          <FaExclamationTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty Search Results */}
      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No food items found</h3>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>Try clearing your search term or switching categories.</p>
        </div>
      )}

      {/* Food Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="food-grid">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
