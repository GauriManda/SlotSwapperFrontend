import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Users, Lightbulb, Loader2 } from 'lucide-react';
import { API } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import SlotCard from './SlotCard';

const BrowseSlots = () => {
  const { user } = useAuth();
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedMySlot, setSelectedMySlot] = useState(null);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTip, setShowTip] = useState(true);

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
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 24px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '6px',
            letterSpacing: '-0.5px',
          }}
        >
          Browse & Swap Slots
        </h2>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Connect with peers and exchange your available time slots easily.
        </p>
      </div>

      {/* How to Swap Tip */}
      {showTip && (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '18px 22px',
            marginBottom: '28px',
            borderLeft: '5px solid #f97316',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            position: 'relative',
            transition: 'all 0.3s',
          }}
        >
          <button
            onClick={() => setShowTip(false)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '0',
            }}
          >
            ×
          </button>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
            <Lightbulb size={22} color="#f97316" style={{ flexShrink: 0 }} />
            <div>
              <p
                style={{
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '6px',
                  fontSize: '15px',
                }}
              >
                How to Swap Slots
              </p>
              <p
                style={{
                  color: '#475569',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
              >
                Select one of your swappable slots, choose an available one, and click
                <b> Send Request</b> at the bottom. You’ll be notified once the other user responds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            color: '#64748b',
          }}
        >
          <Loader2 size={40} className="spin" />
        </div>
      ) : (
        <>
          {/* Slots Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              marginBottom: '40px',
            }}
          >
            {/* Your Slots */}
            <div>
              <div
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  marginBottom: '18px',
                  borderLeft: '4px solid #f97316',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                  }}
                >
                  Your Slots
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '14px' }}>
                {mySwappableSlots.length > 0 ? (
                  mySwappableSlots.map((slot) => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      isSelected={selectedMySlot === slot.id}
                      onClick={() => setSelectedMySlot(slot.id)}
                      color="#f97316"
                    />
                  ))
                ) : (
                  <EmptyState
                    icon={<Users size={42} color="#cbd5e1" />}
                    title="No Swappable Slots"
                    subtitle="Mark a slot as swappable in your dashboard."
                  />
                )}
              </div>
            </div>

            {/* Available Slots */}
            <div>
              <div
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  marginBottom: '18px',
                  borderLeft: '4px solid #10b981',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                  }}
                >
                  Available Slots
                </h3>
              </div>
              <div style={{ display: 'grid', gap: '14px' }}>
                {swappableSlots.length > 0 ? (
                  swappableSlots.map((slot) => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      isSelected={selectedTheirSlot === slot.id}
                      onClick={() => setSelectedTheirSlot(slot.id)}
                      showUser={true}
                      color="#10b981"
                    />
                  ))
                ) : (
                  <EmptyState
                    icon={<ArrowLeftRight size={42} color="#cbd5e1" />}
                    title="No Available Slots"
                    subtitle="Check back later when others share their slots."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Swap Request Floating Bar */}
          {selectedMySlot && selectedTheirSlot && (
            <div
              style={{
                position: 'fixed',
                bottom: '28px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                padding: '18px 28px',
                borderRadius: '14px',
                boxShadow: '0 6px 30px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                border: '1px solid #e2e8f0',
                maxWidth: '520px',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: '#f97316',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowLeftRight size={22} color="white" strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontWeight: '700',
                    fontSize: '15px',
                    color: '#1e293b',
                    marginBottom: '2px',
                  }}
                >
                  Ready to send swap request?
                </p>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Review your selection and click send.
                </p>
              </div>
              <button
                onClick={handleSwapRequest}
                style={{
                  padding: '10px 22px',
                  background: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#ea580c')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#f97316')}
              >
                Send Request
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Reusable empty state component
const EmptyState = ({ icon, title, subtitle }) => (
  <div
    style={{
      background: 'white',
      borderRadius: '12px',
      padding: '48px 24px',
      textAlign: 'center',
      border: '2px dashed #e2e8f0',
      transition: 'all 0.2s',
    }}
  >
    <div style={{ marginBottom: '12px' }}>{icon}</div>
    <p style={{ color: '#475569', fontSize: '15px', fontWeight: '600' }}>{title}</p>
    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>{subtitle}</p>
  </div>
);

export default BrowseSlots;
