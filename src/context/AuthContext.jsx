import { createContext, useContext, useState, useEffect } from 'react';
import { toastError} from '../utils/toast';
import api from '../api/axiosClient';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => {
    try {
      const raw = localStorage.getItem('filters');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  async function fetchAndCacheFilters() {
    try {
      const response = await api.get('stonedata/filterData');
      const { data, success } = response?.data || {};
      if (!success) return;
      const filterData = data || {};
      localStorage.setItem('filters', JSON.stringify(filterData));
      setFilters(filterData);
    } catch (ex) {
      // Non-blocking: show toast but don't break auth flow
      toastError(ex.message || 'Failed to load filter data');
    }
  }

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // If logged in and filters missing, fetch once
    const hasToken = Boolean(localStorage.getItem('token'));
    const hasFilters = Boolean(localStorage.getItem('filters'));
    if (hasToken && !hasFilters) {
      fetchAndCacheFilters();
    }
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    const payload = {email, password}
    try {
      const response = await api.post('/auth/login', payload, { skipAuthRedirect: true });
      const { data, success, message } = response?.data || {};

      if (!success) {
        toastError(message || 'Invalid email or password');
        return { success: false, message };
      }

      // Expect API data to include token and user
      const token = data?.access_token;
      const userData = data?.user;

      if (!token || !userData) {
        return { success: false, message: 'Invalid response from server' };
      }

      // Persist and set user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Fetch and cache filters right after successful login
      await fetchAndCacheFilters();

      return { success: true };
    } catch(ex){
      toastError(ex.message || 'Invalid email or password');
      return { success: false, message: ex.message };
    }
  };

  const register = async (email, name, password) => {
    // Simulate API call
    const payload = {email, name, password}
    try {
      const response = await api.post('/auth/register', payload, { skipAuthRedirect: true });
      const { data, success, message } = response?.data || {};

      if (!success) {
        toastError(message || 'Registration failed');
        return { success: false, message };
      }

      // Expect API data to include token and user
      const token = data?.access_token;
      const userData = data?.user;

      if (!token || !userData) {
        return { success: false, message: 'Invalid response from server' };
      }

      setUser(userData);

      return { success: true };
    } catch(ex){
      toastError(ex.message || 'Invalid email or password');
      return { success: false, message: ex.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    register,
    filters,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}