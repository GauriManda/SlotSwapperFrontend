import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const IncomingRequestCard = ({ request, onRespond }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
    <div style={{ marginBottom: '12px', padding: '8px', background: '#f3f4f6', borderRadius: '8px' }}>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
        From: {request.requester_name}
      </p>
    </div>

    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>They want to swap:</p>
      <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
        <p style={{ fontWeight: 'bold' }}>{request.requester_slot_title}</p>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          {new Date(request.requester_slot_start).toLocaleString()}
        </p>
      </div>

      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>For your slot:</p>
      <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '8px' }}>
        <p style={{ fontWeight: 'bold' }}>{request.recipient_slot_title}</p>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          {new Date(request.recipient_slot_start).toLocaleString()}
        </p>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '12px' }}>
      <button
        onClick={() => onRespond(request.id, true)}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        <CheckCircle size={18} /> Accept
      </button>
      <button
        onClick={() => onRespond(request.id, false)}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        <XCircle size={18} /> Reject
      </button>
    </div>
  </div>
);

export const OutgoingRequestCard = ({ request }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
    <div style={{ marginBottom: '12px', padding: '8px', background: '#f3f4f6', borderRadius: '8px' }}>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
        To: {request.recipient_name}
      </p>
    </div>

    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>Your slot:</p>
      <div style={{ background: '#dbeafe', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
        <p style={{ fontWeight: 'bold' }}>{request.requester_slot_title}</p>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          {new Date(request.requester_slot_start).toLocaleString()}
        </p>
      </div>

      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>Requested slot:</p>
      <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
        <p style={{ fontWeight: 'bold' }}>{request.recipient_slot_title}</p>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          {new Date(request.recipient_slot_start).toLocaleString()}
        </p>
      </div>
    </div>

    <div
      style={{
        display: 'inline-block',
        padding: '8px 16px',
        background: request.status === 'PENDING' ? '#fef3c7' : request.status === 'ACCEPTED' ? '#dcfce7' : '#fee2e2',
        color: request.status === 'PENDING' ? '#92400e' : request.status === 'ACCEPTED' ? '#166534' : '#991b1b',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
      }}
    >
      {request.status}
    </div>
  </div>
);