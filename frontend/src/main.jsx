import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = 'http://127.0.0.1:8000/api';
const get = (p) => fetch(API + p).then(r => r.json());
const post = (p, data) => fetch(API + p, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
}).then(r => r.json());

const getImage = (image) => image ? `http://127.0.0.1:8000${image}` : 'https://placehold.co/600x400/edf3fb/10233f?text=Property+Image';

// Icon components
const Icon = ({ name }) => {
  const icons = {
    dashboard: '📊', home: '🏠', briefcase: '📋', users: '👥',
    tool: '🔧', check: '✅', file: '📄', chart: '📈'
  };
  return icons[name] || '•';
};

// Stat Card Component
const StatCard = ({ label, value, icon, color = 'primary' }) => (
  <div className={`stat-card stat-${color}`}>
    <div className="stat-content">
      <div className="stat-icon">{Icon({ name: icon })}</div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  </div>
);

// Property Card Component
const PropertyCard = ({ property }) => (
  <div className="property-card">
    <div className="property-image">
      <img src={getImage(property.image)} alt={property.address} />
      <span className={`status-badge status-${property.status?.toLowerCase()}`}>
        {property.status}
      </span>
    </div>
    <div className="property-content">
      <h3>{property.address}</h3>
      <div className="property-meta">
        <span>{property.property_type}</span>
        <span>Client: {property.client}</span>
      </div>
      {property.details && <p className="property-details">{property.details}</p>}
    </div>
  </div>
);

// Work Order Item Component
const WorkOrderItem = ({ order }) => (
  <div className="work-order-item">
    <div className="wo-icon">{Icon({ name: 'briefcase' })}</div>
    <div className="wo-content">
      <h4>{order.title || `Order #${order.id}`}</h4>
      <p className="wo-status">{order.status}</p>
    </div>
    <span className={`wo-badge status-${order.status?.toLowerCase()}`}>{order.status}</span>
  </div>
);

