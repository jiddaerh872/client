import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, 
  FaUtensils, FaClipboardList, FaMoneyBillWave, FaBoxOpen, 
  FaStar, FaToggleOn, FaToggleOff, FaMagic, FaSyncAlt, FaExclamationTriangle
} from 'react-icons/fa';
import { formatNaira } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

const LOCAL_PRESETS = [
  { name: 'Spring Rolls', category: 'Pastries', price: 1200, badge: 'Hot & Crispy', description: 'Crispy fried wrapper filled with seasoned chicken, cabbage, and glass noodles.', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cinnamon Rolls', category: 'Pastries', price: 1500, badge: 'Sweet Treat', description: 'Soft rolled pastry swirled with cinnamon, brown sugar, and cream cheese glaze.', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { name: 'Samosa', category: 'Pastries', price: 1000, badge: 'Popular', description: 'Golden triangular pastry filled with spiced minced beef, peas, and fragrant spices.', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
  { name: 'Meat Pie', category: 'Pastries', price: 800, badge: 'Best Seller', description: 'Flaky pastry crust filled with minced beef, potatoes, and carrots.', image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Peanut Burgers', category: 'Pastries', price: 600, badge: 'Crunchy', description: 'Crunchy candy-coated roasted groundnuts in crispy baked dough.', image_url: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Burger', category: 'Pastries', price: 3500, badge: 'Chef Special', description: 'Juicy beef patty with sharp cheddar, crisp lettuce, tomato, and burger sauce.', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Egg Rolls', category: 'Pastries', price: 600, badge: 'Classic', description: 'Whole hard-boiled egg wrapped in sweet golden dough.', image_url: 'https://images.unsplash.com/photo-1619221882220-947b3d3c8861?auto=format&fit=crop&w=800&q=80' },
  { name: 'Milky Donuts', category: 'Pastries', price: 700, badge: 'Milky', description: 'Pillowy ring donuts drenched in condensed milk and milk powder.', image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Milky Puff Puff', category: 'Pastries', price: 1000, badge: 'Fan Favorite', description: 'Golden fried dough balls infused with sweet powdered milk.', image_url: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chin Chin', category: 'Pastries', price: 500, badge: 'Crunchy', description: 'Bite-sized crunchy fried dough snack with nutmeg and vanilla.', image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80' },
  { name: 'Milkshake', category: 'Drinks', price: 2500, badge: 'Creamy', description: 'Thick frosty milkshake blended with vanilla ice cream and whole milk.', image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80' },
  { name: 'Ice Cream', category: 'Drinks', price: 1800, badge: 'Indulgent', description: 'Scoop of artisanal ice cream in vanilla, strawberry, or chocolate.', image_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9ca7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Yoghurt', category: 'Drinks', price: 1500, badge: 'Healthy', description: 'Thick, creamy sweetened probiotic yoghurt drink served ice cold.', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80' },
  { name: 'Kunu Aya', category: 'Drinks', price: 800, badge: 'Traditional', description: 'Traditional tiger nut milk drink with dates, coconut, and ginger.', image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80' },
  { name: 'Kunu Geda', category: 'Drinks', price: 800, badge: 'Northern Special', description: 'Hausa groundnut and rice milk drink, warm and gently spiced.', image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Zobo', category: 'Drinks', price: 600, badge: 'Refreshing', description: 'Chilled hibiscus tea with fresh pineapple juice, ginger, and mint.', image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' }
];

export function AdminDashboardPage() {
  const { token, user } = useAuth();

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders'
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter
  const [menuSearch, setMenuSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Pastries',
    image_url: '',
    badge: 'Popular',
    is_available: true
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      const [menuRes, ordersRes] = await Promise.all([
        fetch('/api/menu/admin/all', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/orders/admin/all', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (!menuRes.ok || !ordersRes.ok) {
        throw new Error('Failed to load admin data. Ensure you have admin privileges.');
      }

      const menuData = await menuRes.json();
      const ordersData = await ordersRes.json();

      setItems(menuData.items || []);
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error('Admin data error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Pastries',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      badge: 'Popular',
      is_available: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      image_url: item.image_url || '',
      badge: item.badge || '',
      is_available: !!item.is_available
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill in all required fields (Name, Price, Category).');
      return;
    }

    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save menu item.');

      showNotification(editingItem ? `Updated "${formData.name}"` : `Added "${formData.name}" to menu!`);
      setIsModalOpen(false);
      fetchAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updatedVal = item.is_available ? 0 : 1;
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_available: updatedVal })
      });
      if (!res.ok) throw new Error('Failed to update availability.');
      fetchAdminData();
      showNotification(`"${item.name}" is now ${updatedVal ? 'Available' : 'Unavailable'}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete item.');
      showNotification(`Deleted "${item.name}"`);
      fetchAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApplyPreset = (preset) => {
    setFormData({
      name: preset.name,
      description: preset.description,
      price: preset.price,
      category: preset.category,
      image_url: preset.image_url,
      badge: preset.badge,
      is_available: true
    });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update order status.');
      showNotification(`Order #${orderId} status changed to ${newStatus}`);
      fetchAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Preparing').length;

  const filteredItems = items.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(menuSearch.toLowerCase()) || (i.description && i.description.toLowerCase().includes(menuSearch.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || i.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '28px' }}>👑</span>
            <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Admin Dashboard</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage menu items, local pastries & drinks, prices in Naira (₦), and customer orders.
          </p>
        </div>

        <button className="btn-secondary" onClick={fetchAdminData} title="Refresh Dashboard">
          <FaSyncAlt size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div style={{
          background: 'linear-gradient(135deg, #10B981, #059669)',
          color: '#FFF',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaCheck size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px'
        }}>
          <FaExclamationTriangle size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaMoneyBillWave size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL REVENUE</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)' }}>{formatNaira(totalRevenue)}</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaClipboardList size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ORDERS</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{orders.length}</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaUtensils size={20} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE MENU ITEMS</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{items.length}</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaBoxOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING ORDERS</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: pendingOrders > 0 ? '#F87171' : 'inherit' }}>{pendingOrders}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('menu')}
          style={{
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: '15px',
            border: 'none',
            background: 'none',
            color: activeTab === 'menu' ? 'var(--color-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'menu' ? '3px solid var(--color-primary)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaUtensils size={16} />
          <span>Product Menu ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: '15px',
            border: 'none',
            background: 'none',
            color: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'orders' ? '3px solid var(--color-primary)' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaClipboardList size={16} />
          <span>Customer Orders ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div>
          {/* Action Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%' }}
                />
              </div>

              <select
                className="form-input"
                style={{ width: '150px' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Pastries">Pastries</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>

            <button className="btn-primary" onClick={handleOpenAddModal}>
              <FaPlus size={14} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px' }}>Item</th>
                  <th style={{ padding: '16px' }}>Category</th>
                  <th style={{ padding: '16px' }}>Price (₦)</th>
                  <th style={{ padding: '16px' }}>Badge</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No menu products found. Click <strong>"Add New Product"</strong> above to add local pastries or drinks.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                            alt={item.name}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '15px' }}>{item.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: item.category === 'Pastries' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: item.category === 'Pastries' ? 'var(--color-primary)' : '#60A5FA'
                        }}>
                          {item.category}
                        </span>
                      </td>

                      <td style={{ padding: '16px', fontWeight: 800, fontSize: '15px' }}>
                        {formatNaira(item.price)}
                      </td>

                      <td style={{ padding: '16px' }}>
                        {item.badge ? (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                            {item.badge}
                          </span>
                        ) : '—'}
                      </td>

                      <td style={{ padding: '16px' }}>
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: item.is_available ? '#10B981' : '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 600
                          }}
                        >
                          {item.is_available ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
                          <span>{item.is_available ? 'Available' : 'Unavailable'}</span>
                        </button>
                      </td>

                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-icon"
                            title="Edit Product"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            <FaEdit size={14} color="#60A5FA" />
                          </button>
                          <button
                            className="btn-icon"
                            title="Delete Product"
                            onClick={() => handleDeleteItem(item)}
                          >
                            <FaTrash size={14} color="#F87171" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No customer orders placed yet</h3>
              <p style={{ marginTop: '8px' }}>Orders submitted by customers will appear here in real-time.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '20px', fontWeight: 800 }}>Order #{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Customer: <strong>{order.customer_name}</strong> ({order.customer_phone}) — {order.delivery_address}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)' }}>{formatNaira(order.total_amount)}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.payment_method}</div>
                    </div>

                    {/* Status Changer */}
                    <div>
                      <select
                        className="form-input"
                        style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 700 }}
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Items Ordered:</div>
                  {order.items && order.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '4px 0' }}>
                      <span><strong>{item.quantity}x</strong> {item.item_name}</span>
                      <span>{formatNaira(item.price_per_unit * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
                {editingItem ? `Edit Product: ${editingItem.name}` : 'Add New Product to Menu'}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <FaTimes size={18} />
              </button>
            </div>

            {/* Nigerian Local Presets Quick Picker (only for new item) */}
            {!editingItem && (
              <div style={{ marginBottom: '20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px dashed var(--color-primary)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <FaMagic size={14} />
                  <span>Quick Preset (Click to auto-fill Nigerian local pastries & drinks):</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '100px', overflowY: 'auto' }}>
                  {LOCAL_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        background: formData.name === preset.name ? 'var(--color-primary)' : 'var(--bg-main)',
                        color: formData.name === preset.name ? '#FFF' : 'var(--text-main)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      + {preset.name} ({formatNaira(preset.price)})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveItem}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Milky Puff Puff"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="Pastries">Pastries</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Meals">Meals</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price in Naira (₦) *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 1000"
                    min="0"
                    step="50"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Badge / Tag (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Best Seller, Sweet, Popular"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Describe ingredients and flavor profile..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="is_available_check"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="is_available_check" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Available for Customer Orders
                </label>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                <FaCheck size={14} />
                <span>{editingItem ? 'Save Product Changes' : 'Create Product'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
