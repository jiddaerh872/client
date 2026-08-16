import React from 'react';
import { FaPlus, FaCheck, FaFire } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../utils/currency';

export function FoodCard({ item }) {
  const { cartItems, addToCart } = useCart();
  const cartItem = cartItems.find((i) => i.id === item.id);
  const inCartCount = cartItem ? cartItem.quantity : 0;

  return (
    <div className="food-card">
      <div className="food-img-wrapper">
        <img 
          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'} 
          alt={item.name} 
          className="food-img"
          loading="lazy"
        />
        {item.badge && (
          <div className="food-badge">
            <FaFire size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
            {item.badge}
          </div>
        )}
      </div>

      <div className="food-body">
        <span className="food-category">{item.category}</span>
        <h3 className="food-name">{item.name}</h3>
        <p className="food-desc">{item.description}</p>

        <div className="food-footer">
          <span className="food-price">{formatNaira(item.price)}</span>
          <button 
            className="add-btn"
            onClick={() => addToCart(item)}
          >
            {inCartCount > 0 ? (
              <>
                <FaCheck size={14} />
                <span>Added ({inCartCount})</span>
              </>
            ) : (
              <>
                <FaPlus size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