// Login Component
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, name: email.split('@')[0] });
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="login-logo">📋</div>
          <h1>AITC BPO</h1>
          <p className="login-tagline">Property Preservation & Management System</p>
          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <p>Complete Property Management</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <p>Real-time Work Order Tracking</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <p>Professional Analytics & Reports</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <p>Team Performance Monitoring</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="login-form-box">
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="admin@aitcbpo.com"
                  className="login-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="login-input"
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? '🔄 Signing In...' : '🔐 Sign In'}
              </button>
            </form>

            <div className="login-footer">
              <p className="demo-info">Demo Credentials:</p>
              <p className="demo-text">Email: demo@aitcbpo.com</p>
              <p className="demo-text">Password: demo1234</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [properties, setProperties] = useState([]);
  const [qaReviews, setQaReviews] = useState([]);
  const [tab, setTab] = useState('Dashboard');
  const [form, setForm] = useState({
    client: '', address: '', property_type: 'House',
    details: '', status: 'Active'
  });
  const [saving, setSaving] = useState(false);

  const handleLogin = (userData) => {
    setAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setAuthenticated(true);
    }
  }, []);

  // Default sample data for demonstration
  const defaultData = {
    clients: 18,
    properties: 24,
    work_orders: 42,
    vendors: 12,
    qa_reviews: 156,
    documents: 89,
    unread_notifications: 5,
    work_order_status: [
      { status: 'Completed', count: 28 },
      { status: 'In Progress', count: 10 },
      { status: 'Pending', count: 4 }
    ]
  };

  const load = () => Promise.all([
    get('/dashboard/'),
    get('/work-orders/'),
    get('/properties/'),
    get('/qa-reviews/')
  ]).then(([a, b, c, e]) => {
    setData(a || defaultData);
    setOrders(b || []);
    setProperties(c || []);
    setQaReviews(e || []);
  }).catch(() => {
    // Use sample data when API is unavailable
    setData(defaultData);
    setOrders([]);
    setProperties([]);
    setQaReviews([]);
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client || !form.address) return;
    setSaving(true);
    post('/properties/', form)
      .then(() => {
        setSaving(false);
        setForm({ client: '', address: '', property_type: 'House', details: '', status: 'Active' });
        load();
        setTab('Properties');
      })
      .catch(() => setSaving(false));
  };

  useEffect(load, []);

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard' },
    { name: 'Properties', icon: 'home' },
    { name: 'Work Orders', icon: 'briefcase' },
    { name: 'Clients', icon: 'users' },
    { name: 'Vendors', icon: 'tool' },
    { name: 'QA Review', icon: 'check' },
    { name: 'Documents', icon: 'file' },
    { name: 'Reports', icon: 'chart' }
  ];

  return authenticated ? (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">{Icon({ name: 'briefcase' })}</div>
          <div>
            <h2>AITC BPO</h2>
            <p className="subtitle">Management System</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.name}
              className={`nav-item ${tab === item.name ? 'active' : ''}`}
              onClick={() => setTab(item.name)}
            >
              <span className="nav-icon">{Icon({ name: item.icon })}</span>
              <span className="nav-label">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-content">
            <h1>{tab}</h1>
            <p>Property Preservation & BPO Management System</p>
          </div>
          <div className="header-actions">
            <span className="user-info">👤 {user?.name || 'User'}</span>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Logout
            </button>
            <button className="btn-primary" onClick={load}>
              🔄 Refresh
            </button>
          </div>
        </header>

        <div className="content">
          {tab === 'Dashboard' && data && (
            <>
              {/* Key Metrics */}
              <section className="section">
                <h2 className="section-title">💡 Key Metrics & Performance</h2>
                <div className="stats-grid">
                  <StatCard label="Total Clients" value={data.clients} icon="users" color="blue" />
                  <StatCard label="Properties" value={data.properties} icon="home" color="green" />
                  <StatCard label="Work Orders" value={data.work_orders} icon="briefcase" color="orange" />
                  <StatCard label="Vendors" value={data.vendors} icon="tool" color="purple" />
                  <StatCard label="QA Reviews" value={data.qa_reviews} icon="check" color="red" />
                  <StatCard label="Documents" value={data.documents} icon="file" color="indigo" />
                </div>
              </section>

              {/* System Alerts */}
              <section className="section">
                <h2 className="section-title">⚡ System Alerts & Notifications</h2>
                <div className="alerts-container">
                  <div className="alert alert-warning">
                    <span className="alert-icon">⚠️</span>
                    <div className="alert-content">
                      <p className="alert-title">Pending QA Reviews</p>
                      <p className="alert-message">5 work orders awaiting quality review</p>
                    </div>
                  </div>
                  <div className="alert alert-info">
                    <span className="alert-icon">ℹ️</span>
                    <div className="alert-content">
                      <p className="alert-title">Overdue Tasks</p>
                      <p className="alert-message">2 tasks have exceeded their deadlines</p>
                    </div>
                  </div>
                  <div className="alert alert-success">
                    <span className="alert-icon">✅</span>
                    <div className="alert-content">
                      <p className="alert-title">Completion Rate</p>
                      <p className="alert-message">87% of scheduled work completed on time</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Performance Metrics */}
              <section className="section">
                <h2 className="section-title">📊 Performance Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Completion Rate</h3>
                      <span className="metric-value">87%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '87%'}}></div>
                    </div>
                    <p className="metric-label">On-time completion</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Average Response Time</h3>
                      <span className="metric-value">2.4h</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '70%'}}></div>
                    </div>
                    <p className="metric-label">Faster than industry standard</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Client Satisfaction</h3>
                      <span className="metric-value">4.8/5</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '96%'}}></div>
                    </div>
                    <p className="metric-label">⭐ Excellent ratings</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Active Properties</h3>
                      <span className="metric-value">{Math.floor(data.properties * 0.75)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '75%'}}></div>
                    </div>
                    <p className="metric-label">75% utilization rate</p>
                  </div>
                </div>
              </section>

              {/* Financial Overview */}
              <section className="section">
                <h2 className="section-title">💰 Financial Overview</h2>
                <div className="financial-grid">
                  <div className="financial-card">
                    <p className="financial-label">Total Revenue</p>
                    <p className="financial-amount">$234,567</p>
                    <p className="financial-change positive">↑ 12% from last month</p>
                  </div>
                  <div className="financial-card">
                    <p className="financial-label">Operating Costs</p>
                    <p className="financial-amount">$45,200</p>
                    <p className="financial-change negative">↓ 5% reduction</p>
                  </div>
                  <div className="financial-card">
                    <p className="financial-label">Net Profit</p>
                    <p className="financial-amount">$189,367</p>
                    <p className="financial-change positive">↑ 18% growth</p>
                  </div>
                  <div className="financial-card">
                    <p className="financial-label">Budget Utilization</p>
                    <p className="financial-amount">78%</p>
                    <p className="financial-change">Within limits</p>
                  </div>
                </div>
              </section>

              {/* Workflow Process */}
              <section className="section">
                <h2 className="section-title">🔄 Workflow Process</h2>
                <div className="workflow">
                  <div className="workflow-step">
                    <span className="workflow-icon">1</span>
                    <p>Client</p>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <span className="workflow-icon">2</span>
                    <p>Work Order</p>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <span className="workflow-icon">3</span>
                    <p>Dispatch</p>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <span className="workflow-icon">4</span>
                    <p>Vendor</p>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <span className="workflow-icon">5</span>
                    <p>QA Review</p>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <span className="workflow-icon">6</span>
                    <p>Complete</p>
                  </div>
                </div>
              </section>

              {/* Top Clients & Vendors */}
              <section className="section">
                <h2 className="section-title">👥 Top Clients & Vendors</h2>
                <div className="two-column-grid">
                  <div>
                    <h3 className="subsection-title">Top Clients</h3>
                    <div className="ranking-list">
                      <div className="ranking-item">
                        <span className="rank-number">1</span>
                        <div className="rank-content">
                          <p className="rank-name">ABC Properties Corp</p>
                          <p className="rank-detail">45 active orders</p>
                        </div>
                        <span className="rank-value">$89K</span>
                      </div>
                      <div className="ranking-item">
                        <span className="rank-number">2</span>
                        <div className="rank-content">
                          <p className="rank-name">Premier Real Estate</p>
                          <p className="rank-detail">38 active orders</p>
                        </div>
                        <span className="rank-value">$76K</span>
                      </div>
                      <div className="ranking-item">
                        <span className="rank-number">3</span>
                        <div className="rank-content">
                          <p className="rank-name">Urban Development Inc</p>
                          <p className="rank-detail">32 active orders</p>
                        </div>
                        <span className="rank-value">$54K</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="subsection-title">Top Vendors</h3>
                    <div className="ranking-list">
                      <div className="ranking-item">
                        <span className="rank-number">1</span>
                        <div className="rank-content">
                          <p className="rank-name">Elite Maintenance Co</p>
                          <p className="rank-detail">94% completion rate</p>
                        </div>
                        <span className="rank-value">125 jobs</span>
                      </div>
                      <div className="ranking-item">
                        <span className="rank-number">2</span>
                        <div className="rank-content">
                          <p className="rank-name">Pro Services LLC</p>
                          <p className="rank-detail">91% completion rate</p>
                        </div>
                        <span className="rank-value">108 jobs</span>
                      </div>
                      <div className="ranking-item">
                        <span className="rank-number">3</span>
                        <div className="rank-content">
                          <p className="rank-name">Quality Repairs Group</p>
                          <p className="rank-detail">88% completion rate</p>
                        </div>
                        <span className="rank-value">95 jobs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Upcoming Deadlines */}
              <section className="section">
                <h2 className="section-title">🗓️ Upcoming Deadlines & Tasks</h2>
                <div className="timeline-list">
                  <div className="timeline-item urgent">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <p className="timeline-time">Today, 3:00 PM</p>
                      <p className="timeline-task">Property #2847 - Final QA Inspection</p>
                      <p className="timeline-status">URGENT</p>
                    </div>
                  </div>
                  <div className="timeline-item upcoming">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <p className="timeline-time">Tomorrow, 10:00 AM</p>
                      <p className="timeline-task">Client meeting - Project Review</p>
                      <p className="timeline-status">SCHEDULED</p>
                    </div>
                  </div>
                  <div className="timeline-item upcoming">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <p className="timeline-time">Sep 3, 2:30 PM</p>
                      <p className="timeline-task">Vendor payment batch processing</p>
                      <p className="timeline-status">PENDING</p>
                    </div>
                  </div>
                  <div className="timeline-item upcoming">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <p className="timeline-time">Sep 5, 9:00 AM</p>
                      <p className="timeline-task">Property #2901 - Work Order Assigned</p>
                      <p className="timeline-status">UPCOMING</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recent Activity Feed */}
              {orders.length > 0 && (
                <section className="section">
                  <h2 className="section-title">📋 Recent Activity Feed</h2>
                  <div className="activity-feed">
                    {orders.slice(0, 6).map((order, idx) => (
                      <div key={order.id} className="activity-item">
                        <div className="activity-icon">📌</div>
                        <div className="activity-info">
                          <p className="activity-text">
                            Work Order #{order.id} - <strong>{order.status}</strong>
                          </p>
                          <p className="activity-time">{2 - idx} hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Team Performance */}
              <section className="section">
                <h2 className="section-title">👤 Team Performance</h2>
                <div className="team-performance">
                  <div className="team-member">
                    <p className="member-name">John Smith - Dispatch Manager</p>
                    <p className="member-stat">156 orders processed | Efficiency: 94%</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '94%'}}></div>
                    </div>
                  </div>
                  <div className="team-member">
                    <p className="member-name">Sarah Johnson - QA Supervisor</p>
                    <p className="member-stat">124 reviews completed | Accuracy: 98%</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '98%'}}></div>
                    </div>
                  </div>
                  <div className="team-member">
                    <p className="member-name">Mike Chen - Operations Lead</p>
                    <p className="member-stat">89 assignments made | Success Rate: 91%</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '91%'}}></div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {tab === 'Properties' && (
            <>
              <section className="section">
                <h2 className="section-title">Add New Property</h2>
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="client">Client ID</label>
                      <input
                        id="client"
                        name="client"
                        type="number"
                        value={form.client}
                        onChange={handleChange}
                        placeholder="Enter Client ID"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Property Address"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="property_type">Property Type</label>
                      <select
                        id="property_type"
                        name="property_type"
                        value={form.property_type}
                        onChange={handleChange}
                      >
                        <option>House</option>
                        <option>Apartment</option>
                        <option>Commercial</option>
                        <option>Industrial</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Pending</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="details">Details</label>
                    <textarea
                      id="details"
                      name="details"
                      value={form.details}
                      onChange={handleChange}
                      placeholder="Additional property details..."
                      rows="4"
                    />
                  </div>
                  <button type="submit" className="btn-success" disabled={saving}>
                    {saving ? '⏳ Saving...' : '✓ Add Property'}
                  </button>
                </form>
              </section>

              <section className="section">
                <h2 className="section-title">Properties ({properties.length})</h2>
                <div className="properties-grid">
                  {properties.map(prop => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              </section>
            </>
          )}

          {tab === 'Work Orders' && (
            <section className="section">
              <h2 className="section-title">Work Orders ({orders.length})</h2>
              <div className="work-orders-list">
                {orders.map(order => (
                  <WorkOrderItem key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}

          {tab === 'Clients' && (
            <>
              <section className="section">
                <h2 className="section-title">➕ Add New Client</h2>
                <form className="form" onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.client_name || !form.client_email) return;
                  setSaving(true);
                  post('/clients/', {
                    name: form.client_name,
                    email: form.client_email,
                    phone: form.client_phone,
                    address: form.client_address,
                    status: form.client_status
                  })
                    .then(() => {
                      setSaving(false);
                      setForm({ ...form, client_name: '', client_email: '', client_phone: '', client_address: '', client_status: 'Active' });
                      load();
                    })
                    .catch(() => setSaving(false));
                }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="client_name">Client Name *</label>
                      <input
                        id="client_name"
                        type="text"
                        value={form.client_name || ''}
                        onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                        placeholder="Enter client name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="client_email">Email *</label>
                      <input
                        id="client_email"
                        type="email"
                        value={form.client_email || ''}
                        onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                        placeholder="client@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="client_phone">Phone</label>
                      <input
                        id="client_phone"
                        type="tel"
                        value={form.client_phone || ''}
                        onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="client_address">Address</label>
                      <input
                        id="client_address"
                        type="text"
                        value={form.client_address || ''}
                        onChange={(e) => setForm({ ...form, client_address: e.target.value })}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="client_status">Status</label>
                      <select
                        id="client_status"
                        value={form.client_status || 'Active'}
                        onChange={(e) => setForm({ ...form, client_status: e.target.value })}
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Pending</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-success" disabled={saving}>
                    {saving ? '⏳ Saving...' : '✓ Add Client'}
                  </button>
                </form>
              </section>

              {/* Clients Table */}
              <section className="section">
                <h2 className="section-title">👥 Clients List ({(data?.clients || 0) + (properties.length > 0 ? 5 : 0)})</h2>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Client Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Properties</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Paramount Real Estate</strong></td>
                        <td>contact@paramount.com</td>
                        <td>(555) 111-1111</td>
                        <td>Los Angeles, CA</td>
                        <td><span className="rating">8 Properties</span></td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>Urban Properties Group</strong></td>
                        <td>info@urbanprop.com</td>
                        <td>(555) 222-2222</td>
                        <td>San Francisco, CA</td>
                        <td><span className="rating">6 Properties</span></td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>Capital Investments LLC</strong></td>
                        <td>admin@capitalinv.com</td>
                        <td>(555) 333-3333</td>
                        <td>Denver, CO</td>
                        <td><span className="rating">5 Properties</span></td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>Midwest Realty Partners</strong></td>
                        <td>team@midwestrp.com</td>
                        <td>(555) 444-4444</td>
                        <td>Chicago, IL</td>
                        <td><span className="rating">4 Properties</span></td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>Sunrise Development</strong></td>
                        <td>hello@sunrisedv.com</td>
                        <td>(555) 555-5555</td>
                        <td>Miami, FL</td>
                        <td><span className="rating">3 Properties</span></td>
                        <td><span className="status-badge status-inactive">Inactive</span></td>
                        <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Client Performance */}
              <section className="section">
                <h2 className="section-title">📊 Top Clients Performance</h2>
                <div className="vendor-performance-grid">
                  <div className="vendor-card">
                    <div className="vendor-header">
                      <h3>Paramount Real Estate</h3>
                      <span className="rating-large">⭐ 4.9</span>
                    </div>
                    <div className="vendor-stats">
                      <div className="stat-item">
                        <p className="stat-label">Active Properties</p>
                        <p className="stat-value">8</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Total Spend</p>
                        <p className="stat-value">$125K</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Satisfaction</p>
                        <p className="stat-value">4.9/5</p>
                      </div>
                    </div>
                    <div className="vendor-area">Partnership since 2020</div>
                  </div>

                  <div className="vendor-card">
                    <div className="vendor-header">
                      <h3>Urban Properties Group</h3>
                      <span className="rating-large">⭐ 4.7</span>
                    </div>
                    <div className="vendor-stats">
                      <div className="stat-item">
                        <p className="stat-label">Active Properties</p>
                        <p className="stat-value">6</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Total Spend</p>
                        <p className="stat-value">$98K</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Satisfaction</p>
                        <p className="stat-value">4.7/5</p>
                      </div>
                    </div>
                    <div className="vendor-area">Partnership since 2021</div>
                  </div>

                  <div className="vendor-card">
                    <div className="vendor-header">
                      <h3>Capital Investments LLC</h3>
                      <span className="rating-large">⭐ 4.8</span>
                    </div>
                    <div className="vendor-stats">
                      <div className="stat-item">
                        <p className="stat-label">Active Properties</p>
                        <p className="stat-value">5</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Total Spend</p>
                        <p className="stat-value">$87K</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Satisfaction</p>
                        <p className="stat-value">4.8/5</p>
                      </div>
                    </div>
                    <div className="vendor-area">Partnership since 2022</div>
                  </div>
                </div>
              </section>

              {/* Client Metrics */}
              <section className="section">
                <h2 className="section-title">📈 Client Management Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Total Active Clients</h3>
                      <span className="metric-value">18</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '90%'}}></div>
                    </div>
                    <p className="metric-label">Growing portfolio</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Avg Client Satisfaction</h3>
                      <span className="metric-value">4.7/5</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '94%'}}></div>
                    </div>
                    <p className="metric-label">Excellent retention rate</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Monthly Revenue</h3>
                      <span className="metric-value">$156K</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '78%'}}></div>
                    </div>
                    <p className="metric-label">From active clients</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Avg Response Time</h3>
                      <span className="metric-value">1.2h</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '95%'}}></div>
                    </div>
                    <p className="metric-label">Excellent client service</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {tab === 'Vendors' && (
            <>
              <section className="section">
                <h2 className="section-title">➕ Add New Vendor</h2>
                <form className="form" onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.name || !form.service_area) return;
                  setSaving(true);
                  post('/vendors/', {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    service_area: form.service_area,
                    rating: parseFloat(form.rating) || 0,
                    status: form.status
                  })
                    .then(() => {
                      setSaving(false);
                      setForm({ name: '', email: '', phone: '', service_area: '', rating: '5.0', status: 'Active' });
                      load();
                    })
                    .catch(() => setSaving(false));
                }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="vendor_name">Vendor Name *</label>
                      <input
                        id="vendor_name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter vendor name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor_email">Email</label>
                      <input
                        id="vendor_email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="vendor@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor_phone">Phone</label>
                      <input
                        id="vendor_phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor_service_area">Service Area *</label>
                      <input
                        id="vendor_service_area"
                        type="text"
                        value={form.service_area}
                        onChange={(e) => setForm({ ...form, service_area: e.target.value })}
                        placeholder="e.g., North County, Downtown"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor_rating">Rating (0-5)</label>
                      <input
                        id="vendor_rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                        placeholder="5.0"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor_status">Status</label>
                      <select
                        id="vendor_status"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Suspended</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-success" disabled={saving}>
                    {saving ? '⏳ Saving...' : '✓ Add Vendor'}
                  </button>
                </form>
              </section>

              {/* Vendors Table */}
              <section className="section">
                <h2 className="section-title">👥 Vendors List ({(data?.vendors || 0) + (orders.length > 0 ? 3 : 0)})</h2>
                {orders && orders.length > 0 ? (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Vendor Name</th>
                          <th>Service Area</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Rating</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Sample vendors */}
                        <tr>
                          <td><strong>Elite Maintenance Co</strong></td>
                          <td>North County</td>
                          <td>info@elite.com</td>
                          <td>(555) 123-4567</td>
                          <td><span className="rating">⭐ 4.8</span></td>
                          <td><span className="status-badge status-active">Active</span></td>
                          <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                        </tr>
                        <tr>
                          <td><strong>Pro Services LLC</strong></td>
                          <td>Downtown</td>
                          <td>contact@proservices.com</td>
                          <td>(555) 234-5678</td>
                          <td><span className="rating">⭐ 4.6</span></td>
                          <td><span className="status-badge status-active">Active</span></td>
                          <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                        </tr>
                        <tr>
                          <td><strong>Quality Repairs Group</strong></td>
                          <td>Suburbs</td>
                          <td>support@qualityrepairs.com</td>
                          <td>(555) 345-6789</td>
                          <td><span className="rating">⭐ 4.5</span></td>
                          <td><span className="status-badge status-active">Active</span></td>
                          <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                        </tr>
                        <tr>
                          <td><strong>BuildPro Contractors</strong></td>
                          <td>East Side</td>
                          <td>hello@buildpro.com</td>
                          <td>(555) 456-7890</td>
                          <td><span className="rating">⭐ 4.3</span></td>
                          <td><span className="status-badge status-active">Active</span></td>
                          <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                        </tr>
                        <tr>
                          <td><strong>Swift Repairs Inc</strong></td>
                          <td>West Valley</td>
                          <td>service@swiftrepairs.com</td>
                          <td>(555) 567-8901</td>
                          <td><span className="rating">⭐ 4.2</span></td>
                          <td><span className="status-badge status-inactive">Inactive</span></td>
                          <td><button className="btn-action edit">Edit</button> <button className="btn-action delete">Delete</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="placeholder">Loading vendors data...</p>
                )}
              </section>

              {/* Vendor Performance Overview */}
              <section className="section">
                <h2 className="section-title">📊 Vendor Performance Overview</h2>
                <div className="vendor-performance-grid">
                  <div className="vendor-card">
                    <div className="vendor-header">
                      <h3>Elite Maintenance Co</h3>
                      <span className="rating-large">⭐ 4.8</span>
                    </div>
                    <div className="vendor-stats">
                      <div className="stat-item">
                        <p className="stat-label">Completed Jobs</p>
                        <p className="stat-value">125</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">On-Time Rate</p>
                        <p className="stat-value">96%</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Quality Score</p>
                        <p className="stat-value">4.8/5</p>
                      </div>
                    </div>
                    <div className="vendor-area">Service Area: North County</div>
                  </div>

                  <div className="vendor-card">
                    <div className="vendor-header">
                      <h3>Pro Services LLC</h3>
                      <span className="rating-large">⭐ 4.6</span>
                    </div>
                    <div className="vendor-stats">
                      <div className="stat-item">
                        <p className="stat-label">Completed Jobs</p>
                        <p className="stat-value">108</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">On-Time Rate</p>
                        <p className="stat-value">93%</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Quality Score</p>
                        <p className="stat-value">4.6/5</p>
                      </div>
                    </div>
                    <div className="vendor-area">Service Area: Downtown</div>
                  </div>

                  <div className="vendor-card">
                    <div className="vendor-header">
                      <h3>Quality Repairs Group</h3>
                      <span className="rating-large">⭐ 4.5</span>
                    </div>
                    <div className="vendor-stats">
                      <div className="stat-item">
                        <p className="stat-label">Completed Jobs</p>
                        <p className="stat-value">95</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">On-Time Rate</p>
                        <p className="stat-value">91%</p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Quality Score</p>
                        <p className="stat-value">4.5/5</p>
                      </div>
                    </div>
                    <div className="vendor-area">Service Area: Suburbs</div>
                  </div>
                </div>
              </section>

              {/* Vendor Statistics */}
              <section className="section">
                <h2 className="section-title">📈 Key Vendor Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Total Active Vendors</h3>
                      <span className="metric-value">12</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '80%'}}></div>
                    </div>
                    <p className="metric-label">Operational capacity at 80%</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Avg. Completion Rate</h3>
                      <span className="metric-value">94%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '94%'}}></div>
                    </div>
                    <p className="metric-label">Above industry standard</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Avg. Quality Rating</h3>
                      <span className="metric-value">4.6/5</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '92%'}}></div>
                    </div>
                    <p className="metric-label">Excellent vendor performance</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Avg. Response Time</h3>
                      <span className="metric-value">2.1h</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '85%'}}></div>
                    </div>
                    <p className="metric-label">Quick service availability</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {tab === 'QA Review' && (
            <>
              <section className="section">
                <h2 className="section-title">➕ Add New QA Review</h2>
                <form className="form" onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.qa_work_order || !form.qa_reviewer) return;
                  setSaving(true);
                  post('/qa-reviews/', {
                    work_order_id: form.qa_work_order,
                    reviewer: form.qa_reviewer,
                    rating: parseFloat(form.qa_rating) || 5,
                    comments: form.qa_comments,
                    status: form.qa_status
                  })
                    .then(() => {
                      setSaving(false);
                      setForm({ ...form, qa_work_order: '', qa_reviewer: '', qa_rating: '5.0', qa_comments: '', qa_status: 'Pass' });
                      load();
                    })
                    .catch(() => setSaving(false));
                }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="qa_work_order">Work Order ID *</label>
                      <input
                        id="qa_work_order"
                        type="number"
                        value={form.qa_work_order || ''}
                        onChange={(e) => setForm({ ...form, qa_work_order: e.target.value })}
                        placeholder="Enter work order ID"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="qa_reviewer">Reviewer Name *</label>
                      <input
                        id="qa_reviewer"
                        type="text"
                        value={form.qa_reviewer || ''}
                        onChange={(e) => setForm({ ...form, qa_reviewer: e.target.value })}
                        placeholder="QA reviewer name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="qa_rating">Quality Rating (1-5)</label>
                      <input
                        id="qa_rating"
                        type="number"
                        min="1"
                        max="5"
                        value={form.qa_rating || '5'}
                        onChange={(e) => setForm({ ...form, qa_rating: e.target.value })}
                        placeholder="5.0"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="qa_status">Review Status</label>
                      <select
                        id="qa_status"
                        value={form.qa_status || 'Pass'}
                        onChange={(e) => setForm({ ...form, qa_status: e.target.value })}
                      >
                        <option>Pass</option>
                        <option>Fail</option>
                        <option>Conditional Pass</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="qa_comments">Comments</label>
                    <textarea
                      id="qa_comments"
                      value={form.qa_comments || ''}
                      onChange={(e) => setForm({ ...form, qa_comments: e.target.value })}
                      placeholder="QA review comments..."
                      rows="3"
                    />
                  </div>
                  <button type="submit" className="btn-success" disabled={saving}>
                    {saving ? '⏳ Saving...' : '✓ Submit Review'}
                  </button>
                </form>
              </section>

              {/* QA Reviews Table */}
              <section className="section">
                <h2 className="section-title">✅ QA Reviews List ({(qaReviews.length || 0) + (data?.qa_reviews || 0)})</h2>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Work Order</th>
                        <th>Reviewer</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Comments</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>#WO-2024-001</strong></td>
                        <td>Sarah Johnson</td>
                        <td><span className="rating">⭐ 5.0</span></td>
                        <td><span className="status-badge status-active">Pass</span></td>
                        <td>Excellent work quality and timely completion</td>
                        <td>2024-12-28</td>
                        <td><button className="btn-action edit">View</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>#WO-2024-002</strong></td>
                        <td>Michael Chen</td>
                        <td><span className="rating">⭐ 4.5</span></td>
                        <td><span className="status-badge status-active">Pass</span></td>
                        <td>Good quality with minor improvements needed</td>
                        <td>2024-12-27</td>
                        <td><button className="btn-action edit">View</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>#WO-2024-003</strong></td>
                        <td>Lisa Rodriguez</td>
                        <td><span className="rating">⭐ 3.5</span></td>
                        <td><span className="status-badge" style={{background: 'rgba(249,115,22,0.2)', color: '#f59e0b', border: '1px solid rgba(249,115,22,0.3)'}}>Conditional Pass</span></td>
                        <td>Requires rework on finishing details</td>
                        <td>2024-12-26</td>
                        <td><button className="btn-action edit">View</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>#WO-2024-004</strong></td>
                        <td>James Williams</td>
                        <td><span className="rating">⭐ 2.0</span></td>
                        <td><span className="status-badge" style={{background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)'}}>Fail</span></td>
                        <td>Quality issues - redo entire section required</td>
                        <td>2024-12-25</td>
                        <td><button className="btn-action edit">View</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>#WO-2024-005</strong></td>
                        <td>Emma Davis</td>
                        <td><span className="rating">⭐ 4.8</span></td>
                        <td><span className="status-badge status-active">Pass</span></td>
                        <td>Outstanding work, exceeds expectations</td>
                        <td>2024-12-24</td>
                        <td><button className="btn-action edit">View</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* QA Metrics */}
              <section className="section">
                <h2 className="section-title">📊 QA Performance Dashboard</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Total Reviews Completed</h3>
                      <span className="metric-value">247</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '98%'}}></div>
                    </div>
                    <p className="metric-label">This month</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Pass Rate</h3>
                      <span className="metric-value">92%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '92%'}}></div>
                    </div>
                    <p className="metric-label">First-time passes</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Average Quality Score</h3>
                      <span className="metric-value">4.6/5</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '92%'}}></div>
                    </div>
                    <p className="metric-label">Consistently excellent</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Avg Review Time</h3>
                      <span className="metric-value">1.8h</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '72%'}}></div>
                    </div>
                    <p className="metric-label">Quick turnaround</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {tab === 'Documents' && (
            <>
              <section className="section">
                <h2 className="section-title">📤 Upload New Document</h2>
                <form className="form" onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.doc_name || !form.doc_type) return;
                  setSaving(true);
                  post('/documents/', {
                    name: form.doc_name,
                    document_type: form.doc_type,
                    work_order_id: form.doc_work_order || null,
                    description: form.doc_description,
                    status: form.doc_status
                  })
                    .then(() => {
                      setSaving(false);
                      setForm({ ...form, doc_name: '', doc_type: 'Report', doc_work_order: '', doc_description: '', doc_status: 'Active' });
                      load();
                    })
                    .catch(() => setSaving(false));
                }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="doc_name">Document Name *</label>
                      <input
                        id="doc_name"
                        type="text"
                        value={form.doc_name || ''}
                        onChange={(e) => setForm({ ...form, doc_name: e.target.value })}
                        placeholder="Document title"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="doc_type">Document Type *</label>
                      <select
                        id="doc_type"
                        value={form.doc_type || 'Report'}
                        onChange={(e) => setForm({ ...form, doc_type: e.target.value })}
                      >
                        <option>Report</option>
                        <option>Invoice</option>
                        <option>Contract</option>
                        <option>Photo</option>
                        <option>Certificate</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="doc_work_order">Related Work Order</label>
                      <input
                        id="doc_work_order"
                        type="number"
                        value={form.doc_work_order || ''}
                        onChange={(e) => setForm({ ...form, doc_work_order: e.target.value })}
                        placeholder="Work order ID (optional)"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="doc_status">Status</label>
                      <select
                        id="doc_status"
                        value={form.doc_status || 'Active'}
                        onChange={(e) => setForm({ ...form, doc_status: e.target.value })}
                      >
                        <option>Active</option>
                        <option>Archived</option>
                        <option>Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="doc_description">Description</label>
                    <textarea
                      id="doc_description"
                      value={form.doc_description || ''}
                      onChange={(e) => setForm({ ...form, doc_description: e.target.value })}
                      placeholder="Document description..."
                      rows="3"
                    />
                  </div>
                  <button type="submit" className="btn-success" disabled={saving}>
                    {saving ? '⏳ Uploading...' : '✓ Upload Document'}
                  </button>
                </form>
              </section>

              {/* Documents Table */}
              <section className="section">
                <h2 className="section-title">📄 Documents Library ({(data?.documents || 0) + 8})</h2>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>Type</th>
                        <th>Related Work Order</th>
                        <th>Size</th>
                        <th>Uploaded</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>📋 Inspection Report - Property 42</strong></td>
                        <td><span className="rating">Report</span></td>
                        <td>#WO-2024-042</td>
                        <td>2.4 MB</td>
                        <td>2024-12-28</td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>💰 Invoice - Labor Services</strong></td>
                        <td><span className="rating">Invoice</span></td>
                        <td>#WO-2024-040</td>
                        <td>1.2 MB</td>
                        <td>2024-12-27</td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>📑 Service Agreement - Paramount</strong></td>
                        <td><span className="rating">Contract</span></td>
                        <td>#WO-2024-038</td>
                        <td>3.1 MB</td>
                        <td>2024-12-26</td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>📸 Before & After Photos</strong></td>
                        <td><span className="rating">Photo</span></td>
                        <td>#WO-2024-035</td>
                        <td>15.8 MB</td>
                        <td>2024-12-25</td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>✅ Work Completion Certificate</strong></td>
                        <td><span className="rating">Certificate</span></td>
                        <td>#WO-2024-032</td>
                        <td>0.9 MB</td>
                        <td>2024-12-24</td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>📊 Monthly Report - December</strong></td>
                        <td><span className="rating">Report</span></td>
                        <td>—</td>
                        <td>4.5 MB</td>
                        <td>2024-12-23</td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>📄 Insurance Claim Form</strong></td>
                        <td><span className="rating">Other</span></td>
                        <td>#WO-2024-028</td>
                        <td>2.1 MB</td>
                        <td>2024-12-22</td>
                        <td><span className="status-badge" style={{background: 'rgba(107,114,128,0.2)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.3)'}}>Archived</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>📋 Draft - Q1 Planning</strong></td>
                        <td><span className="rating">Report</span></td>
                        <td>—</td>
                        <td>1.8 MB</td>
                        <td>2024-12-21</td>
                        <td><span className="status-badge" style={{background: 'rgba(107,114,128,0.2)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.3)'}}>Draft</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Document Statistics */}
              <section className="section">
                <h2 className="section-title">📊 Document Management Analytics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Total Documents</h3>
                      <span className="metric-value">156</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '78%'}}></div>
                    </div>
                    <p className="metric-label">All document types</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Storage Used</h3>
                      <span className="metric-value">487 MB</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '49%'}}></div>
                    </div>
                    <p className="metric-label">Of 1 GB quota</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Recent Uploads</h3>
                      <span className="metric-value">24</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '85%'}}></div>
                    </div>
                    <p className="metric-label">This month</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Document Retention</h3>
                      <span className="metric-value">98%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '98%'}}></div>
                    </div>
                    <p className="metric-label">Compliance maintained</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {tab === 'Reports' && (
            <>
              <section className="section">
                <h2 className="section-title">📈 Generate New Report</h2>
                <form className="form" onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.report_type) return;
                  setSaving(true);
                  post('/reports/', {
                    report_type: form.report_type,
                    start_date: form.report_start || null,
                    end_date: form.report_end || null,
                    filters: form.report_filters || '',
                    format: form.report_format || 'PDF'
                  })
                    .then(() => {
                      setSaving(false);
                      setForm({ ...form, report_type: 'Performance', report_start: '', report_end: '', report_filters: '', report_format: 'PDF' });
                      load();
                    })
                    .catch(() => setSaving(false));
                }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="report_type">Report Type *</label>
                      <select
                        id="report_type"
                        value={form.report_type || 'Performance'}
                        onChange={(e) => setForm({ ...form, report_type: e.target.value })}
                      >
                        <option>Performance</option>
                        <option>Financial</option>
                        <option>Operational</option>
                        <option>Quality Assurance</option>
                        <option>Client Satisfaction</option>
                        <option>Vendor Performance</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="report_start">Start Date</label>
                      <input
                        id="report_start"
                        type="date"
                        value={form.report_start || ''}
                        onChange={(e) => setForm({ ...form, report_start: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="report_end">End Date</label>
                      <input
                        id="report_end"
                        type="date"
                        value={form.report_end || ''}
                        onChange={(e) => setForm({ ...form, report_end: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="report_format">Export Format</label>
                      <select
                        id="report_format"
                        value={form.report_format || 'PDF'}
                        onChange={(e) => setForm({ ...form, report_format: e.target.value })}
                      >
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>CSV</option>
                        <option>JSON</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="report_filters">Additional Filters</label>
                    <textarea
                      id="report_filters"
                      value={form.report_filters || ''}
                      onChange={(e) => setForm({ ...form, report_filters: e.target.value })}
                      placeholder="e.g., Filter by client, vendor, status..."
                      rows="3"
                    />
                  </div>
                  <button type="submit" className="btn-success" disabled={saving}>
                    {saving ? '⏳ Generating...' : '✓ Generate Report'}
                  </button>
                </form>
              </section>

              {/* Reports List */}
              <section className="section">
                <h2 className="section-title">📊 Recent Reports ({(data?.reports || 0) + 8})</h2>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Report Name</th>
                        <th>Type</th>
                        <th>Period</th>
                        <th>Format</th>
                        <th>Generated</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>📈 December Performance Report</strong></td>
                        <td><span className="rating">Performance</span></td>
                        <td>Dec 1 - Dec 31, 2024</td>
                        <td>PDF</td>
                        <td>2024-12-28</td>
                        <td><span className="status-badge status-active">Complete</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>💰 Q4 Financial Summary</strong></td>
                        <td><span className="rating">Financial</span></td>
                        <td>Oct 1 - Dec 31, 2024</td>
                        <td>Excel</td>
                        <td>2024-12-27</td>
                        <td><span className="status-badge status-active">Complete</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>🏭 Operational Efficiency Report</strong></td>
                        <td><span className="rating">Operational</span></td>
                        <td>Dec 1 - Dec 31, 2024</td>
                        <td>PDF</td>
                        <td>2024-12-26</td>
                        <td><span className="status-badge status-active">Complete</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>✅ Quality Assurance Metrics</strong></td>
                        <td><span className="rating">Quality Assurance</span></td>
                        <td>Dec 1 - Dec 31, 2024</td>
                        <td>CSV</td>
                        <td>2024-12-25</td>
                        <td><span className="status-badge status-active">Complete</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>😊 Client Satisfaction Survey</strong></td>
                        <td><span className="rating">Client Satisfaction</span></td>
                        <td>Dec 1 - Dec 31, 2024</td>
                        <td>PDF</td>
                        <td>2024-12-24</td>
                        <td><span className="status-badge status-active">Complete</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>🤝 Vendor Performance Analysis</strong></td>
                        <td><span className="rating">Vendor Performance</span></td>
                        <td>Dec 1 - Dec 31, 2024</td>
                        <td>Excel</td>
                        <td>2024-12-23</td>
                        <td><span className="status-badge status-active">Complete</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>📈 Year-to-Date Summary</strong></td>
                        <td><span className="rating">Performance</span></td>
                        <td>Jan 1 - Dec 31, 2024</td>
                        <td>PDF</td>
                        <td>2024-12-22</td>
                        <td><span className="status-badge status-active">Complete</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                      <tr>
                        <td><strong>📊 November Trends Analysis</strong></td>
                        <td><span className="rating">Operational</span></td>
                        <td>Nov 1 - Nov 30, 2024</td>
                        <td>JSON</td>
                        <td>2024-12-20</td>
                        <td><span className="status-badge" style={{background: 'rgba(107,114,128,0.2)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.3)'}}>Archived</span></td>
                        <td><button className="btn-action edit">Download</button> <button className="btn-action delete">Delete</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Report Statistics */}
              <section className="section">
                <h2 className="section-title">📈 Reporting Analytics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Reports Generated</h3>
                      <span className="metric-value">847</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '85%'}}></div>
                    </div>
                    <p className="metric-label">Year-to-date total</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Avg Generation Time</h3>
                      <span className="metric-value">3.2s</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '96%'}}></div>
                    </div>
                    <p className="metric-label">Fast and efficient</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Most Popular Format</h3>
                      <span className="metric-value">PDF</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '68%'}}></div>
                    </div>
                    <p className="metric-label">68% of all reports</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Data Accuracy</h3>
                      <span className="metric-value">99.8%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '99.8%'}}></div>
                    </div>
                    <p className="metric-label">Verified and audited</p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
