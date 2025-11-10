import React from 'react';
import { Clock, ArrowLeftRight, Edit2, Trash2 } from 'lucide-react';

const EventCard = ({ event, onToggleSwappable, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'BUSY': return '#ef4444';
      case 'SWAPPABLE': return '#10b981';
      case 'SWAP_PENDING': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: `3px solid ${getStatusColor(event.status)}` }}>
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
              onClick={() => onToggleSwappable(event)}
              style={{ padding: '8px', background: event.status === 'SWAPPABLE' ? '#fee2e2' : '#dcfce7', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              title={event.status === 'SWAPPABLE' ? 'Mark as Busy' : 'Mark as Swappable'}
            >
              <ArrowLeftRight size={18} color={event.status === 'SWAPPABLE' ? '#dc2626' : '#16a34a'} />
            </button>
          )}
          <button onClick={() => onEdit(event)} style={{ padding: '8px', background: '#dbeafe', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            <Edit2 size={18} color="#2563eb" />
          </button>
          <button onClick={() => onDelete(event.id)} style={{ padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            <Trash2 size={18} color="#dc2626" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;