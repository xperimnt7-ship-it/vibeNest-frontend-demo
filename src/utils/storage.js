// Storage utilities for managing auth tokens and user data
export const storage = {
  // Token management
  getToken: () => {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  },

  setToken: (token) => {
    try {
      localStorage.setItem('accessToken', token);
    } catch (error) {
      console.error('Error setting token in localStorage:', error);
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  },

  // User data management
  getUser: () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  },

  setUser: (user) => {
    try {
      localStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user in localStorage:', error);
    }
  },

  removeUser: () => {
    try {
      localStorage.removeItem('userData');
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  },

  // Clear all auth data
  clearAuth: () => {
    storage.removeToken();
    storage.removeUser();
  }
};