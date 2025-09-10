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

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
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

      return { success: true };
    } catch(ex){
      toastError(ex.message || 'Invalid email or password');
      return { success: false, message: ex.message };
    }
  };

//   {
//     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImVtYWlsIjoic2hpbHdhbnRhLmd1cHRhQG5hdmdyYWhhYS5jb20iLCJpYXQiOjE3NTc0OTc0OTAsImV4cCI6MTc1NzU4Mzg5MH0.-WbZutuU3QaHSGAp-t1qb8yNwhysHSScaBDgmWspz20",
//     "user": {
//         "id": 6,
//         "name": "Shilwanta Gupta",
//         "email": "shilwanta.gupta@navgrahaa.com"
//     }
// }

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

      // Persist and set user
      // localStorage.setItem('token', token);
      // localStorage.setItem('user', JSON.stringify(userData));
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
  };

  const value = {
    user,
    login,
    logout,
    loading,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}