import React from 'react';
import { Calendar, Users, ArrowLeftRight, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        background: 'white',
        borderBottom: '2px solid #e5e7eb',
        padding: '16px 40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                background: '#f97316',
                borderRadius: '10px',
              }}
            >
              <ArrowLeftRight size={26} color="white" strokeWidth={2.5} />
            </div>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: '900',
                color: '#1a202c',
                letterSpacing: '-0.5px',
              }}
            >
              SlotSwapper
            </h1>
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{
                padding: '12px 24px',
                background: currentPage === 'dashboard' ? '#f97316' : 'transparent',
                color: currentPage === 'dashboard' ? 'white' : '#718096',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (currentPage !== 'dashboard') {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.color = '#1a202c';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 'dashboard') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#718096';
                }
              }}
            >
              <Calendar size={20} strokeWidth={2.5} /> Dashboard
            </button>

            <button
              onClick={() => setCurrentPage('marketplace')}
              style={{
                padding: '12px 24px',
                background: currentPage === 'marketplace' ? '#f97316' : 'transparent',
                color: currentPage === 'marketplace' ? 'white' : '#718096',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (currentPage !== 'marketplace') {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.color = '#1a202c';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 'marketplace') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#718096';
                }
              }}
            >
              <Users size={20} strokeWidth={2.5} /> Browse Slots
            </button>

            <button
              onClick={() => setCurrentPage('requests')}
              style={{
                padding: '12px 24px',
                background: currentPage === 'requests' ? '#f97316' : 'transparent',
                color: currentPage === 'requests' ? 'white' : '#718096',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (currentPage !== 'requests') {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.color = '#1a202c';
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 'requests') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#718096';
                }
              }}
            >
              <ArrowLeftRight size={20} strokeWidth={2.5} /> Requests
            </button>
          </div>
        </div>

        {/* Right Section (User Info + Logout) */}
       {/* Right Section (User Info + Logout) */}
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
  {/* User Avatar + Info */}
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '6px 10px',
      background: '#f9fafb',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s ease',
    }}
    onMouseOver={(e) => (e.currentTarget.style.background = '#f3f4f6')}
    onMouseOut={(e) => (e.currentTarget.style.background = '#f9fafb')}
  >
    {/* Avatar Circle */}
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#f97316',
        color: 'white',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0,
        textTransform: 'uppercase',
      }}
    >
      {user?.name ? user.name.charAt(0) : 'U'}
    </div>

    {/* Name + Email */}
    <div style={{ lineHeight: '1.2' }}>
      <p
        style={{
          fontWeight: '700',
          color: '#1a202c',
          fontSize: '15px',
          marginBottom: '2px',
        }}
      >
        {user?.name || 'User'}
      </p>
      <p
        style={{
          fontSize: '13px',
          color: '#6b7280',
          fontWeight: '500',
        }}
      >
        {user?.email || 'user@example.com'}
      </p>
    </div>
  </div>

  {/* Logout Button */}
  <button
    onClick={logout}
    style={{
      padding: '10px 18px',
      background: '#fee2e2',
      color: '#dc2626',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
    }}
    onMouseOver={(e) => (e.currentTarget.style.background = '#fecaca')}
    onMouseOut={(e) => (e.currentTarget.style.background = '#fee2e2')}
  >
    <LogOut size={18} strokeWidth={2.5} /> Logout
  </button>
</div>

          </div>
      
    </nav>
  );
};

export default Navigation;
