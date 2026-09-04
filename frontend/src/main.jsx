import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8000/api'
  : 'https://aitc-property-bpo-management-group.onrender.com/api';
const get = (p) => fetch(API + p).then(async r => {
  const body = await r.json().catch(() => null);
  if (!r.ok) throw new Error(body ? JSON.stringify(body) : 'Request failed');
  return body;
});
const post = (p, data) => fetch(API + p, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
}).then(async r => {
  const body = await r.json().catch(() => null);
  if (!r.ok) throw new Error(body ? JSON.stringify(body) : 'Request failed');
  return body;
});
const postForm = (p, data) => fetch(API + p, {
  method: 'POST',
  body: data
}).then(async r => {
  const body = await r.json().catch(() => null);
  if (!r.ok) throw new Error(body ? JSON.stringify(body) : 'Request failed');
  return body;
});
const put = (p, data) => fetch(API + p, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
}).then(async r => {
  const body = await r.json().catch(() => null);
  if (!r.ok) throw new Error(body ? JSON.stringify(body) : 'Request failed');
  return body;
});
const remove = (p) => fetch(API + p, { method: 'DELETE' }).then(r => {
  if (!r.ok) throw new Error('Request failed');
  return true;
});

const getImage = (image) => image ? `${API.replace('/api', '')}${image}` : 'https://placehold.co/600x400/edf3fb/10233f?text=Property+Image';

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
const PropertyCard = ({ property, onEdit, onDelete }) => (
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
      <div className="property-actions">
        <button type="button" className="btn-action edit" onClick={() => onEdit(property)}>Edit</button>
        <button type="button" className="btn-action delete" onClick={() => onDelete(property)}>Delete</button>
      </div>
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
  const [vendors, setVendors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);
  const [qaReviews, setQaReviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [tab, setTab] = useState('Dashboard');
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [form, setForm] = useState({
    client: '', address: '', property_type: 'House',
    details: '', status: 'Active'
  });
  const [clientForm, setClientForm] = useState({
    client_name: '', client_email: '', client_phone: '', client_address: '', client_status: 'Active'
  });
  const [editClientForm, setEditClientForm] = useState({
    client_name: '', client_email: '', client_phone: '', client_address: '', client_status: 'Active'
  });
  const [showWorkOrderForm, setShowWorkOrderForm] = useState(false);
  const [editingWorkOrderId, setEditingWorkOrderId] = useState(null);
  const [workOrderMessage, setWorkOrderMessage] = useState(null);
  const [workOrderForm, setWorkOrderForm] = useState({
    title: '', client: '', property: '', work_type: '', vendor: '', assigned_to: '',
    status: 'New', priority: 'Medium', due_date: '', description: ''
  });
  const [vendorForm, setVendorForm] = useState({ name: '', email: '', phone: '', service_area: '', status: 'Active' });
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [vendorMessage, setVendorMessage] = useState(null);
  const [editingClientId, setEditingClientId] = useState(null);
  const [clientMessage, setClientMessage] = useState(null);
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

  const load = () => Promise.allSettled([
    get('/dashboard/'),
    get('/work-orders/'),
    get('/properties/'),
    get('/qa-reviews/'),
    get('/clients/'),
    get('/vendors/'),
    get('/assignments/'),
    get('/documents/'),
    get('/reports/')
  ]).then(([dashboardResult, ordersResult, propertiesResult, qaResult, clientsResult, vendorsResult, assignmentsResult, documentsResult, reportsResult]) => {
    if (dashboardResult.status === 'fulfilled') setData(dashboardResult.value);
    if (ordersResult.status === 'fulfilled') setOrders(ordersResult.value || []);
    if (propertiesResult.status === 'fulfilled') setProperties(propertiesResult.value || []);
    if (qaResult.status === 'fulfilled') setQaReviews(qaResult.value || []);
    if (clientsResult.status === 'fulfilled') {
      setClients((clientsResult.value || []).map(client => ({ ...client, status: client.status || 'Active' })));
    }
    if (vendorsResult.status === 'fulfilled') setVendors(vendorsResult.value || []);
    if (assignmentsResult.status === 'fulfilled') setAssignments(assignmentsResult.value || []);
    if (documentsResult.status === 'fulfilled') setDocuments(documentsResult.value || []);
    if (reportsResult.status === 'fulfilled') setReports(reportsResult.value || []);
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client || !form.address) return;
    setSaving(true);
    const request = editingPropertyId
      ? put(`/properties/${editingPropertyId}/`, form)
      : post('/properties/', form);
    request
      .then(() => {
        setSaving(false);
        setForm({ client: '', address: '', property_type: 'House', details: '', status: 'Active' });
        setEditingPropertyId(null);
        load();
        setTab('Properties');
      })
      .catch(() => setSaving(false));
  };

  const handlePropertyEdit = (property) => {
    setEditingPropertyId(property.id);
    setForm({ client: String(property.client), address: property.address || '', property_type: property.property_type || 'House', details: property.details || '', status: property.status || 'Active' });
    setTab('Properties');
  };

  const handlePropertyDelete = (property) => {
    if (orders.some(order => order.property === property.id)) {
      window.alert('This property cannot be deleted while it has related Work Orders.');
      return;
    }
    if (!window.confirm(`Delete property "${property.address}"?`)) return;
    remove(`/properties/${property.id}/`).then(load);
  };

  const resetWorkOrderForm = () => {
    setWorkOrderForm({ title: '', client: '', property: '', work_type: '', vendor: '', assigned_to: '', status: 'New', priority: 'Medium', due_date: '', description: '' });
    setEditingWorkOrderId(null);
    setShowWorkOrderForm(false);
  };

  const handleWorkOrderChange = (e) => {
    const { name, value } = e.target;
    setWorkOrderForm(prev => ({ ...prev, [name]: name === 'client' ? value : value, ...(name === 'client' ? { property: '' } : {}) }));
  };

  const handleWorkOrderSubmit = (e) => {
    e.preventDefault();
    if (!workOrderForm.title.trim() || !workOrderForm.client || !workOrderForm.property) {
      setWorkOrderMessage({ type: 'error', text: 'Please complete the title, client, and property fields, then try again.' });
      return;
    }

    setSaving(true);
    const payload = {
      title: workOrderForm.title.trim(),
      client: Number(workOrderForm.client),
      property: Number(workOrderForm.property),
      work_type: workOrderForm.work_type.trim(),
      assigned_to: workOrderForm.assigned_to.trim(),
      status: workOrderForm.status,
      priority: workOrderForm.priority,
      due_date: workOrderForm.due_date || null,
      description: workOrderForm.description.trim()
    };
    const request = editingWorkOrderId
      ? put(`/work-orders/${editingWorkOrderId}/`, payload)
      : post('/work-orders/', payload);

    request.then(savedOrder => {
      const existingAssignment = assignments.find(assignment => assignment.work_order === savedOrder.id);
      let assignmentRequest = Promise.resolve(null);
      if (workOrderForm.vendor) {
        const assignmentPayload = { work_order: savedOrder.id, vendor: Number(workOrderForm.vendor), status: 'Assigned' };
        assignmentRequest = existingAssignment
          ? put(`/assignments/${existingAssignment.id}/`, assignmentPayload)
          : post('/assignments/', assignmentPayload);
      } else if (existingAssignment) {
        assignmentRequest = remove(`/assignments/${existingAssignment.id}/`);
      }
      return assignmentRequest.then(() => savedOrder);
    }).then(savedOrder => {
      setOrders(prev => editingWorkOrderId
        ? prev.map(order => order.id === editingWorkOrderId ? savedOrder : order)
        : [savedOrder, ...prev]);
      setWorkOrderMessage({ type: 'success', text: editingWorkOrderId ? 'Work order updated successfully.' : 'Work order added successfully.' });
      resetWorkOrderForm();
      load();
    }).catch(() => {
      setWorkOrderMessage({ type: 'error', text: 'Work order could not be saved. Please try again.' });
    }).finally(() => setSaving(false));
  };

  const handleWorkOrderEdit = (order) => {
    setEditingWorkOrderId(order.id);
    setShowWorkOrderForm(true);
    setWorkOrderMessage(null);
    setWorkOrderForm({
      title: order.title || '', client: String(order.client || ''), property: String(order.property || ''),
      work_type: order.work_type || '', vendor: String(assignments.find(assignment => assignment.work_order === order.id)?.vendor || ''), assigned_to: order.assigned_to || '', status: order.status || 'New',
      priority: order.priority || 'Medium', due_date: order.due_date || '', description: order.description || ''
    });
  };

  const handleWorkOrderDelete = (order) => {
    if (!window.confirm(`Delete work order "${order.title || `#${order.id}`}"?`)) return;
    remove(`/work-orders/${order.id}/`).then(() => {
      setOrders(prev => prev.filter(item => item.id !== order.id));
      setWorkOrderMessage({ type: 'success', text: 'Work order deleted successfully.' });
      load();
    }).catch(() => {
      setWorkOrderMessage({ type: 'error', text: 'Work order could not be deleted. Please try again.' });
    });
  };

  const selectedWorkOrderProperties = properties.filter(property => String(property.client) === String(workOrderForm.client));

  const resetVendorForm = () => {
    setVendorForm({ name: '', email: '', phone: '', service_area: '', status: 'Active' });
    setEditingVendorId(null);
  };

  const handleVendorSubmit = (e) => {
    e.preventDefault();
    if (!vendorForm.name.trim()) {
      setVendorMessage({ type: 'error', text: 'Please enter a vendor name, then try again.' });
      return;
    }
    setSaving(true);
    const payload = {
      name: vendorForm.name.trim(), email: vendorForm.email.trim(), phone: vendorForm.phone.trim(),
      service_area: vendorForm.service_area.trim(), status: vendorForm.status
    };
    const request = editingVendorId ? put(`/vendors/${editingVendorId}/`, payload) : post('/vendors/', payload);
    request.then(savedVendor => {
      setVendorMessage({ type: 'success', text: editingVendorId ? 'Vendor updated successfully.' : 'Vendor added successfully.' });
      setVendors(prev => editingVendorId ? prev.map(vendor => vendor.id === editingVendorId ? savedVendor : vendor) : [savedVendor, ...prev]);
      resetVendorForm();
      load();
    }).catch(() => setVendorMessage({ type: 'error', text: 'Vendor could not be saved. Please try again.' })).finally(() => setSaving(false));
  };

  const handleVendorEdit = (vendor) => {
    setEditingVendorId(vendor.id);
    setVendorMessage(null);
    setVendorForm({ name: vendor.name || '', email: vendor.email || '', phone: vendor.phone || '', service_area: vendor.service_area || '', status: vendor.status || 'Active' });
  };

  const handleVendorDelete = (vendor) => {
    if (assignments.some(assignment => assignment.vendor === vendor.id)) {
      window.alert('This vendor cannot be deleted while assigned to a Work Order.');
      return;
    }
    if (!window.confirm(`Delete vendor "${vendor.name}"?`)) return;
    remove(`/vendors/${vendor.id}/`).then(() => {
      setVendorMessage({ type: 'success', text: 'Vendor deleted successfully.' });
      if (editingVendorId === vendor.id) resetVendorForm();
      load();
    }).catch(() => setVendorMessage({ type: 'error', text: 'Vendor could not be deleted. Please try again.' }));
  };

  const resetClientForm = () => {
    setClientForm({ client_name: '', client_email: '', client_phone: '', client_address: '', client_status: 'Active' });
  };

  const resetEditClientForm = () => {
    setEditClientForm({ client_name: '', client_email: '', client_phone: '', client_address: '', client_status: 'Active' });
    setEditingClientId(null);
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.client_email.trim());
    if (!clientForm.client_name.trim() || !clientForm.client_email.trim()) {
      setClientMessage({ type: 'error', text: 'Please complete the client name and email fields, then try again.' });
      return;
    }
    if (!emailIsValid) {
      setClientMessage({ type: 'error', text: 'Please enter a valid email address, then try again.' });
      return;
    }

    setSaving(true);
    post('/clients/', {
      name: clientForm.client_name.trim(),
      email: clientForm.client_email.trim(),
      phone: clientForm.client_phone.trim(),
      address: clientForm.client_address.trim(),
      status: clientForm.client_status
    }).then(savedClient => {
      setClients(prev => [{ ...savedClient, status: clientForm.client_status }, ...prev]);
      setClientMessage({ type: 'success', text: 'Client added successfully.' });
      resetClientForm();
      load();
    }).catch(() => {
      setClientMessage({ type: 'error', text: 'Client could not be added. Please try again.' });
    }).finally(() => setSaving(false));
  };

  const handleClientEdit = (client) => {
    setEditingClientId(client.id);
    setClientMessage(null);
    setEditClientForm({
      client_name: client.name,
      client_email: client.email,
      client_phone: client.phone,
      client_address: client.address,
      client_status: client.status
    });
  };

  const handleClientUpdate = (e) => {
    e.preventDefault();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editClientForm.client_email.trim());
    if (!editClientForm.client_name.trim() || !editClientForm.client_email.trim()) {
      setClientMessage({ type: 'error', text: 'Please complete the client name and email fields, then try again.' });
      return;
    }
    if (!emailIsValid) {
      setClientMessage({ type: 'error', text: 'Please enter a valid email address, then try again.' });
      return;
    }

    setSaving(true);
    put(`/clients/${editingClientId}/`, {
      name: editClientForm.client_name.trim(),
      email: editClientForm.client_email.trim(),
      phone: editClientForm.client_phone.trim(),
      address: editClientForm.client_address.trim(),
      status: editClientForm.client_status
    }).then(savedClient => {
      setClients(prev => prev.map(client => client.id === editingClientId
        ? { ...savedClient, status: editClientForm.client_status }
        : client));
      setClientMessage({ type: 'success', text: 'Client updated successfully.' });
      resetEditClientForm();
      load();
    }).catch(() => {
      setClientMessage({ type: 'error', text: 'Client could not be updated. Please try again.' });
    }).finally(() => setSaving(false));
  };

  const handleClientDelete = (id) => {
    if (properties.some(property => property.client === id) || orders.some(order => order.client === id)) {
      setClientMessage({ type: 'error', text: 'This client cannot be deleted while it has linked properties or work orders.' });
      return;
    }
    const client = clients.find(item => item.id === id);
    if (!window.confirm(`Delete client "${client?.name || `#${id}`}"?`)) return;
    remove(`/clients/${id}/`).then(() => {
      setClients(prev => prev.filter(client => client.id !== id));
      setClientMessage({ type: 'success', text: 'Client deleted successfully.' });
      if (editingClientId === id) resetEditClientForm();
      load();
    }).catch(() => {
      setClientMessage({ type: 'error', text: 'Client could not be deleted. Please try again.' });
    });
  };

  const propertyCountByClient = properties.reduce((counts, property) => {
    const clientId = String(property.client);
    counts[clientId] = (counts[clientId] || 0) + 1;
    return counts;
  }, {});

  useEffect(() => {
    load();
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard' },
    { name: 'Clients', icon: 'users' },
    { name: 'Properties', icon: 'home' },
    { name: 'Work Orders', icon: 'briefcase' },
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
                      <p className="alert-message">{data.pending_qa_reviews || 0} reviews awaiting attention</p>
                    </div>
                  </div>
                  <div className="alert alert-info">
                    <span className="alert-icon">ℹ️</span>
                    <div className="alert-content">
                      <p className="alert-title">Overdue Tasks</p>
                      <p className="alert-message">{data.overdue_work_orders || 0} tasks have exceeded their deadlines</p>
                    </div>
                  </div>
                  <div className="alert alert-success">
                    <span className="alert-icon">✅</span>
                    <div className="alert-content">
                      <p className="alert-title">Completion Rate</p>
                      <p className="alert-message">{data.completion_rate || 0}% of tracked work orders completed</p>
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
                      <span className="metric-value">{data.completion_rate || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${data.completion_rate || 0}%`}}></div>
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
                      <span className="metric-value">{data.active_properties ?? data.properties}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${data.properties ? Math.round((data.active_properties / data.properties) * 100) : 0}%`}}></div>
                    </div>
                    <p className="metric-label">Active properties</p>
                  </div>
                </div>
              </section>

              {/* Live Record Overview */}
              <section className="section">
                <h2 className="section-title">📦 Live Record Overview</h2>
                <div className="financial-grid">
                  <div className="financial-card">
                    <p className="financial-label">Clients</p>
                    <p className="financial-amount">{data.clients}</p>
                    <p className="financial-change">Saved client records</p>
                  </div>
                  <div className="financial-card">
                    <p className="financial-label">Properties</p>
                    <p className="financial-amount">{data.properties}</p>
                    <p className="financial-change">Linked property records</p>
                  </div>
                  <div className="financial-card">
                    <p className="financial-label">Work Orders</p>
                    <p className="financial-amount">{data.work_orders}</p>
                    <p className="financial-change">Tracked operational work</p>
                  </div>
                  <div className="financial-card">
                    <p className="financial-label">Vendors</p>
                    <p className="financial-amount">{data.vendors}</p>
                    <p className="financial-change">Reusable vendor records</p>
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
                      {(data.top_clients || []).length === 0 ? <p className="placeholder">No client activity yet.</p> : data.top_clients.map((client, index) => (
                        <div className="ranking-item" key={client.id}>
                          <span className="rank-number">{index + 1}</span>
                          <div className="rank-content">
                            <p className="rank-name">{client.name}</p>
                            <p className="rank-detail">{client.order_count} work orders</p>
                          </div>
                          <span className="rank-value">#{client.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="subsection-title">Top Vendors</h3>
                    <div className="ranking-list">
                      {(data.top_vendors || []).length === 0 ? <p className="placeholder">No vendor assignments yet.</p> : data.top_vendors.map((vendor, index) => (
                        <div className="ranking-item" key={vendor.id}>
                          <span className="rank-number">{index + 1}</span>
                          <div className="rank-content">
                            <p className="rank-name">{vendor.name}</p>
                            <p className="rank-detail">{vendor.assignment_count} assignments</p>
                          </div>
                          <span className="rank-value">#{vendor.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Upcoming Deadlines */}
              <section className="section">
                <h2 className="section-title">🗓️ Upcoming Deadlines & Tasks</h2>
                <div className="timeline-list">
                  {orders.filter(order => order.due_date).slice(0, 6).map(order => (
                    <div className="timeline-item upcoming" key={order.id}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <p className="timeline-time">Due {order.due_date}</p>
                        <p className="timeline-task">{order.title || `Work Order #${order.id}`}</p>
                        <p className="timeline-status">{order.status}</p>
                      </div>
                    </div>
                  ))}
                  {orders.filter(order => order.due_date).length === 0 && <p className="placeholder">No due dates have been assigned.</p>}
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
                <h2 className="section-title">👤 Workflow Coverage</h2>
                <div className="team-performance">
                  <div className="team-member">
                    <p className="member-name">Client to Property Links</p>
                    <p className="member-stat">{properties.length} properties linked to {clients.length} clients</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${clients.length ? Math.min(100, Math.round((properties.length / clients.length) * 100)) : 0}%`}}></div>
                    </div>
                  </div>
                  <div className="team-member">
                    <p className="member-name">Work Orders With Vendors</p>
                    <p className="member-stat">{assignments.length} vendor assignments across {orders.length} work orders</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${orders.length ? Math.min(100, Math.round((assignments.length / orders.length) * 100)) : 0}%`}}></div>
                    </div>
                  </div>
                  <div className="team-member">
                    <p className="member-name">QA Review Coverage</p>
                    <p className="member-stat">{qaReviews.length} reviews for {orders.length} work orders</p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${orders.length ? Math.min(100, Math.round((qaReviews.length / orders.length) * 100)) : 0}%`}}></div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {tab === 'Properties' && (
            <>
              <section className="section">
                <h2 className="section-title">{editingPropertyId ? '✏️ Edit Property' : 'Add New Property'}</h2>
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="client">Client ID</label>
                      <select
                        id="client"
                        name="client"
                        value={form.client}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select an existing client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            ID {client.id} | {client.name} | {client.email} | {propertyCountByClient[String(client.id)] || 0} properties
                          </option>
                        ))}
                      </select>
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
                  <div className="client-edit-actions">
                    <button type="submit" className="btn-success" disabled={saving}>
                      {saving ? '⏳ Saving...' : editingPropertyId ? '✓ Save Changes' : '✓ Add Property'}
                    </button>
                    {editingPropertyId && <button type="button" className="btn-secondary" onClick={() => { setEditingPropertyId(null); setForm({ client: '', address: '', property_type: 'House', details: '', status: 'Active' }); }}>Cancel</button>}
                  </div>
                </form>
              </section>

              <section className="section">
                <h2 className="section-title">Properties ({properties.length})</h2>
                <div className="properties-grid">
                  {properties.map(prop => (
                    <PropertyCard key={prop.id} property={prop} onEdit={handlePropertyEdit} onDelete={handlePropertyDelete} />
                  ))}
                </div>
              </section>
            </>
          )}

          {tab === 'Work Orders' && (
            <>
              <section className="section work-orders-toolbar">
                <div>
                  <h2 className="section-title">Work Orders ({orders.length})</h2>
                  <p className="client-edit-note">Manage work assignments connected to existing clients and properties.</p>
                </div>
                <button type="button" className="btn-primary" onClick={() => { setShowWorkOrderForm(true); setEditingWorkOrderId(null); setWorkOrderMessage(null); }}>
                  + Add New Work Order
                </button>
              </section>

              {showWorkOrderForm && (
                <section className="section">
                  <h2 className="section-title">{editingWorkOrderId ? '✏️ Edit Work Order' : '➕ Add New Work Order'}</h2>
                  {workOrderMessage && <div className={`client-message ${workOrderMessage.type}`}>{workOrderMessage.text}</div>}
                  <form className="form" noValidate onSubmit={handleWorkOrderSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="work_order_title">Work Order Title *</label>
                        <input id="work_order_title" name="title" value={workOrderForm.title} onChange={handleWorkOrderChange} placeholder="Enter work order title" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="work_order_client">Client *</label>
                        <select id="work_order_client" name="client" value={workOrderForm.client} onChange={handleWorkOrderChange}>
                          <option value="">Select a client</option>
                          {clients.map(client => <option key={client.id} value={client.id}>ID {client.id} | {client.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="work_order_property">Property *</label>
                        <select id="work_order_property" name="property" value={workOrderForm.property} onChange={handleWorkOrderChange} disabled={!workOrderForm.client}>
                          <option value="">{workOrderForm.client ? 'Select a property' : 'Select a client first'}</option>
                          {selectedWorkOrderProperties.map(property => <option key={property.id} value={property.id}>ID {property.id} | {property.address}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="work_order_type">Work Type</label>
                        <input id="work_order_type" name="work_type" value={workOrderForm.work_type} onChange={handleWorkOrderChange} placeholder="Inspection, repair, cleanup..." />
                      </div>
                      <div className="form-group">
                        <label htmlFor="work_order_vendor">Assign To Vendor</label>
                        <select id="work_order_vendor" name="vendor" value={workOrderForm.vendor} onChange={handleWorkOrderChange}>
                          <option value="">No vendor assigned</option>
                          {vendors.map(vendor => <option key={vendor.id} value={vendor.id}>#{vendor.id} - {vendor.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="work_order_status">Status</label>
                        <select id="work_order_status" name="status" value={workOrderForm.status} onChange={handleWorkOrderChange}>
                          <option value="New">Pending</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="work_order_priority">Priority</label>
                        <select id="work_order_priority" name="priority" value={workOrderForm.priority} onChange={handleWorkOrderChange}>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="work_order_due_date">Due Date</label>
                        <input id="work_order_due_date" name="due_date" type="date" value={workOrderForm.due_date} onChange={handleWorkOrderChange} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="work_order_description">Description / Notes</label>
                      <textarea id="work_order_description" name="description" value={workOrderForm.description} onChange={handleWorkOrderChange} placeholder="Add notes..." rows="3" />
                    </div>
                    <div className="client-edit-actions">
                      <button type="submit" className="btn-success" disabled={saving}>{saving ? '⏳ Saving...' : editingWorkOrderId ? '✓ Save Changes' : '✓ Add Work Order'}</button>
                      {editingWorkOrderId && <button type="button" className="btn-secondary" onClick={resetWorkOrderForm}>Cancel</button>}
                    </div>
                  </form>
                </section>
              )}

              {workOrderMessage && !showWorkOrderForm && <div className={`client-message ${workOrderMessage.type}`}>{workOrderMessage.text}</div>}
              <section className="section">
                <div className="table-responsive">
                  <table className="data-table work-orders-table">
                    <thead><tr><th>Title</th><th>Client</th><th>Property</th><th>Assigned To</th><th>Status</th><th>Priority</th><th>Due Date</th><th>Actions</th></tr></thead>
                    <tbody>
                      {orders.length === 0 ? <tr><td colSpan="8" className="placeholder">No work orders yet.</td></tr> : orders.map(order => {
                        const client = clients.find(item => item.id === order.client);
                        const property = properties.find(item => item.id === order.property);
                        return <tr key={order.id}>
                          <td><strong>{order.title || `Order #${order.id}`}</strong></td>
                          <td>{client?.name || `Client #${order.client}`}</td>
                          <td>{property?.address || `Property #${order.property}`}</td>
                          <td>{vendors.find(vendor => vendor.id === assignments.find(assignment => assignment.work_order === order.id)?.vendor)?.name || order.assigned_to || '—'}</td>
                          <td><span className={`status-badge status-${order.status?.toLowerCase().replaceAll(' ', '-')}`}>{order.status === 'New' ? 'Pending' : order.status}</span></td>
                          <td><span className={`priority-badge priority-${(order.priority || 'Medium').toLowerCase()}`}>{order.priority || 'Medium'}</span></td>
                          <td>{order.due_date || '—'}</td>
                          <td><button type="button" className="btn-action edit" onClick={() => handleWorkOrderEdit(order)}>Edit</button><button type="button" className="btn-action delete" onClick={() => handleWorkOrderDelete(order)}>Delete</button></td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {tab === 'Clients' && (
            <>
              <section className="section">
                <h2 className="section-title">➕ Add New Client</h2>
                {clientMessage && !editingClientId && <div className={`client-message ${clientMessage.type}`}>{clientMessage.text}</div>}
                <form className="form" noValidate onSubmit={handleClientSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="client_name">Client Name *</label>
                      <input
                        id="client_name"
                        type="text"
                        value={clientForm.client_name}
                        onChange={(e) => setClientForm({ ...clientForm, client_name: e.target.value })}
                        placeholder="Enter client name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="client_email">Email *</label>
                      <input
                        id="client_email"
                        type="email"
                        value={clientForm.client_email}
                        onChange={(e) => setClientForm({ ...clientForm, client_email: e.target.value })}
                        placeholder="client@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="client_phone">Phone</label>
                      <input
                        id="client_phone"
                        type="tel"
                        value={clientForm.client_phone}
                        onChange={(e) => setClientForm({ ...clientForm, client_phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="client_address">Address</label>
                      <input
                        id="client_address"
                        type="text"
                        value={clientForm.client_address}
                        onChange={(e) => setClientForm({ ...clientForm, client_address: e.target.value })}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="client_status">Status</label>
                      <select
                        id="client_status"
                        value={clientForm.client_status}
                        onChange={(e) => setClientForm({ ...clientForm, client_status: e.target.value })}
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Pending</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button type="submit" className="btn-success" disabled={saving}>
                      {saving ? '⏳ Saving...' : '✓ Add Client'}
                    </button>
                  </div>
                </form>
              </section>

              <section className="section">
                <h2 className="section-title">👥 Clients List ({clients.length})</h2>
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
                      {clients.map(client => (
                        <React.Fragment key={client.id}>
                          <tr>
                            <td><strong>{client.name}</strong></td>
                            <td>{client.email}</td>
                            <td>{client.phone || '—'}</td>
                            <td>{client.address || '—'}</td>
                            <td><span className="rating">{propertyCountByClient[String(client.id)] || 0} Properties</span></td>
                            <td><span className={`status-badge status-${(client.status || 'Active').toLowerCase()}`}>{client.status || 'Active'}</span></td>
                            <td>
                              <button type="button" className="btn-action edit" onClick={() => handleClientEdit(client)}>Edit</button>
                              <button type="button" className="btn-action delete" onClick={() => handleClientDelete(client.id)}>Delete</button>
                            </td>
                          </tr>
                          {editingClientId === client.id && (
                            <tr className="client-edit-row">
                              <td colSpan="7">
                                <div className="client-inline-edit">
                                  <h3>✏️ Edit {client.name}</h3>
                                  {clientMessage && <div className={`client-message ${clientMessage.type}`}>{clientMessage.text}</div>}
                                  <form className="form" noValidate onSubmit={handleClientUpdate}>
                                    <div className="form-grid">
                                      <div className="form-group">
                                        <label htmlFor={`edit_client_name_${client.id}`}>Client Name *</label>
                                        <input id={`edit_client_name_${client.id}`} type="text" value={editClientForm.client_name} onChange={(e) => setEditClientForm({ ...editClientForm, client_name: e.target.value })} />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor={`edit_client_email_${client.id}`}>Email *</label>
                                        <input id={`edit_client_email_${client.id}`} type="email" value={editClientForm.client_email} onChange={(e) => setEditClientForm({ ...editClientForm, client_email: e.target.value })} />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor={`edit_client_phone_${client.id}`}>Phone Number</label>
                                        <input id={`edit_client_phone_${client.id}`} type="tel" value={editClientForm.client_phone} onChange={(e) => setEditClientForm({ ...editClientForm, client_phone: e.target.value })} />
                                      </div>
                                      <div className="form-group">
                                        <label htmlFor={`edit_client_address_${client.id}`}>Address</label>
                                        <input id={`edit_client_address_${client.id}`} type="text" value={editClientForm.client_address} onChange={(e) => setEditClientForm({ ...editClientForm, client_address: e.target.value })} />
                                      </div>
                                    </div>
                                    <div className="client-edit-actions">
                                      <button type="submit" className="btn-success" disabled={saving}>
                                        {saving ? '⏳ Saving...' : '✓ Save Changes'}
                                      </button>
                                      <button type="button" className="btn-secondary" onClick={resetEditClientForm}>Cancel</button>
                                    </div>
                                  </form>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Client Performance */}
              <section className="section">
                <h2 className="section-title">📊 Live Client Summary</h2>
                <div className="vendor-performance-grid">
                  {clients.length === 0 ? <p className="placeholder">No clients added yet.</p> : clients.slice(0, 6).map(client => (
                    <div className="vendor-card" key={client.id}>
                      <div className="vendor-header">
                        <h3>#{client.id} - {client.name}</h3>
                        <span className={`status-badge status-${(client.status || 'Active').toLowerCase()}`}>{client.status || 'Active'}</span>
                      </div>
                      <div className="vendor-stats">
                        <div className="stat-item">
                          <p className="stat-label">Properties</p>
                          <p className="stat-value">{propertyCountByClient[String(client.id)] || 0}</p>
                        </div>
                        <div className="stat-item">
                          <p className="stat-label">Work Orders</p>
                          <p className="stat-value">{orders.filter(order => order.client === client.id).length}</p>
                        </div>
                      </div>
                      <div className="vendor-area">{client.email}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Client Metrics */}
              <section className="section">
                <h2 className="section-title">📈 Client Management Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Total Active Clients</h3>
                      <span className="metric-value">{clients.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '90%'}}></div>
                    </div>
                    <p className="metric-label">Growing portfolio</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Clients With Properties</h3>
                      <span className="metric-value">{clients.filter(client => propertyCountByClient[String(client.id)]).length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${clients.length ? Math.round((clients.filter(client => propertyCountByClient[String(client.id)]).length / clients.length) * 100) : 0}%`}}></div>
                    </div>
                    <p className="metric-label">Linked property coverage</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Client Work Orders</h3>
                      <span className="metric-value">{orders.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${data.work_orders ? Math.min(100, Math.round((orders.length / data.work_orders) * 100)) : 0}%`}}></div>
                    </div>
                    <p className="metric-label">Linked work-order records</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {tab === 'Vendors' && (
            <>
              <section className="section">
                <h2 className="section-title">{editingVendorId ? '✏️ Edit Vendor' : '➕ Add New Vendor'}</h2>
                {vendorMessage && <div className={`client-message ${vendorMessage.type}`}>{vendorMessage.text}</div>}
                <form className="form" onSubmit={handleVendorSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="vendor_name">Vendor Name *</label>
                      <input
                        id="vendor_name"
                        type="text"
                        value={vendorForm.name}
                        onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                        placeholder="Enter vendor name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor_email">Email</label>
                      <input
                        id="vendor_email"
                        type="email"
                        value={vendorForm.email}
                        onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                        placeholder="vendor@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor_phone">Phone</label>
                      <input
                        id="vendor_phone"
                        type="tel"
                        value={vendorForm.phone}
                        onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor_service_area">Service Area</label>
                      <input
                        id="vendor_service_area"
                        type="text"
                        value={vendorForm.service_area}
                        onChange={(e) => setVendorForm({ ...vendorForm, service_area: e.target.value })}
                        placeholder="e.g., North County, Downtown"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="vendor_status">Status</label>
                      <select
                        id="vendor_status"
                        value={vendorForm.status}
                        onChange={(e) => setVendorForm({ ...vendorForm, status: e.target.value })}
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Suspended</option>
                      </select>
                    </div>
                  </div>
                  <div className="client-edit-actions">
                    <button type="submit" className="btn-success" disabled={saving}>
                      {saving ? '⏳ Saving...' : editingVendorId ? '✓ Save Changes' : '✓ Add Vendor'}
                    </button>
                    {editingVendorId && <button type="button" className="btn-secondary" onClick={resetVendorForm}>Cancel</button>}
                  </div>
                </form>
              </section>

              {/* Vendors Table */}
              <section className="section">
                <h2 className="section-title">👥 Vendors List ({vendors.length})</h2>
                {vendors.length > 0 ? (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Vendor Name</th>
                          <th>Service Area</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendors.map(vendor => (
                          <tr key={vendor.id}>
                            <td><strong>#{vendor.id} - {vendor.name}</strong></td>
                            <td>{vendor.service_area || '—'}</td>
                            <td>{vendor.email || '—'}</td>
                            <td>{vendor.phone || '—'}</td>
                            <td><span className={`status-badge status-${(vendor.status || 'Active').toLowerCase()}`}>{vendor.status || 'Active'}</span></td>
                            <td>
                              <button type="button" className="btn-action edit" onClick={() => handleVendorEdit(vendor)}>Edit</button>
                              <button type="button" className="btn-action delete" onClick={() => handleVendorDelete(vendor)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="placeholder">No vendors added yet.</p>
                )}
              </section>

              {/* Vendor Performance Overview */}
              <section className="section">
                <h2 className="section-title">📊 Live Vendor Overview</h2>
                <div className="vendor-performance-grid">
                  {vendors.length === 0 ? <p className="placeholder">No vendors added yet.</p> : vendors.slice(0, 6).map(vendor => (
                    <div className="vendor-card" key={vendor.id}>
                      <div className="vendor-header">
                        <h3>#{vendor.id} - {vendor.name}</h3>
                        <span className={`status-badge status-${(vendor.status || 'Active').toLowerCase()}`}>{vendor.status || 'Active'}</span>
                      </div>
                      <div className="vendor-stats">
                        <div className="stat-item">
                          <p className="stat-label">Assignments</p>
                          <p className="stat-value">{assignments.filter(assignment => assignment.vendor === vendor.id).length}</p>
                        </div>
                        <div className="stat-item">
                          <p className="stat-label">Phone</p>
                          <p className="stat-value">{vendor.phone || '—'}</p>
                        </div>
                      </div>
                      <div className="vendor-area">{vendor.service_area || vendor.email || 'No service details'}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Vendor Statistics */}
              <section className="section">
                <h2 className="section-title">📈 Key Vendor Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Total Vendors</h3>
                      <span className="metric-value">{vendors.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '80%'}}></div>
                    </div>
                    <p className="metric-label">Operational capacity at 80%</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Assigned Work Orders</h3>
                      <span className="metric-value">{assignments.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${orders.length ? Math.min(100, Math.round((assignments.length / orders.length) * 100)) : 0}%`}}></div>
                    </div>
                    <p className="metric-label">Vendor-linked assignments</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Unassigned Work Orders</h3>
                      <span className="metric-value">{Math.max(0, orders.length - assignments.length)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${orders.length ? Math.round((Math.max(0, orders.length - assignments.length) / orders.length) * 100) : 0}%`}}></div>
                    </div>
                    <p className="metric-label">Needs vendor assignment</p>
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
                  if (!form.qa_work_order) return;
                  setSaving(true);
                  post('/qa-reviews/', {
                    work_order: Number(form.qa_work_order),
                    comments: form.qa_comments,
                    status: form.qa_status
                  })
                    .then(() => {
                      setSaving(false);
                      setForm({ ...form, qa_work_order: '', qa_comments: '', qa_status: 'Pending' });
                      load();
                    })
                    .catch(() => setSaving(false));
                }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="qa_work_order">Work Order ID *</label>
                      <select
                        id="qa_work_order"
                        value={form.qa_work_order || ''}
                        onChange={(e) => setForm({ ...form, qa_work_order: e.target.value })}
                        required
                      >
                        <option value="">Select a work order</option>
                        {orders.map(order => <option key={order.id} value={order.id}>#{order.id} - {order.title || 'Untitled work order'}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="qa_status">Review Status</label>
                      <select
                        id="qa_status"
                        value={form.qa_status || 'Pending'}
                        onChange={(e) => setForm({ ...form, qa_status: e.target.value })}
                      >
                        <option>Pending</option>
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
                <h2 className="section-title">✅ QA Reviews List ({qaReviews.length})</h2>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Work Order</th>
                        <th>Status</th>
                        <th>Comments</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qaReviews.length === 0 ? <tr><td colSpan="5" className="placeholder">No QA reviews yet.</td></tr> : qaReviews.map(review => (
                        <tr key={review.id}>
                          <td><strong>#{review.work_order}</strong></td>
                          <td><span className={`status-badge status-${(review.status || 'Pending').toLowerCase().replaceAll(' ', '-')}`}>{review.status || 'Pending'}</span></td>
                          <td>{review.comments || '—'}</td>
                          <td>{review.review_date ? new Date(review.review_date).toLocaleDateString() : '—'}</td>
                          <td><button type="button" className="btn-action delete" onClick={() => remove(`/qa-reviews/${review.id}/`).then(load)}>Delete</button></td>
                        </tr>
                      ))}
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
                      <span className="metric-value">{qaReviews.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '98%'}}></div>
                    </div>
                    <p className="metric-label">This month</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Pass Rate</h3>
                      <span className="metric-value">{qaReviews.length ? Math.round((qaReviews.filter(review => ['Pass', 'Approved'].includes(review.status)).length / qaReviews.length) * 100) : 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${qaReviews.length ? Math.round((qaReviews.filter(review => ['Pass', 'Approved'].includes(review.status)).length / qaReviews.length) * 100) : 0}%`}}></div>
                    </div>
                    <p className="metric-label">Based on saved review statuses</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Pending Reviews</h3>
                      <span className="metric-value">{qaReviews.filter(review => review.status === 'Pending').length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${qaReviews.length ? Math.round((qaReviews.filter(review => review.status !== 'Pending').length / qaReviews.length) * 100) : 0}%`}}></div>
                    </div>
                    <p className="metric-label">Reviews completed</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Completed Reviews</h3>
                      <span className="metric-value">{qaReviews.filter(review => review.status !== 'Pending').length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${qaReviews.length ? Math.round((qaReviews.filter(review => review.status !== 'Pending').length / qaReviews.length) * 100) : 0}%`}}></div>
                    </div>
                    <p className="metric-label">Non-pending reviews</p>
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
                  if (!form.doc_name || !form.doc_type || !form.doc_work_order) return;
                  setSaving(true);
                  const documentData = new FormData();
                  documentData.append('file_name', form.doc_name);
                  documentData.append('file_type', form.doc_type);
                  documentData.append('work_order', Number(form.doc_work_order));
                  if (form.doc_file) documentData.append('file_path', form.doc_file);
                  postForm('/documents/', documentData)
                    .then(() => {
                      setSaving(false);
                      setForm({ ...form, doc_name: '', doc_type: 'Report', doc_work_order: '', doc_file: null });
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
                      <select
                        id="doc_work_order"
                        value={form.doc_work_order || ''}
                        onChange={(e) => setForm({ ...form, doc_work_order: e.target.value })}
                        required
                      >
                        <option value="">Select a work order</option>
                        {orders.map(order => <option key={order.id} value={order.id}>#{order.id} - {order.title || 'Untitled work order'}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="doc_file">File</label>
                      <input
                        id="doc_file"
                        type="file"
                        onChange={(e) => setForm({ ...form, doc_file: e.target.files?.[0] || null })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-success" disabled={saving}>
                    {saving ? '⏳ Uploading...' : '✓ Upload Document'}
                  </button>
                </form>
              </section>

              {/* Documents Table */}
              <section className="section">
                <h2 className="section-title">📄 Documents Library ({documents.length})</h2>
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
                      {documents.length === 0 ? <tr><td colSpan="7" className="placeholder">No documents yet.</td></tr> : documents.map(document => (
                        <tr key={document.id}>
                          <td><strong>{document.file_name}</strong></td>
                          <td>{document.file_type || '—'}</td>
                          <td>#{document.work_order}</td>
                          <td>{document.file_path ? 'Available' : 'Metadata only'}</td>
                          <td>{document.upload_date ? new Date(document.upload_date).toLocaleDateString() : '—'}</td>
                          <td><span className="status-badge status-active">Stored</span></td>
                          <td><button type="button" className="btn-action delete" onClick={() => remove(`/documents/${document.id}/`).then(load)}>Delete</button></td>
                        </tr>
                      ))}
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
                      <span className="metric-value">{documents.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '78%'}}></div>
                    </div>
                    <p className="metric-label">All document types</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Files Stored</h3>
                      <span className="metric-value">{documents.filter(document => document.file_path).length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '49%'}}></div>
                    </div>
                    <p className="metric-label">Documents with file paths</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Linked Documents</h3>
                      <span className="metric-value">{documents.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '85%'}}></div>
                    </div>
                      <p className="metric-label">Attached to work orders</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Metadata Only</h3>
                      <span className="metric-value">{documents.filter(document => !document.file_path).length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '98%'}}></div>
                    </div>
                    <p className="metric-label">Records awaiting file upload</p>
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
                    report_type: form.report_type
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
                  </div>
                  <button type="submit" className="btn-success" disabled={saving}>
                    {saving ? '⏳ Generating...' : '✓ Generate Report'}
                  </button>
                </form>
              </section>

              {/* Reports List */}
              <section className="section">
                <h2 className="section-title">📊 Recent Reports ({reports.length})</h2>
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
                      {reports.length === 0 ? <tr><td colSpan="7" className="placeholder">No reports generated yet.</td></tr> : reports.map(report => (
                        <tr key={report.id}>
                          <td><strong>#{report.id} {report.report_type}</strong></td>
                          <td>{report.report_type}</td>
                          <td>—</td>
                          <td>—</td>
                          <td>{report.generated_date ? new Date(report.generated_date).toLocaleDateString() : '—'}</td>
                          <td><span className="status-badge status-active">Generated</span></td>
                          <td><button type="button" className="btn-action delete" onClick={() => remove(`/reports/${report.id}/`).then(load)}>Delete</button></td>
                        </tr>
                      ))}
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
                      <span className="metric-value">{reports.length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '85%'}}></div>
                    </div>
                    <p className="metric-label">Year-to-date total</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Report Types</h3>
                      <span className="metric-value">{new Set(reports.map(report => report.report_type)).size}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '96%'}}></div>
                    </div>
                    <p className="metric-label">Distinct saved report types</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Reports With Files</h3>
                      <span className="metric-value">{reports.filter(report => report.file_path).length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '68%'}}></div>
                    </div>
                      <p className="metric-label">Generated file records</p>
                  </div>
                  <div className="metric-card">
                    <div className="metric-header">
                      <h3>Reports Pending Files</h3>
                      <span className="metric-value">{reports.filter(report => !report.file_path).length}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '99.8%'}}></div>
                    </div>
                    <p className="metric-label">Metadata-only reports</p>
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
