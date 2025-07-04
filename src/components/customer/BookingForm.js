import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BookingForm = () => {
  const { shopId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [shop, setShop] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  // Mock shop data
  const mockShops = {
    '1': {
      id: '1',
      name: 'Mike\'s Barbershop',
      address: '123 Main St, New York, NY',
      phone: '+1 (555) 123-4567',
      barber: 'Mike Smith',
      services: [
        { id: '1', name: 'Haircut', duration: 30, price: 25 },
        { id: '2', name: 'Beard Trim', duration: 15, price: 15 },
        { id: '3', name: 'Hair Wash', duration: 10, price: 10 },
        { id: '4', name: 'Full Service', duration: 60, price: 45 }
      ],
      availableSlots: {
        '2024-01-20': ['09:00', '09:30', '10:00', '11:00', '14:00', '15:00', '16:00'],
        '2024-01-21': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:30', '16:30'],
        '2024-01-22': ['09:30', '10:30', '11:30', '14:30', '15:00', '16:00', '17:00']
      }
    },
    '2': {
      id: '2',
      name: 'Style Studio',
      address: '456 Oak Ave, New York, NY',
      phone: '+1 (555) 987-6543',
      barber: 'John Doe',
      services: [
        { id: '1', name: 'Haircut', duration: 45, price: 30 },
        { id: '2', name: 'Hair Wash', duration: 20, price: 12 },
        { id: '3', name: 'Styling', duration: 30, price: 25 }
      ],
      availableSlots: {
        '2024-01-20': ['10:00', '11:30', '14:00', '15:30', '17:00'],
        '2024-01-21': ['09:00', '10:30', '12:00', '14:30', '16:00'],
        '2024-01-22': ['09:30', '11:00', '13:30', '15:00', '16:30']
      }
    }
  };

  useEffect(() => {
    loadShopData();
  }, [shopId]);

  const loadShopData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const shopData = mockShops[shopId];
    if (shopData) {
      setShop(shopData);
      // Auto-select first service
      if (shopData.services.length > 0) {
        setSelectedService(shopData.services[0]);
      }
    } else {
      toast.error('Shop not found');
      navigate('/customer/discover');
    }
    setLoading(false);
  };

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Check if shop has availability on this date
      if (shop?.availableSlots[dateString]) {
        dates.push({
          value: dateString,
          label: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          isToday: i === 0
        });
      }
    }
    
    return dates;
  };

  const getAvailableTimeSlots = () => {
    if (!shop || !selectedDate) return [];
    
    const slots = shop.availableSlots[selectedDate] || [];
    return slots.map(time => ({
      value: time,
      label: formatTime(time)
    }));
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please select service, date, and time');
      return;
    }

    setBooking(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingData = {
        id: Date.now().toString(),
        shopId: shop.id,
        shopName: shop.name,
        barber: shop.barber,
        service: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        duration: selectedService.duration,
        price: selectedService.price,
        notes: notes,
        status: 'confirmed',
        customerName: user.name,
        customerPhone: user.phone
      };

      // Save to localStorage (in real app, this would be sent to API)
      const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      existingAppointments.push(bookingData);
      localStorage.setItem('appointments', JSON.stringify(existingAppointments));

      toast.success('Appointment booked successfully!');
      navigate('/customer/appointments');
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton skeleton-title mb-4"></div>
        <div className="skeleton skeleton-card mb-4"></div>
        <div className="skeleton skeleton-card"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3 className="empty-state-title">Shop not found</h3>
          <p className="empty-state-description">
            The barbershop you're looking for doesn't exist or is no longer available.
          </p>
          <button onClick={() => navigate('/customer/discover')} className="btn btn-primary">
            Find Other Shops
          </button>
        </div>
      </div>
    );
  }

  const availableDates = generateAvailableDates();
  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{shop.name}</h1>
          <p className="text-sm text-muted">{shop.address}</p>
        </div>
      </div>

      {/* Service Selection */}
      <div className="form-section">
        <h2 className="form-section-title">Select Service</h2>
        <div className="service-grid">
          {shop.services.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
            >
              <div className="service-info">
                <div className="service-name">{service.name}</div>
                <div className="service-duration">{service.duration} minutes</div>
              </div>
              <div className="service-price">${service.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="form-section">
        <h2 className="form-section-title">Select Date</h2>
        <div className="grid grid-cols-2 gap-3">
          {availableDates.map((date) => (
            <button
              key={date.value}
              onClick={() => {
                setSelectedDate(date.value);
                setSelectedTime(''); // Reset time when date changes
              }}
              className={`btn ${selectedDate === date.value ? 'btn-primary' : 'btn-secondary'} text-left`}
            >
              <Calendar size={16} />
              <div>
                <div className="font-medium">{date.label}</div>
                {date.isToday && <div className="text-xs opacity-75">Today</div>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="form-section">
          <h2 className="form-section-title">Select Time</h2>
          <div className="time-slot-grid">
            {availableTimeSlots.map((slot) => (
              <button
                key={slot.value}
                onClick={() => setSelectedTime(slot.value)}
                className={`time-slot ${selectedTime === slot.value ? 'selected' : ''}`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="form-section">
        <h2 className="form-section-title">Additional Notes (Optional)</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests or notes for the barber..."
          className="input resize-none"
          rows="3"
          maxLength="200"
        />
        <p className="text-xs text-muted mt-1">{notes.length}/200 characters</p>
      </div>

      {/* Booking Summary */}
      {selectedService && selectedDate && selectedTime && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Service:</span>
              <span className="font-medium">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Barber:</span>
              <span className="font-medium">{shop.barber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Date:</span>
              <span className="font-medium">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Time:</span>
              <span className="font-medium">{formatTime(selectedTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Duration:</span>
              <span className="font-medium">{selectedService.duration} minutes</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total:</span>
              <span className="text-accent">${selectedService.price}</span>
            </div>
          </div>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBooking}
        disabled={!selectedService || !selectedDate || !selectedTime || booking}
        className={`btn btn-primary btn-lg btn-full ${booking ? 'loading' : ''}`}
      >
        {!booking && <CheckCircle size={20} />}
        {booking ? 'Booking Appointment...' : 'Confirm Booking'}
      </button>

      {/* Contact Info */}
      <div className="card mt-6">
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-muted mb-2">
          Contact the shop directly if you need to make changes or have questions.
        </p>
        <p className="text-sm font-medium">{shop.phone}</p>
      </div>
    </div>
  );
};

export default BookingForm;