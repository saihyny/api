import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Calendar, MapPin, QrCode, Star, Clock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      navigate(user.userType === 'customer' ? '/customer' : '/barber');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <QrCode size={24} />,
      title: 'QR Code Booking',
      description: 'Scan shop QR codes for instant appointment booking'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Discover Nearby',
      description: 'Find the best barbershops in your area'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Easy Scheduling',
      description: 'Book and manage your appointments effortlessly'
    },
    {
      icon: <Clock size={24} />,
      title: 'Real-time Updates',
      description: 'Get instant notifications about your bookings'
    },
    {
      icon: <Star size={24} />,
      title: 'Reviews & Ratings',
      description: 'Read reviews and rate your barber experience'
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure & Private',
      description: 'Your data is safe and protected with us'
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
            <Scissors size={48} className="text-white" />
          </div>
        </div>
        
        <h1 className="page-title">
          Welcome to <span className="text-accent">BarberEase</span>
        </h1>
        
        <p className="page-subtitle mb-8">
          The modern way to book appointments at your favorite barbershop. 
          Quick, easy, and hassle-free.
        </p>

        <div className="flex flex-col gap-4 mb-8">
          <Link 
            to="/user-type" 
            className="btn btn-primary btn-lg btn-full"
          >
            Get Started
          </Link>
          
          <Link 
            to="/login" 
            className="btn btn-secondary btn-lg btn-full"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-center font-semibold text-lg mb-6 text-primary">
          Why Choose BarberEase?
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card text-center p-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-center mb-3 text-accent">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-xs text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title text-sm">Demo Credentials</h3>
          <p className="card-subtitle">Try the app with these test accounts</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2 text-accent">Customer Account</h4>
            <div className="text-xs text-muted">
              <p>Email: customer@example.com</p>
              <p>Password: password123</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2 text-accent">Barber Account</h4>
            <div className="text-xs text-muted">
              <p>Email: barber@example.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <p className="text-sm text-muted mb-4">
          Join thousands of users who trust BarberEase for their grooming needs
        </p>
        
        <div className="flex items-center justify-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" />
            <span>4.9 Rating</span>
          </div>
          <div className="w-1 h-1 bg-muted rounded-full"></div>
          <div>10k+ Users</div>
          <div className="w-1 h-1 bg-muted rounded-full"></div>
          <div>500+ Shops</div>
        </div>
      </div>
    </div>
  );
};

export default Home;