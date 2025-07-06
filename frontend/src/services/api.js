import axios from 'axios';

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    profile: '/auth/profile',
    password: '/auth/password',
  },
  
  // Investments
  investments: {
    list: '/investments',
    create: '/investments',
    stats: '/investments/stats',
    withdrawROI: '/investments/withdraw-roi',
    withdrawReferral: '/investments/withdraw-referral',
  },
  
  // Referrals
  referrals: {
    list: '/referrals',
    stats: '/referrals/stats',
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    markAsRead: (id) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    delete: (id) => `/notifications/${id}`,
  },
  
  // Transactions
  transactions: {
    list: '/transactions',
    details: (id) => `/transactions/${id}`,
  },
  
  // Leaderboard
  leaderboard: {
    list: '/leaderboard',
    userRank: '/leaderboard/rank',
  },
  
  // Achievements
  achievements: {
    list: '/achievements',
    unlock: (id) => `/achievements/${id}/unlock`,
  },
  
  // Support
  support: {
    tickets: '/support/tickets',
    createTicket: '/support/tickets',
    messages: (ticketId) => `/support/tickets/${ticketId}/messages`,
  },
};

export default api; 