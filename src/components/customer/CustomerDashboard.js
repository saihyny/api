import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  QrCode, 
  Calendar, 
  Clock, 
  Star,
  ChevronRight,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const recentAppointments = [
    {
      id: '1',
      shopName: 'Mike\'s Barbershop',
      service: 'Haircut',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'confirmed',
      barber: 'Mike Smith'
    },
    {
      id: '2',
      shopName: 'Style Studio',
      service: 'Beard Trim',
      date: '2024-01-15',
      time: '2:30 PM',
      status: 'completed',
      barber: 'John Doe'
    }
  ];

  const nearbyShops = [
    {
      id: '1',
      name: 'Mike\'s Barbershop',
      address: '123 Main St',
      distance: '0.3 mi',
      rating: 4.8,
      services: ['Haircut', 'Beard Trim'],
      nextAvailable: '10:00 AM'
    },
    {
      id: '2',
      name: 'Style Studio',
      address: '456 Oak Ave',
      distance: '0.5 mi',
      rating: 4.6,
      services: ['Haircut', 'Shampoo'],
      nextAvailable: '11:30 AM'
    },
    {
      id: '3',
      name: 'Classic Cuts',
      address: '789 Pine St',
      distance: '0.7 mi',
      rating: 4.9,
      services: ['Haircut', 'Beard Trim', 'Shave'],
      nextAvailable: '2:00 PM'
    }
  ];

  const quickActions = [
    {
      title: 'Scan QR Code',
      description: 'Book instantly',
      icon: <QrCode size={24} />,
      link: '/customer/scan',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Find Shops',
      description: 'Discover nearby',
      icon: <MapPin size={24} />,
      link: '/customer/discover',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'My Bookings',
      description: 'View appointments',
      icon: <Calendar size={24} />,
      link: '/customer/appointments',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted text-sm">Ready for your next appointment?</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card text-center p-4 block hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                {action.icon}
              </div>
              <h3 className="font-medium text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Recent Appointments</h2>
          <Link to="/customer/appointments" className="text-accent text-sm font-medium">
            View All
          </Link>
        </div>

        {recentAppointments.length > 0 ? (
          <div className="space-y-3">
            {recentAppointments.slice(0, 2).map((appointment) => (
              <div key={appointment.id} className="card appointment-card">
                <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{appointment.shopName}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted">
                    <Clock size={14} />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted mb-2">
                  {appointment.service} with {appointment.barber}
                </p>
                
                <p className="text-sm font-medium">
                  {new Date(appointment.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Calendar className="empty-state-icon" />
            <h3 className="empty-state-title">No appointments yet</h3>
            <p className="empty-state-description">
              Book your first appointment to get started
            </p>
            <Link to="/customer/discover" className="btn btn-primary">
              Find Barbershops
            </Link>
          </div>
        )}
      </div>

      {/* Nearby Shops */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Nearby Shops</h2>
          <Link to="/customer/discover" className="text-accent text-sm font-medium">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {nearbyShops.slice(0, 3).map((shop) => (
            <Link
              key={shop.id}
              to={`/customer/book/${shop.id}`}
              className="card shop-card block"
            >
              <div className="shop-distance">{shop.distance}</div>
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{shop.name}</h3>
                  <p className="text-sm text-muted mb-2">{shop.address}</p>
                  
                  <div className="shop-rating">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`star ${i < Math.floor(shop.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted ml-2">{shop.rating}</span>
                  </div>
                </div>
                
                <ChevronRight size={16} className="text-muted" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted">
                  <Clock size={12} />
                  <span>Next: {shop.nextAvailable}</span>
                </div>
                <span className="text-accent font-medium">Book Now</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;