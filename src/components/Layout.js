import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Scissors, 
  Home, 
  Calendar, 
  QrCode, 
  MapPin, 
  User, 
  Moon, 
  Sun,
  Download,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children, isInstallable, onInstallClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Don't show navigation on auth pages
  const hideNavigation = ['/login', '/register', '/user-type'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      {!hideNavigation && (
        <div className="nav-container safe-area-inset-top">
          <nav className="nav">
            <Link to="/" className="nav-brand">
              <Scissors size={24} />
              <span>BarberEase</span>
            </Link>
            
            <div className="nav-actions">
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              {user && (
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content flex-1">
        {children}
      </main>

      {/* PWA Install Banner */}
      {isInstallable && (
        <div className="install-banner">
          <div className="install-banner-content">
            <div className="install-banner-text">
              <div className="install-banner-title">Install BarberEase</div>
              <div className="install-banner-subtitle">
                Get the full app experience
              </div>
            </div>
            <button 
              onClick={onInstallClick}
              className="btn btn-secondary btn-sm"
            >
              <Download size={16} />
              Install
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {user && !hideNavigation && (
        <div className="bottom-nav safe-area-inset-bottom">
          <div className="bottom-nav-container">
            {user.userType === 'customer' ? (
              <>
                <Link
                  to="/customer"
                  className={`bottom-nav-item ${isActive('/customer') && !location.pathname.includes('/customer/') ? 'active' : ''}`}
                >
                  <Home size={20} />
                  <span className="bottom-nav-text">Home</span>
                </Link>
                
                <Link
                  to="/customer/discover"
                  className={`bottom-nav-item ${isActive('/customer/discover') ? 'active' : ''}`}
                >
                  <MapPin size={20} />
                  <span className="bottom-nav-text">Discover</span>
                </Link>
                
                <Link
                  to="/customer/scan"
                  className={`bottom-nav-item ${isActive('/customer/scan') ? 'active' : ''}`}
                >
                  <QrCode size={20} />
                  <span className="bottom-nav-text">Scan</span>
                </Link>
                
                <Link
                  to="/customer/appointments"
                  className={`bottom-nav-item ${isActive('/customer/appointments') ? 'active' : ''}`}
                >
                  <Calendar size={20} />
                  <span className="bottom-nav-text">Bookings</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/barber"
                  className={`bottom-nav-item ${isActive('/barber') && !location.pathname.includes('/barber/') ? 'active' : ''}`}
                >
                  <Home size={20} />
                  <span className="bottom-nav-text">Dashboard</span>
                </Link>
                
                <Link
                  to="/barber/appointments"
                  className={`bottom-nav-item ${isActive('/barber/appointments') ? 'active' : ''}`}
                >
                  <Calendar size={20} />
                  <span className="bottom-nav-text">Appointments</span>
                </Link>
                
                <Link
                  to="/barber/qr-code"
                  className={`bottom-nav-item ${isActive('/barber/qr-code') ? 'active' : ''}`}
                >
                  <QrCode size={20} />
                  <span className="bottom-nav-text">QR Code</span>
                </Link>
                
                <Link
                  to="/barber/profile"
                  className={`bottom-nav-item ${isActive('/barber/profile') ? 'active' : ''}`}
                >
                  <Settings size={20} />
                  <span className="bottom-nav-text">Profile</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;