import React from 'react';
import { Link } from 'react-router-dom';
import { User, Scissors, ArrowLeft } from 'lucide-react';

const UserTypeSelection = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center mb-6">
        <Link to="/" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="page-header">
        <h1 className="page-title">Choose Your Role</h1>
        <p className="page-subtitle">
          Select how you'll be using BarberEase
        </p>
      </div>

      <div className="space-y-4">
        {/* Customer Option */}
        <Link
          to="/register?type=customer"
          className="card block hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
              <User size={32} className="text-blue-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">I'm a Customer</h3>
              <p className="text-muted text-sm">
                Book appointments and discover barbershops
              </p>
              
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Scan QR codes to book instantly
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Find nearby barbershops
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Manage your appointments
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Barber Option */}
        <Link
          to="/register?type=barber"
          className="card block hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
              <Scissors size={32} className="text-purple-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">I'm a Barber</h3>
              <p className="text-muted text-sm">
                Manage your shop and appointments
              </p>
              
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Generate QR codes for your shop
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Manage appointment bookings
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Track your business analytics
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

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

export default UserTypeSelection;