import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Layout from './components/Layout';
import Home from './components/Home';
import UserTypeSelection from './components/UserTypeSelection';
import Login from './components/Login';
import Register from './components/Register';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ShopDiscovery from './components/customer/ShopDiscovery';
import QRScanner from './components/customer/QRScanner';
import BookingForm from './components/customer/BookingForm';
import CustomerAppointments from './components/customer/CustomerAppointments';
import BarberDashboard from './components/barber/BarberDashboard';
import BarberProfile from './components/barber/BarberProfile';
import AppointmentManagement from './components/barber/AppointmentManagement';
import QRGenerator from './components/barber/QRGenerator';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import './App.css';

// Protected Route Component
function ProtectedRoute({ children, allowedUserTypes = [] }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Main App Component
function App() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    // PWA install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    const result = await installPrompt.prompt();
    console.log('Install prompt result:', result);
    setInstallPrompt(null);
    setIsInstallable(false);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent 
          isInstallable={isInstallable}
          onInstallClick={handleInstallClick}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent({ isInstallable, onInstallClick }) {
  const { theme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="App">
      <Router>
        <Layout isInstallable={isInstallable} onInstallClick={onInstallClick}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/user-type" element={<UserTypeSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Customer Routes */}
            <Route path="/customer/*" element={
              <ProtectedRoute allowedUserTypes={['customer']}>
                <Routes>
                  <Route path="/" element={<CustomerDashboard />} />
                  <Route path="/discover" element={<ShopDiscovery />} />
                  <Route path="/scan" element={<QRScanner />} />
                  <Route path="/book/:shopId?" element={<BookingForm />} />
                  <Route path="/appointments" element={<CustomerAppointments />} />
                </Routes>
              </ProtectedRoute>
            } />
            
            {/* Barber Routes */}
            <Route path="/barber/*" element={
              <ProtectedRoute allowedUserTypes={['barber']}>
                <Routes>
                  <Route path="/" element={<BarberDashboard />} />
                  <Route path="/profile" element={<BarberProfile />} />
                  <Route path="/appointments" element={<AppointmentManagement />} />
                  <Route path="/qr-code" element={<QRGenerator />} />
                </Routes>
              </ProtectedRoute>
            } />
            
            {/* Auto-redirect based on user type */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                {user?.userType === 'customer' ? 
                  <Navigate to="/customer" replace /> : 
                  <Navigate to="/barber" replace />
                }
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
      
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--error)',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
