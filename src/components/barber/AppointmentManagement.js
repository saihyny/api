import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, User, Filter, Check, X, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AppointmentManagement = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('today');
  const [loading, setLoading] = useState(true);

  const filters = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' }
  ];

  // Mock appointment data
  const mockAppointments = [
    {
      id: '1',
      customerName: 'John Doe',
      customerPhone: '+1 (555) 123-4567',
      service: 'Haircut',
      date: '2024-01-20',
      time: '09:00',
      duration: 30,
      price: 25,
      status: 'confirmed',
      notes: 'Regular trim, not too short',
      isNewCustomer: false
    },
    {
      id: '2',
      customerName: 'Mike Johnson',
      customerPhone: '+1 (555) 987-6543',
      service: 'Beard Trim',
      date: '2024-01-20',
      time: '10:30',
      duration: 15,
      price: 15,
      status: 'confirmed',
      notes: '',
      isNewCustomer: false
    },
    {
      id: '3',
      customerName: 'David Smith',
      customerPhone: '+1 (555) 456-7890',
      service: 'Full Service',
      date: '2024-01-20',
      time: '14:00',
      duration: 60,
      price: 45,
      status: 'pending',
      notes: 'First time customer, wants consultation',
      isNewCustomer: true
    },
    {
      id: '4',
      customerName: 'Robert Brown',
      customerPhone: '+1 (555) 234-5678',
      service: 'Haircut',
      date: '2024-01-21',
      time: '16:00',
      duration: 30,
      price: 25,
      status: 'confirmed',
      notes: '',
      isNewCustomer: false
    },
    {
      id: '5',
      customerName: 'Alex Wilson',
      customerPhone: '+1 (555) 345-6789',
      service: 'Beard Trim',
      date: '2024-01-22',
      time: '11:00',
      duration: 15,
      price: 15,
      status: 'pending',
      notes: 'Prefers specific style',
      isNewCustomer: true
    }
  ];

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, activeFilter]);

  const loadAppointments = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Sort appointments by date and time
    const sortedAppointments = mockAppointments.sort((a, b) => {
      const dateTimeA = new Date(a.date + ' ' + a.time);
      const dateTimeB = new Date(b.date + ' ' + b.time);
      return dateTimeA - dateTimeB;
    });
    
    setAppointments(sortedAppointments);
    setLoading(false);
  };

  const filterAppointments = () => {
    let filtered = appointments;
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    switch (activeFilter) {
      case 'today':
        const todayStr = today.toISOString().split('T')[0];
        filtered = appointments.filter(apt => apt.date === todayStr);
        break;
      case 'week':
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        filtered = appointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= startOfWeek && aptDate <= endOfWeek;
        });
        break;
      case 'pending':
        filtered = appointments.filter(apt => apt.status === 'pending');
        break;
      case 'confirmed':
        filtered = appointments.filter(apt => apt.status === 'confirmed');
        break;
      default:
        filtered = appointments;
    }

    setFilteredAppointments(filtered);
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const updatedAppointments = appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      );
      
      setAppointments(updatedAppointments);
      toast.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
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

  const callCustomer = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Appointment Management</h1>
          <p className="page-subtitle">Loading appointments...</p>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Appointments</h1>
        <p className="page-subtitle">
          Manage your appointment bookings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`btn btn-sm whitespace-nowrap ${
              activeFilter === filter.key ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {filter.label}
            {filter.key === 'today' && (
              <span className="ml-1">
                ({appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-number">
            {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
          </div>
          <div className="stat-label">Today</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {appointments.filter(apt => apt.status === 'pending').length}
          </div>
          <div className="stat-label">Pending</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {appointments.filter(apt => apt.status === 'confirmed').length}
          </div>
          <div className="stat-label">Confirmed</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">
            {appointments.filter(apt => apt.isNewCustomer).length}
          </div>
          <div className="stat-label">New Customers</div>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="card appointment-card">
              <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </div>
              
              {appointment.isNewCustomer && (
                <div className="absolute top-4 left-4">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    New Customer
                  </span>
                </div>
              )}

              {/* Appointment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={16} className="text-muted" />
                    <span className="font-medium">{formatDate(appointment.date)}</span>
                    <Clock size={16} className="text-muted" />
                    <span className="font-medium">{formatTime(appointment.time)}</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1">
                    {appointment.customerName}
                  </h3>
                  <p className="text-sm text-muted mb-2">
                    {appointment.service} • {appointment.duration} minutes
                  </p>
                  
                  {appointment.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Note: </span>
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="text-right ml-4">
                  <p className="text-lg font-semibold text-accent mb-2">
                    ${appointment.price}
                  </p>
                  
                  <button className="btn btn-ghost btn-sm">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-2 mb-4">
                <Phone size={16} className="text-muted" />
                <span className="text-sm">{appointment.customerPhone}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {appointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      <Check size={16} />
                      Confirm
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      className="btn btn-secondary btn-sm"
                    >
                      <X size={16} />
                    </button>
                  </>
                )}
                
                {appointment.status === 'confirmed' && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    <Check size={16} />
                    Mark Complete
                  </button>
                )}
                
                <button
                  onClick={() => callCustomer(appointment.customerPhone)}
                  className="btn btn-secondary btn-sm"
                >
                  <Phone size={16} />
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Calendar className="empty-state-icon" />
          <h3 className="empty-state-title">
            {activeFilter === 'all' 
              ? 'No appointments yet'
              : `No ${activeFilter} appointments`
            }
          </h3>
          <p className="empty-state-description">
            {activeFilter === 'today'
              ? 'No appointments scheduled for today'
              : activeFilter === 'pending'
              ? 'All appointments are confirmed'
              : 'Appointments will appear here when customers book'
            }
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card mt-8">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActiveFilter('pending')}
            className="btn btn-secondary text-left"
          >
            <div>
              <p className="font-medium">Review Pending</p>
              <p className="text-sm text-muted">
                {appointments.filter(apt => apt.status === 'pending').length} pending
              </p>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveFilter('today')}
            className="btn btn-secondary text-left"
          >
            <div>
              <p className="font-medium">Today's Schedule</p>
              <p className="text-sm text-muted">
                {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length} appointments
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;