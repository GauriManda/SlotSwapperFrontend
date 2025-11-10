import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { API } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import EventCard from './EventCard';
import EventModal from './EventModal';

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

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({ title: '', startTime: '', endTime: '', status: 'BUSY' });
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
          <EventCard
            key={event.id}
            event={event}
            onToggleSwappable={toggleSwappable}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {!loading && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px', color: '#9ca3af' }}>
            <Calendar size={64} style={{ margin: '0 auto 16px' }} />
            <p>No events yet. Create your first time slot!</p>
          </div>
        )}
      </div>

      <EventModal
        isOpen={showModal}
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
        editingEvent={editingEvent}
      />
    </div>
  );
};

export default Dashboard;