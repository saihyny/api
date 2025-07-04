import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const user = await login(formData.email, formData.password);
      navigate(user.userType === 'customer' ? '/customer' : '/barber');
    } catch (error) {
      // Error is handled in the AuthContext
    }
  };

  const fillDemoCredentials = (type) => {
    setFormData({
      email: type === 'customer' ? 'customer@example.com' : 'barber@example.com',
      password: 'password123'
    });
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="page-header">
        <h1 className="page-title">Welcome Back</h1>
        <p className="page-subtitle">
          Sign in to your BarberEase account
        </p>
      </div>

      {/* Demo Credentials */}
      <div className="card mb-6">
        <h3 className="font-medium mb-3">Quick Demo Access</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('customer')}
            className="btn btn-secondary btn-sm flex-1"
          >
            Customer Demo
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('barber')}
            className="btn btn-secondary btn-sm flex-1"
          >
            Barber Demo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

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
              placeholder="Enter your password"
              autoComplete="current-password"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`btn btn-primary btn-lg btn-full ${loading ? 'loading' : ''}`}
        >
          {!loading && <LogIn size={20} />}
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted mb-4">
          Don't have an account?
        </p>
        <Link to="/user-type" className="btn btn-secondary btn-full">
          Create Account
        </Link>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted">
          Having trouble signing in? Use the demo credentials above to explore the app.
        </p>
      </div>
    </div>
  );
};

export default Login;