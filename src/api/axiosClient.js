import axios from 'axios';

// Base URL is read from Vite env; define VITE_API_BASE_URL in .env files
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';

// Create axios instance
const axiosClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// Helper to store/remove token
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

function getToken() {
  return localStorage.getItem('token');
}

// Request interceptor: attach Authorization header if token exists
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: normalize errors and handle 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Clear token and redirect to login
      setAuthToken(null);
      // Optional: preserve current path to return after login
      const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.replace(`/login?next=${redirectTo}`);
      }
    }

    // Create a consistent error shape
    const apiError = {
      status: status || 0,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Unexpected error, please try again.',
      data: error?.response?.data,
      url: error?.config?.url,
      method: error?.config?.method,
    };
    return Promise.reject(apiError);
  }
);

export default axiosClient;


