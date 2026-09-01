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

// Main App Component
function App() {
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

  const load = () => Promise.all([
    get('/dashboard/'),
    get('/work-orders/'),
    get('/properties/'),
    get('/qa-reviews/')
  ]).then(([a, b, c, e]) => {
    setData(a);
    setOrders(b);
    setProperties(c);
    setQaReviews(e);
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

  return (
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
          <button className="btn-primary" onClick={load}>
            🔄 Refresh
          </button>
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
            <section className="section">
              <h2 className="section-title">Clients Management</h2>
              <p className="placeholder">Clients data will be displayed here</p>
            </section>
          )}

          {tab === 'Vendors' && (
            <section className="section">
              <h2 className="section-title">Vendors Management</h2>
              <p className="placeholder">Vendors data will be displayed here</p>
            </section>
          )}

          {tab === 'QA Review' && (
            <section className="section">
              <h2 className="section-title">QA Reviews ({qaReviews.length})</h2>
              <p className="placeholder">QA Review data will be displayed here</p>
            </section>
          )}

          {tab === 'Documents' && (
            <section className="section">
              <h2 className="section-title">Documents</h2>
              <p className="placeholder">Documents will be displayed here</p>
            </section>
          )}

          {tab === 'Reports' && (
            <section className="section">
              <h2 className="section-title">Reports & Analytics</h2>
              <p className="placeholder">Reports will be displayed here</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />ss" value={form.address} onChange={handleChange} placeholder="House address" required /></label><label><span>Type</span><select name="property_type" value={form.property_type} onChange={handleChange}><option>House</option><option>Apartment</option><option>Office</option><option>Commercial</option></select></label><label><span>Status</span><select name="status" value={form.status} onChange={handleChange}><option>Active</option><option>Inactive</option><option>Maintenance</option></select></label></div><label><span>Details</span><textarea name="details" value={form.details} onChange={handleChange} placeholder="Property details" /></label><button type="submit" className="submit-btn" disabled={saving}>{saving?'Saving...':'Save House'}</button></form><div className="property-grid">{properties.map(p=><div className="property-card" key={p.id}><img src={getImage(p.image)} alt={p.address} /><div className="property-body"><h3>{p.property_type || 'Property'}</h3><p>{p.address}</p><div className="property-meta"><span>{p.status}</span><strong>{p.client}</strong></div></div></div>)}</div></section>}{tab==='Work Orders'&&<section><h2>Work Orders</h2><table><thead><tr><th>ID</th><th>Title</th><th>Client</th><th>Property</th><th>Priority</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr><td>{o.id}</td><td>{o.title}</td><td>{o.client}</td><td>{o.property}</td><td>{o.priority}</td><td>{o.status}</td></tr>)}</tbody></table></section>}{tab==='QA Review'&&<section><h2>QA Review</h2><table><thead><tr><th>ID</th><th>Work Order</th><th>Reviewer</th><th>Date</th><th>Status</th><th>Comments</th></tr></thead><tbody>{qaReviews.map(q=><tr key={q.id}><td>{q.id}</td><td>{q.work_order}</td><td>{q.reviewer}</td><td>{q.review_date ? q.review_date.slice(0,10) : '-'}</td><td>{q.status}</td><td>{q.comments || '—'}</td></tr>)}</tbody></table></section>}{tab!=='Dashboard'&&tab!=='Work Orders'&&tab!=='Properties'&&tab!=='QA Review'&&<section><h2>{tab}</h2><p>Use Django Admin and the REST API to manage this module. The backend already contains the database model and CRUD API for the requirement.</p></section>}</main></div>}createRoot(document.getElementById('root')).render(<App/>);
