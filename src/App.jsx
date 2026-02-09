import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ContactList from './pages/ContactList';
import ContactAdd from './pages/ContactAdd';
import MyCard from './pages/MyCard';
import Scanner from './pages/Scanner';
import Settings from './pages/Settings';

import ContactDetail from './pages/ContactDetail';

import ContactEdit from './pages/ContactEdit';
import MyCardEdit from './pages/MyCardEdit';

import { ThemeProvider } from './context/ThemeContext';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ContactsProvider } from './context/ContactsContext';
import Login from './pages/Login';


import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';
import { storage } from './utils/storage';

// Wrapper to handle navigation state
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  
  // Automatic redirection logic
  useEffect(() => {
    if (!loading) {
      if (!currentUser && location.pathname !== '/login') {
        navigate('/login');
      } else if (currentUser && location.pathname === '/login') {
        navigate('/');
      }
    }
  }, [currentUser, loading, location.pathname, navigate]);

  // Determine active tab based on path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/contacts')) return 'contacts';
    if (path === '/scan') return 'scan';
    if (path === '/mycard') return 'mycard';
    if (path === '/settings') return 'settings';
    return 'home';
  };

  const handleTabChange = (tab) => {
    switch(tab) {
      case 'home': navigate('/'); break;
      case 'contacts': navigate('/contacts'); break;
      case 'scan': navigate('/scan'); break;
      case 'mycard': navigate('/mycard'); break;
      case 'settings': navigate('/settings'); break;
      default: navigate('/');
    }
  };

  // Hide BottomNav on login page or other full screen pages if needed
  const showBottomNav = location.pathname !== '/login';

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--primary-color)'
      }}>
        <div className="animate-pulse" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: '10px' }}>데이터 로딩 중...</div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>소중한 정보를 안전하게 가져오고 있습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/contacts" element={<ContactList />} />
        <Route path="/contacts/add" element={<ContactAdd />} />
        <Route path="/contacts/:id" element={<ContactDetail />} />
        <Route path="/contacts/edit/:id" element={<ContactEdit />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/mycard" element={<MyCard />} />
        <Route path="/mycard/edit" element={<MyCardEdit />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {showBottomNav && <BottomNav activeTab={getActiveTab()} onTabChange={handleTabChange} />}
    </div>
  );
};

function App() {
  useEffect(() => {
    // Clear legacy shared data once to fix account-leak issue
    storage.clearLegacyData();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ContactsProvider>
            <Router>
              <AppContent />
            </Router>
          </ContactsProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
