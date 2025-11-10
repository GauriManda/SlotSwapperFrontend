import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import BrowseSlots from './components/BrowseSlots';
import Requests from './components/Requests';

const AppContent = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'marketplace' && <Marketplace />}
        {currentPage === 'requests' && <Requests />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;