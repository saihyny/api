import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit3, MapPin, Phone, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BarberProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    shopName: user?.shopName || '',
    shopAddress: user?.shopAddress || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  const [services, setServices] = useState(user?.services || [
    { id: '1', name: 'Haircut', duration: 30, price: 25 },
    { id: '2', name: 'Beard Trim', duration: 15, price: 15 }
  ]);

  const [newService, setNewService] = useState({
    name: '',
    duration: '',
    price: ''
  });

  const [editingService, setEditingService] = useState(null);

  const tabs = [
    { key: 'profile', label: 'Shop Info' },
    { key: 'services', label: 'Services' },
    { key: 'hours', label: 'Hours' }
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(profileData);
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addService = () => {
    if (!newService.name || !newService.duration || !newService.price) {
      toast.error('Please fill in all service fields');
      return;
    }

    const service = {
      id: Date.now().toString(),
      name: newService.name,
      duration: parseInt(newService.duration),
      price: parseFloat(newService.price)
    };

    setServices(prev => [...prev, service]);
    setNewService({ name: '', duration: '', price: '' });
    toast.success('Service added successfully');
  };

  const updateService = (id, updatedService) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    ));
    setEditingService(null);
    toast.success('Service updated successfully');
  };

  const deleteService = (id) => {
    if (services.length <= 1) {
      toast.error('You must have at least one service');
      return;
    }

    setServices(prev => prev.filter(service => service.id !== id));
    toast.success('Service deleted successfully');
  };

  const saveServices = async () => {
    setLoading(true);
    try {
      await updateProfile({ services });
      toast.success('Services updated successfully');
    } catch (error) {
      toast.error('Failed to update services');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Shop Profile</h1>
        <p className="page-subtitle">
          Manage your shop information and services
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn btn-sm whitespace-nowrap ${
              activeTab === tab.key ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Basic Information</h3>
              <p className="card-subtitle">Update your personal and shop details</p>
            </div>

            <div className="space-y-4">
              <div className="input-group">
                <label htmlFor="name" className="input-label">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input"
                  placeholder="John Smith"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="shopName" className="input-label">Shop Name</label>
                <input
                  type="text"
                  id="shopName"
                  value={profileData.shopName}
                  onChange={(e) => handleInputChange('shopName', e.target.value)}
                  className="input"
                  placeholder="Mike's Barbershop"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="shopAddress" className="input-label">
                  <MapPin size={16} className="inline mr-1" />
                  Shop Address
                </label>
                <input
                  type="text"
                  id="shopAddress"
                  value={profileData.shopAddress}
                  onChange={(e) => handleInputChange('shopAddress', e.target.value)}
                  className="input"
                  placeholder="123 Main St, New York, NY"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone" className="input-label">
                  <Phone size={16} className="inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="input"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email" className="input-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary btn-lg btn-full ${loading ? 'loading' : ''}`}
          >
            {!loading && <Save size={20} />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Current Services */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Your Services</h3>
              <p className="card-subtitle">Manage the services you offer</p>
            </div>

            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  {editingService === service.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.id, { name: e.target.value })}
                        className="input"
                        placeholder="Service name"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          value={service.duration}
                          onChange={(e) => updateService(service.id, { duration: parseInt(e.target.value) })}
                          className="input"
                          placeholder="Duration (minutes)"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={service.price}
                          onChange={(e) => updateService(service.id, { price: parseFloat(e.target.value) })}
                          className="input"
                          placeholder="Price ($)"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingService(null)}
                          className="btn btn-primary btn-sm flex-1"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="service-info">
                        <div className="service-name">{service.name}</div>
                        <div className="service-duration">{service.duration} minutes</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="service-price">${service.price}</span>
                        <button
                          onClick={() => setEditingService(service.id)}
                          className="btn btn-ghost btn-sm"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="btn btn-ghost btn-sm text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add New Service */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Add New Service</h3>
            </div>

            <div className="space-y-4">
              <div className="input-group">
                <label className="input-label">Service Name</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  placeholder="e.g., Haircut, Beard Trim"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newService.duration}
                    onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                    className="input"
                    placeholder="30"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newService.price}
                    onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                    className="input"
                    placeholder="25.00"
                  />
                </div>
              </div>

              <button
                onClick={addService}
                className="btn btn-primary btn-full"
              >
                <Plus size={16} />
                Add Service
              </button>
            </div>
          </div>

          <button
            onClick={saveServices}
            disabled={loading}
            className={`btn btn-primary btn-lg btn-full ${loading ? 'loading' : ''}`}
          >
            {!loading && <Save size={20} />}
            {loading ? 'Saving...' : 'Save All Services'}
          </button>
        </div>
      )}

      {/* Hours Tab */}
      {activeTab === 'hours' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Clock size={20} className="inline mr-2" />
              Business Hours
            </h3>
            <p className="card-subtitle">Set your operating hours (Coming Soon)</p>
          </div>

          <div className="text-center py-12">
            <Clock size={48} className="mx-auto mb-4 text-muted" />
            <h3 className="font-semibold mb-2">Business Hours Management</h3>
            <p className="text-muted mb-6">
              This feature is coming soon! You'll be able to set your daily operating hours,
              special holiday hours, and break times.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2">Planned Features:</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• Daily operating hours</li>
                <li>• Break time scheduling</li>
                <li>• Holiday hours</li>
                <li>• Automatic booking restrictions</li>
                <li>• Time zone support</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Account Actions */}
      <div className="card mt-8">
        <div className="card-header">
          <h3 className="card-title">Account Actions</h3>
        </div>
        
        <div className="space-y-3">
          <button className="btn btn-secondary btn-full text-left">
            <div>
              <p className="font-medium">Download Data</p>
              <p className="text-sm text-muted">Export your shop and appointment data</p>
            </div>
          </button>
          
          <button className="btn btn-secondary btn-full text-left">
            <div>
              <p className="font-medium">Privacy Settings</p>
              <p className="text-sm text-muted">Manage your privacy preferences</p>
            </div>
          </button>
          
          <button className="btn btn-secondary btn-full text-left text-red-600">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-red-500">Permanently delete your account and data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarberProfile;