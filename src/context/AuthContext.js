import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('barberease_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('barberease_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in a real app, this would be an API call
      const mockUsers = [
        {
          id: '1',
          email: 'customer@example.com',
          name: 'John Doe',
          userType: 'customer',
          phone: '+1 (555) 123-4567',
          avatar: null
        },
        {
          id: '2',
          email: 'barber@example.com',
          name: 'Mike Smith',
          userType: 'barber',
          phone: '+1 (555) 987-6543',
          avatar: null,
          shopName: 'Mike\'s Barbershop',
          shopAddress: '123 Main St, New York, NY',
          services: [
            { id: '1', name: 'Haircut', duration: 30, price: 25 },
            { id: '2', name: 'Beard Trim', duration: 15, price: 15 },
            { id: '3', name: 'Hair Wash', duration: 10, price: 10 },
            { id: '4', name: 'Full Service', duration: 60, price: 45 }
          ]
        }
      ];

      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser || password !== 'password123') {
        throw new Error('Invalid email or password');
      }

      setUser(foundUser);
      localStorage.setItem('barberease_user', JSON.stringify(foundUser));
      toast.success('Welcome back!');
      
      return foundUser;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        avatar: null,
        ...(userData.userType === 'barber' && {
          services: [
            { id: '1', name: 'Haircut', duration: 30, price: 25 },
            { id: '2', name: 'Beard Trim', duration: 15, price: 15 }
          ]
        })
      };

      setUser(newUser);
      localStorage.setItem('barberease_user', JSON.stringify(newUser));
      toast.success('Account created successfully!');
      
      return newUser;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('barberease_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('barberease_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
      
      return updatedUser;
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};