import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  role: string;
  branch?: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, branch?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshUserRole: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Setup axios with base URL - adjust this to match your API URL
const api = axios.create({
  baseURL: '/api/auth',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh the user's role
  const refreshUserRole = async () => {
    try {
      const response = await api.get('/me');
      const role = response.data.user.role || 'user';
      setUserRole(role);
      return role;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/me');
          setCurrentUser(response.data.user);
          setUserRole(response.data.user.role);
        } catch (error) {
          // Token might be expired or invalid
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setCurrentUser(user);
    setUserRole(user.role);
  };

  const register = async (email: string, password: string, fullName: string, branch?: string) => {
    const response = await api.post('/signup', { 
      email, 
      password, 
      name: fullName,
      branch
    });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setCurrentUser(user);
    setUserRole(user.role);
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    userRole,
    login,
    register,
    logout,
    loading,
    refreshUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};