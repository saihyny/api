import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  QrCode,
  Settings,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BarberDashboard = () => {
  const { user } = useAuth();
  const [todayStats, setTodayStats] = useState({
    appointmentsToday: 0,
    revenue: 0,
    completedAppointments: 0,
    nextAppointment: null
  });
  
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    totalAppointments: 0,
    totalRevenue: 0,
    averageRating: 0,
    newCustomers: 0
  });

  // Mock appointments for today
  const mockTodayAppointments = [
    {
      id: '1',
      customerName: 'John Doe',
      customerPhone: '+1 (555) 123-4567',
      service: 'Haircut',
      time: '09:00',
      duration: 30,
      price: 25,
      status: 'confirmed',
      notes: 'Regular trim'
    },
    {
      id: '2',
      customerName: 'Mike Johnson',
      customerPhone: '+1 (555) 987-6543',
      service: 'Beard Trim',
      time: '10:30',
      duration: 15,
      price: 15,
      status: 'confirmed',
      notes: ''
    },
    {
      id: '3',
      customerName: 'David Smith',
      customerPhone: '+1 (555) 456-7890',
      service: 'Full Service',
      time: '14:00',
      duration: 60,
      price: 45,
      status: 'pending',
      notes: 'First time customer'
    },
    {
      id: '4',
      customerName: 'Robert Brown',
      customerPhone: '+1 (555) 234-5678',
      service: 'Haircut',
      time: '16:00',
      duration: 30,
      price: 25,
      status: 'confirmed',
      notes: ''
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    // Calculate today's stats
    const completedToday = mockTodayAppointments.filter(apt => {
      const aptTime = parseInt(apt.time.replace(':', ''));
      return aptTime < currentTime;
    });
    
    const nextApt = mockTodayAppointments.find(apt => {
      const aptTime = parseInt(apt.time.replace(':', ''));
      return aptTime > currentTime;
    });
    
    setTodayStats({
      appointmentsToday: mockTodayAppointments.length,
      revenue: completedToday.reduce((sum, apt) => sum + apt.price, 0),
      completedAppointments: completedToday.length,
      nextAppointment: nextApt
    });
    
    setTodayAppointments(mockTodayAppointments);
    
    // Mock weekly stats
    setWeeklyStats({
      totalAppointments: 42,
      totalRevenue: 1250,
      averageRating: 4.8,
      newCustomers: 8
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const quickActions = [
    {
      title: 'QR Code',
      description: 'Share your shop code',
      icon: <QrCode size={24} />,
      link: '/barber/qr-code',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Appointments',
      description: 'Manage bookings',
      icon: <Calendar size={24} />,
      link: '/barber/appointments',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Profile',
      description: 'Shop settings',
      icon: <Settings size={24} />,
      link: '/barber/profile',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted text-sm">{user?.shopName}</p>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-number">{todayStats.appointmentsToday}</div>
          <div className="stat-label">Today's Appointments</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">${todayStats.revenue}</div>
          <div className="stat-label">Today's Revenue</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{todayStats.completedAppointments}</div>
          <div className="stat-label">Completed</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{weeklyStats.averageRating}</div>
          <div className="stat-label">Rating</div>
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

      {/* Next Appointment */}
      {todayStats.nextAppointment && (
        <div className="card mb-8 border-l-4 border-l-accent">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={20} className="text-accent" />
            <h3 className="font-semibold">Next Appointment</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{todayStats.nextAppointment.customerName}</p>
              <p className="text-sm text-muted">
                {todayStats.nextAppointment.service} • {formatTime(todayStats.nextAppointment.time)}
              </p>
              {todayStats.nextAppointment.notes && (
                <p className="text-sm text-muted mt-1">
                  Note: {todayStats.nextAppointment.notes}
                </p>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-lg font-semibold text-accent">
                ${todayStats.nextAppointment.price}
              </p>
              <p className="text-sm text-muted">
                {todayStats.nextAppointment.duration} min
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button className="btn btn-primary btn-sm flex-1">
              Mark as Started
            </button>
            <button className="btn btn-secondary btn-sm">
              <Phone size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Today's Schedule</h2>
          <Link to="/barber/appointments" className="text-accent text-sm font-medium">
            View All
          </Link>
        </div>

        {todayAppointments.length > 0 ? (
          <div className="space-y-3">
            {todayAppointments.slice(0, 4).map((appointment) => (
              <div key={appointment.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{formatTime(appointment.time)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold mb-1">{appointment.customerName}</h3>
                    <p className="text-sm text-muted">
                      {appointment.service} • {appointment.duration} min
                    </p>
                    
                    {appointment.notes && (
                      <p className="text-sm text-muted mt-1">
                        Note: {appointment.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-accent">${appointment.price}</p>
                    <button className="btn btn-ghost btn-sm mt-1">
                      <Phone size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Calendar className="empty-state-icon" />
            <h3 className="empty-state-title">No appointments today</h3>
            <p className="empty-state-description">
              Enjoy your day off or use this time to update your shop profile
            </p>
          </div>
        )}
      </div>

      {/* Weekly Overview */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">This Week</h3>
          <p className="card-subtitle">Your business performance</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold">{weeklyStats.totalAppointments}</p>
              <p className="text-sm text-muted">Total Appointments</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold">${weeklyStats.totalRevenue}</p>
              <p className="text-sm text-muted">Total Revenue</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold">{weeklyStats.averageRating}/5</p>
              <p className="text-sm text-muted">Average Rating</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-semibold">{weeklyStats.newCustomers}</p>
              <p className="text-sm text-muted">New Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;