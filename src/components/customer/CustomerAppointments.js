import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CustomerAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, activeFilter]);

  const loadAppointments = async () => {
    setLoading(true);
    
    // Load from localStorage (in real app, this would be an API call)
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Add some mock data for demonstration
    const mockAppointments = [
      {
        id: '1',
        shopId: '1',
        shopName: 'Mike\'s Barbershop',
        shopAddress: '123 Main St, New York, NY',
        shopPhone: '+1 (555) 123-4567',
        barber: 'Mike Smith',
        service: 'Haircut',
        date: '2024-01-25',
        time: '10:00',
        duration: 30,
        price: 25,
        status: 'confirmed',
        notes: 'Regular trim, not too short'
      },
      {
        id: '2',
        shopId: '2',
        shopName: 'Style Studio',
        shopAddress: '456 Oak Ave, New York, NY',
        shopPhone: '+1 (555) 987-6543',
        barber: 'John Doe',
        service: 'Beard Trim',
        date: '2024-01-15',
        time: '14:30',
        duration: 15,
        price: 15,
        status: 'completed',
        notes: ''
      }
    ];

    // Combine stored and mock appointments
    const allAppointments = [...storedAppointments, ...mockAppointments];
    
    // Sort by date (most recent first)
    allAppointments.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
    
    setAppointments(allAppointments);
    setLoading(false);
  };

  const filterAppointments = () => {
    let filtered = appointments;
    const now = new Date();

    switch (activeFilter) {
      case 'upcoming':
        filtered = appointments.filter(apt => {
          const aptDate = new Date(apt.date + ' ' + apt.time);
          return aptDate > now && apt.status !== 'cancelled';
        });
        break;
      case 'completed':
        filtered = appointments.filter(apt => apt.status === 'completed');
        break;
      case 'cancelled':
        filtered = appointments.filter(apt => apt.status === 'cancelled');
        break;
      default:
        filtered = appointments;
    }

    setFilteredAppointments(filtered);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
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

  const isUpcoming = (appointment) => {
    const aptDate = new Date(appointment.date + ' ' + appointment.time);
    return aptDate > new Date() && appointment.status !== 'cancelled';
  };

  const canCancel = (appointment) => {
    const aptDate = new Date(appointment.date + ' ' + appointment.time);
    const now = new Date();
    const hoursUntilAppointment = (aptDate - now) / (1000 * 60 * 60);
    return hoursUntilAppointment > 2 && appointment.status === 'confirmed';
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      // Update appointment status
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' }
          : apt
      );
      
      setAppointments(updatedAppointments);
      
      // Update localStorage
      const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const updatedStored = storedAppointments.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' }
          : apt
      );
      localStorage.setItem('appointments', JSON.stringify(updatedStored));
      
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Appointments</h1>
          <p className="page-subtitle">Loading your appointments...</p>
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
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">
          Manage your barbershop appointments
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
            {filter.key === 'all' && appointments.length > 0 && (
              <span className="ml-1">({appointments.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="card appointment-card">
              <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </div>
              
              {/* Appointment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {appointment.shopName}
                  </h3>
                  <p className="text-sm text-muted mb-2">
                    {appointment.service} with {appointment.barber}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{formatTime(appointment.time)}</span>
                    </div>
                  </div>
                </div>
                
                {isUpcoming(appointment) && (
                  <div className="flex items-center gap-2">
                    {canCancel(appointment) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="btn btn-ghost btn-sm text-red-600"
                      >
                        Cancel
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Appointment Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-muted flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{appointment.shopAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-muted" />
                  <p className="text-sm">{appointment.shopPhone}</p>
                </div>

                {appointment.notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-medium">Notes: </span>
                      {appointment.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-sm text-muted">
                    Duration: {appointment.duration} minutes
                  </div>
                  <div className="text-lg font-semibold text-accent">
                    ${appointment.price}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {isUpcoming(appointment) && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button className="btn btn-secondary btn-sm flex-1">
                    Get Directions
                  </button>
                  <button className="btn btn-secondary btn-sm flex-1">
                    Call Shop
                  </button>
                </div>
              )}
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
            {activeFilter === 'all'
              ? 'Book your first appointment to get started'
              : `You don't have any ${activeFilter} appointments`
            }
          </p>
          {activeFilter === 'all' && (
            <button 
              onClick={() => window.location.href = '/customer/discover'}
              className="btn btn-primary"
            >
              Find Barbershops
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {appointments.length > 0 && (
        <div className="card mt-8">
          <h3 className="font-semibold mb-4">Appointment Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {appointments.filter(apt => isUpcoming(apt)).length}
              </div>
              <div className="text-sm text-muted">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => apt.status === 'completed').length}
              </div>
              <div className="text-sm text-muted">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAppointments;