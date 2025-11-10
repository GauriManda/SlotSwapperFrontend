import React, { useState } from 'react';
import { ArrowLeftRight, Clock, Users, CalendarCheck, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: '#ffffff',
      }}
    >
      {/* LEFT SIDE - BRANDING */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 60px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Background Elements */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        ></div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Logo Icon */}
          <div
            style={{
              width: '110px',
              height: '110px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              backdropFilter: 'blur(12px)',
              border: '3px solid rgba(255,255,255,0.25)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            }}
          >
            <ArrowLeftRight size={56} color="white" strokeWidth={2.5} />
          </div>

          {/* Branding Title */}
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '900',
              letterSpacing: '-0.5px',
              marginBottom: '20px',
            }}
          >
            SlotSwapper
          </h1>

          {/* Product tagline */}
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500',
              lineHeight: '1.6',
              maxWidth: '420px',
              margin: '0 auto 40px',
            }}
          >
            Simplify your scheduling life — swap, request, and manage work slots effortlessly with your peers.
          </p>

          {/* Key Highlights Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '15px',
                background: 'rgba(255,255,255,0.12)',
                padding: '10px 18px',
                borderRadius: '12px',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Clock size={18} color="white" />
              <span>Instant time slot swaps</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '15px',
                background: 'rgba(255,255,255,0.12)',
                padding: '10px 18px',
                borderRadius: '12px',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Users size={18} color="white" />
              <span>Collaborate with team members</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '15px',
                background: 'rgba(255,255,255,0.12)',
                padding: '10px 18px',
                borderRadius: '12px',
                backdropFilter: 'blur(6px)',
              }}
            >
              <CalendarCheck size={18} color="white" />
              <span>Keep your schedule always updated</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          background: '#fafafa',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '8px',
              }}
            >
              {isLogin ? 'Welcome Back 👋' : 'Create Your Account'}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              {isLogin
                ? 'Login to manage and swap your work slots with ease.'
                : 'Join SlotSwapper and take control of your schedule.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <User size={20} color="#9ca3af" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    placeholder="John Doe"
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapper}>
                  <Mail size={20} color="#9ca3af" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapper}>
                  <Lock size={20} color="#9ca3af" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '14px',
                  marginBottom: '24px',
                  fontWeight: '500',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading
                  ? '#d1d5db'
                  : 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading
                  ? 'none'
                  : '0 4px 12px rgba(249, 115, 22, 0.3)',
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow =
                    '0 6px 16px rgba(249, 115, 22, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow =
                  '0 4px 12px rgba(249, 115, 22, 0.3)';
              }}
            >
              {loading
                ? 'Processing...'
                : isLogin
                ? 'Log In'
                : 'Create Account'}
            </button>

            <div
              style={{
                textAlign: 'center',
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                {isLogin
                  ? "Don't have an account? "
                  : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f97316',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700',
                }}
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Small helper styles
const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '8px',
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px 14px 48px',
  border: '2px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: '500',
  color: '#111827',
  background: 'white',
  transition: 'all 0.2s',
  outline: 'none',
};

const iconWrapper = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
};

const focusStyle = (e) => {
  e.target.style.borderColor = '#f97316';
  e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
};

const blurStyle = (e) => {
  e.target.style.borderColor = '#e5e7eb';
  e.target.style.boxShadow = 'none';
};

export default AuthPage;
