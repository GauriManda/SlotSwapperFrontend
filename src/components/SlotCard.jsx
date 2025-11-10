import React from 'react';
import { Clock } from 'lucide-react';

const SlotCard = ({ slot, isSelected, onClick, showUser = false, color = '#2563eb' }) => {
  return (
    <div
      onClick={onClick}
      style={{ 
        padding: '16px', 
        background: isSelected ? (color === '#16a34a' ? '#dcfce7' : '#dbeafe') : 'white', 
        border: isSelected ? `3px solid ${color}` : '2px solid #e5e7eb', 
        borderRadius: '12px', 
        cursor: 'pointer' 
      }}
    >
      <h4 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{slot.title}</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', fontSize: '14px', marginBottom: showUser ? '4px' : '0' }}>
        <Clock size={14} />
        <span>{new Date(slot.start_time).toLocaleString()}</span>
      </div>
      {showUser && (
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          by {slot.user_name}
        </div>
      )}
    </div>
  );
};

export default SlotCard;