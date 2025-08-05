import { storage } from '../utils/storage';

const API_BASE_URL = 'http://localhost:3000/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = storage.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Users API functions
export const usersAPI = {
  // Search user by username or userId
  searchUser: async (searchTerm) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to search user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search user error:', error);
      throw error;
    }
  },

  // Get user by username or userId
  getUser: async (identifier) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(identifier)}`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  // Get user posts
  getUserPosts: async (userId, page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/posts?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get user posts');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user posts error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/users/avatar`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(storage.getToken() && { Authorization: `Bearer ${storage.getToken()}` })
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }
};