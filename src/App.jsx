import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calendar, Clock, Users, ArrowLeftRight, CheckCircle, XCircle, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';


const API = {
  async request(endpoint, options = {}) {
    const token = sessionStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  },

  async signup(name, email, password) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getEvents() {
    return this.request('/events');
  },

  async createEvent(event) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  async updateEvent(eventId, updates) {
    return this.request(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteEvent(eventId) {
    return this.request(`/events/${eventId}`, {
      method: 'DELETE',
    });
  },

  async getSwappableSlots() {
    return this.request('/swappable-slots');
  },

  async createSwapRequest(mySlotId, theirSlotId) {
    return this.request('/swap-request', {
      method: 'POST',
      body: JSON.stringify({ mySlotId, theirSlotId }),
    });
  },

  async respondToSwap(requestId, accept) {
    return this.request(`/swap-response/${requestId}`, {
      method: 'POST',
      body: JSON.stringify({ accept }),
    });
  },

  async getIncomingRequests() {
    return this.request('/swap-requests/incoming');
  },

  async getOutgoingRequests() {
    return this.request('/swap-requests/outgoing');
  },
};


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await API.login(email, password);
    setUser(response.user);
    setToken(response.token);
    sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('user', JSON.stringify(response.user));
  };

  const signup = async (name, email, password) => {
    const response = await API.signup(name, email, password);
    setUser(response.user);
    setToken(response.token);
    sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('user', JSON.stringify(response.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ background: 'white', padding: '48px', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', marginBottom: '16px' }}>
            <ArrowLeftRight size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>SlotSwapper</h1>
          <p style={{ color: '#718096' }}>Swap your time slots with ease</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>

          {error && (
            <div style={{ padding: '12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '14px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px' }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontSize: '14px' }}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dashboard
const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '', status: 'BUSY' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, [user]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await API.getEvents();
      setEvents(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingEvent) {
        await API.updateEvent(editingEvent.id, formData);
      } else {
        await API.createEvent(formData);
      }
      setShowModal(false);
      setEditingEvent(null);
      setFormData({ title: '', startTime: '', endTime: '', status: 'BUSY' });
      loadEvents();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.deleteEvent(id);
      loadEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({ 
      title: event.title, 
      startTime: event.start_time.slice(0, 16), 
      endTime: event.end_time.slice(0, 16), 
      status: event.status 
    });
    setShowModal(true);
  };

  const toggleSwappable = async (event) => {
    try {
      if (event.status === 'BUSY') {
        await API.updateEvent(event.id, { status: 'SWAPPABLE' });
      } else if (event.status === 'SWAPPABLE') {
        await API.updateEvent(event.id, { status: 'BUSY' });
      }
      loadEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'BUSY': return '#ef4444';
      case 'SWAPPABLE': return '#10b981';
      case 'SWAP_PENDING': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>My Calendar</h2>
          <p style={{ color: '#718096' }}>Manage your time slots</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          <Plus size={20} /> Add Event
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '14px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {events.map(event => (
          <div key={event.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: `3px solid ${getStatusColor(event.status)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', marginBottom: '12px' }}>{event.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', marginBottom: '8px' }}>
                  <Clock size={16} />
                  <span>{new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}</span>
                </div>
                <div style={{ display: 'inline-block', padding: '4px 12px', background: getStatusColor(event.status), color: 'white', borderRadius: '16px', fontSize: '12px', fontWeight: '600' }}>
                  {event.status}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {event.status !== 'SWAP_PENDING' && (
                  <button
                    onClick={() => toggleSwappable(event)}
                    style={{ padding: '8px', background: event.status === 'SWAPPABLE' ? '#fee2e2' : '#dcfce7', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                    title={event.status === 'SWAPPABLE' ? 'Mark as Busy' : 'Mark as Swappable'}
                  >
                    <ArrowLeftRight size={18} color={event.status === 'SWAPPABLE' ? '#dc2626' : '#16a34a'} />
                  </button>
                )}
                <button onClick={() => handleEdit(event)} style={{ padding: '8px', background: '#dbeafe', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  <Edit2 size={18} color="#2563eb" />
                </button>
                <button onClick={() => handleDelete(event.id)} style={{ padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  <Trash2 size={18} color="#dc2626" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px', color: '#9ca3af' }}>
            <Calendar size={64} style={{ margin: '0 auto 16px' }} />
            <p>No events yet. Create your first time slot!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>End Time</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }}
                >
                  <option value="BUSY">Busy</option>
                  <option value="SWAPPABLE">Swappable</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                  {loading ? 'Saving...' : (editingEvent ? 'Update' : 'Create')}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setEditingEvent(null); setFormData({ title: '', startTime: '', endTime: '', status: 'BUSY' }); }} style={{ flex: 1, padding: '12px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Marketplace
const Marketplace = () => {
  const { user } = useAuth();
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedMySlot, setSelectedMySlot] = useState(null);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSlots();
  }, [user]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const available = await API.getSwappableSlots();
      const mine = await API.getEvents();
      setSwappableSlots(available);
      setMySwappableSlots(mine.filter(e => e.status === 'SWAPPABLE'));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async () => {
    if (!selectedMySlot || !selectedTheirSlot) return;
    try {
      await API.createSwapRequest(selectedMySlot, selectedTheirSlot);
      alert('Swap request sent successfully!');
      setSelectedMySlot(null);
      setSelectedTheirSlot(null);
      loadSlots();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>Marketplace</h2>
        <p style={{ color: '#718096' }}>Find and swap time slots with others</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>My Swappable Slots</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {mySwappableSlots.map(slot => (
              <div
                key={slot.id}
                onClick={() => setSelectedMySlot(slot.id)}
                style={{ padding: '16px', background: selectedMySlot === slot.id ? '#dbeafe' : 'white', border: selectedMySlot === slot.id ? '3px solid #2563eb' : '2px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer' }}
              >
                <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{slot.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', fontSize: '14px' }}>
                  <Clock size={14} />
                  <span>{new Date(slot.start_time).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {mySwappableSlots.length === 0 && (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '32px' }}>No swappable slots. Mark a slot as swappable in your dashboard.</p>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Available Slots</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {swappableSlots.map(slot => (
              <div
                key={slot.id}
                onClick={() => setSelectedTheirSlot(slot.id)}
                style={{ padding: '16px', background: selectedTheirSlot === slot.id ? '#dcfce7' : 'white', border: selectedTheirSlot === slot.id ? '3px solid #16a34a' : '2px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer' }}
              >
                <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{slot.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', fontSize: '14px', marginBottom: '4px' }}>
                  <Clock size={14} />
                  <span>{new Date(slot.start_time).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  by {slot.user_name}
                </div>
              </div>
            ))}
            {swappableSlots.length === 0 && (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '32px' }}>No available slots to swap.</p>
            )}
          </div>
        </div>
      </div>

      {selectedMySlot && selectedTheirSlot && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ArrowLeftRight size={24} color="#667eea" />
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Ready to request a swap?</p>
            <p style={{ fontSize: '14px', color: '#718096' }}>You've selected slots to exchange</p>
          </div>
          <button
            onClick={handleSwapRequest}
            style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            Request Swap
          </button>
        </div>
      )}
    </div>
  );
};

// Requests Page
const Requests = () => {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) loadRequests();
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const inc = await API.getIncomingRequests();
      const out = await API.getOutgoingRequests();
      setIncoming(inc || []);
      setOutgoing(out || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, accept) => {
    try {
      await API.respondToSwap(requestId, accept);
      loadRequests();
      alert(accept ? "Swap accepted!" : "Swap rejected!");
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading requests...</p>;

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "bold", color: "#1a202c", marginBottom: "8px" }}>
          Swap Requests
        </h2>
        <p style={{ color: "#718096" }}>Manage incoming and outgoing swap requests</p>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Incoming Requests */}
        <div>
          <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#2563eb" }}>
            Incoming Requests
          </h3>
          <div style={{ display: "grid", gap: "16px" }}>
            {incoming.length > 0 ? (
              incoming.map((req) => (
                <div
                  key={req.id}
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ marginBottom: "12px", padding: "8px", background: "#f3f4f6", borderRadius: "8px" }}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>
                      From: {req.requester_name}
                    </p>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>They want to swap:</p>
                    <div style={{ background: "#f3f4f6", padding: "12px", borderRadius: "8px", marginBottom: "8px" }}>
                      <p style={{ fontWeight: "bold" }}>{req.requester_slot_title}</p>
                      <p style={{ fontSize: "14px", color: "#718096" }}>
                        {new Date(req.requester_slot_start).toLocaleString()}
                      </p>
                    </div>

                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>For your slot:</p>
                    <div style={{ background: "#dcfce7", padding: "12px", borderRadius: "8px" }}>
                      <p style={{ fontWeight: "bold" }}>{req.recipient_slot_title}</p>
                      <p style={{ fontSize: "14px", color: "#718096" }}>
                        {new Date(req.recipient_slot_start).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => handleResponse(req.id, true)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "12px",
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      <CheckCircle size={18} /> Accept
                    </button>
                    <button
                      onClick={() => handleResponse(req.id, false)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "12px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "#9ca3af",
                  background: "white",
                  borderRadius: "12px",
                }}
              >
                <Users size={48} style={{ margin: "0 auto 16px" }} />
                <p>No incoming requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Outgoing Requests */}
        <div>
          <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#16a34a" }}>
            Outgoing Requests
          </h3>
          <div style={{ display: "grid", gap: "16px" }}>
            {outgoing.length > 0 ? (
              outgoing.map((req) => (
                <div
                  key={req.id}
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ marginBottom: "12px", padding: "8px", background: "#f3f4f6", borderRadius: "8px" }}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>
                      To: {req.recipient_name}
                    </p>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>Your slot:</p>
                    <div
                      style={{
                        background: "#dbeafe",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>{req.requester_slot_title}</p>
                      <p style={{ fontSize: "14px", color: "#718096" }}>
                        {new Date(req.requester_slot_start).toLocaleString()}
                      </p>
                    </div>

                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>Requested slot:</p>
                    <div style={{ background: "#f3f4f6", padding: "12px", borderRadius: "8px" }}>
                      <p style={{ fontWeight: "bold" }}>{req.recipient_slot_title}</p>
                      <p style={{ fontSize: "14px", color: "#718096" }}>
                        {new Date(req.recipient_slot_start).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 16px",
                      background:
                        req.status === "PENDING"
                          ? "#fef3c7"
                          : req.status === "ACCEPTED"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        req.status === "PENDING"
                          ? "#92400e"
                          : req.status === "ACCEPTED"
                          ? "#166534"
                          : "#991b1b",
                      borderRadius: "16px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {req.status}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "#9ca3af",
                  background: "white",
                  borderRadius: "12px",
                }}
              >
                <ArrowLeftRight size={48} style={{ margin: "0 auto 16px" }} />
                <p>No outgoing requests</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
// Main App
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <AuthProvider>
      <AppContent currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </AuthProvider>
  );
};

const AppContent = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <nav style={{ background: 'white', borderBottom: '2px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px' }}>
                <ArrowLeftRight size={24} color="white" />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c' }}>SlotSwapper</h1>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage('dashboard')}
                style={{ 
                  padding: '10px 20px', 
                  background: currentPage === 'dashboard' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: currentPage === 'dashboard' ? 'white' : '#718096',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Calendar size={18} /> Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('marketplace')}
                style={{ 
                  padding: '10px 20px', 
                  background: currentPage === 'marketplace' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: currentPage === 'marketplace' ? 'white' : '#718096',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Users size={18} /> Marketplace
              </button>
              <button
                onClick={() => setCurrentPage('requests')}
                style={{ 
                  padding: '10px 20px', 
                  background: currentPage === 'requests' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: currentPage === 'requests' ? 'white' : '#718096',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ArrowLeftRight size={18} /> Requests
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '600', color: '#1a202c' }}>{user.name}</p>
              <p style={{ fontSize: '14px', color: '#718096' }}>{user.email}</p>
            </div>
            <button
              onClick={logout}
              style={{ padding: '10px 20px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'marketplace' && <Marketplace />}
        {currentPage === 'requests' && <Requests />}
      </div>
    </div>
  );
};

export default App;