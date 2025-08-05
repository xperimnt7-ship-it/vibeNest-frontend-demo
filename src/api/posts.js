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

// Posts API functions
export const postsAPI = {
  // Get posts with pagination
  getPosts: async (page = 1, limit = 10, lastCreatedAt = null, lastPostId = null) => {
    try {
      let url = `${API_BASE_URL}/posts?page=${page}&limit=${limit}`;
      if (lastCreatedAt) url += `&lastCreatedAt=${lastCreatedAt}`;
      if (lastPostId) url += `&lastPostId=${lastPostId}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      
      if (postData.media && postData.media.length > 0) {
        postData.media.forEach((file, index) => {
          formData.append('media', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          // Don't set Content-Type for FormData, let browser set it with boundary
          ...(storage.getToken() && { Authorization: `Bearer ${storage.getToken()}` })
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  // Like/unlike post
  toggleLike: async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${postId}/like`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({ postId })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Toggle like error:', error);
      throw error;
    }
  },

  // Get post comments
  getComments: async (postId, page = 1, limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${postId}/comments?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get comments error:', error);
      throw error;
    }
  },

  // Add comment to post
  addComment: async (postId, comment) => {
    try {
      const response = await fetch(`${API_BASE_URL}/post/${postId}/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({ comment })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      return true;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }
};