// Validation utilities
export const validation = {
  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Username validation (alphanumeric, 3-20 characters)
  isValidUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  // Password validation (at least 6 characters)
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  // Post content validation
  isValidPostContent: (content) => {
    return content && content.trim().length > 0 && content.trim().length <= 1000;
  },

  // File validation
  isValidImageFile: (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  },

  isValidVideoFile: (file) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  },

  // Generic file validation
  isValidFile: (file, allowedTypes, maxSize) => {
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }
};