import React from 'react';
import { FaSearch } from 'react-icons/fa';

export function CategoryFilter({ categories, activeCategory, setActiveCategory, searchTerm, setSearchTerm }) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <FaSearch className="search-icon" size={16} />
        <input 
          type="text"
          className="search-input"
          placeholder="Search burgers, pizzas, drinks, desserts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
