import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'customer';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: userType,
    // Barber-specific fields
    shopName: '',
    shopAddress: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(prev => ({ ...prev, userType }));
  }, [userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Barber-specific validation
    if (formData.userType === 'barber') {
      if (!formData.shopName.trim()) {
        newErrors.shopName = 'Shop name is required';
      }
      if (!formData.shopAddress.trim()) {
        newErrors.shopAddress = 'Shop address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userType: formData.userType,
        ...(formData.userType === 'barber' && {
          shopName: formData.shopName,
          shopAddress: formData.shopAddress
        })
      };
      
      const user = await register(userData);
      navigate(user.userType === 'customer' ? '/customer' : '/barber');
    } catch (error) {
      // Error is handled in the AuthContext
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/user-type" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="page-header">
        <h1 className="page-title">Create Account</h1>
        <p className="page-subtitle">
          {userType === 'customer' 
            ? 'Join BarberEase as a customer' 
            : 'Set up your barbershop profile'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="input-group">
          <label htmlFor="name" className="input-label">
            {userType === 'customer' ? 'Full Name' : 'Your Name'}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder={userType === 'customer' ? 'John Doe' : 'Mike Johnson'}
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="input-group">
          <label htmlFor="email" className="input-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="john@example.com"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="input-group">
          <label htmlFor="phone" className="input-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`input ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="+1 (555) 123-4567"
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Barber-specific fields */}
        {userType === 'barber' && (
          <>
            <div className="input-group">
              <label htmlFor="shopName" className="input-label">
                Shop Name
              </label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className={`input ${errors.shopName ? 'border-red-500' : ''}`}
                placeholder="Mike's Barbershop"
              />
              {errors.shopName && (
                <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="shopAddress" className="input-label">
                Shop Address
              </label>
              <input
                type="text"
                id="shopAddress"
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleChange}
                className={`input ${errors.shopAddress ? 'border-red-500' : ''}`}
                placeholder="123 Main St, New York, NY"
              />
              {errors.shopAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.shopAddress}</p>
              )}
            </div>
          </>
        )}

        {/* Password Field */}
        <div className="input-group">
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input pr-12 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="input-group">
          <label htmlFor="confirmPassword" className="input-label">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary btn-lg btn-full ${loading ? 'loading' : ''}`}
        >
          {!loading && <UserPlus size={20} />}
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted mb-4">
          Already have an account?
        </p>
        <Link to="/login" className="btn btn-secondary btn-full">
          Sign In Instead
        </Link>
      </div>
    </div>
  );
};

export default Register;