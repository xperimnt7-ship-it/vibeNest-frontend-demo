import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, setUser } from '../features/auth/authSlice';
import { authAPI } from '../api/auth';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = storage.getToken();
        const userData = storage.getUser();

        if (token && userData) {
          // Try to refresh token to ensure it's still valid
          try {
            const refreshResult = await authAPI.refreshToken();
            if (refreshResult.data?.user) {
              dispatch(setUser(refreshResult.data.user));
              dispatch(login());
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Clear invalid data
            storage.clearAuth();
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  const loginUser = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authAPI.login(credentials);
      
      if (result.data?.user) {
        dispatch(setUser(result.data.user));
        dispatch(login());
        return result;
      } else {
        throw new Error('Login failed - no user data received');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authAPI.register(userData);
      
      if (result.data?.user) {
        dispatch(setUser(result.data.user));
        dispatch(login());
        return result;
      } else {
        throw new Error('Registration failed - no user data received');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await authAPI.logout();
      dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if API call fails
      storage.clearAuth();
      dispatch(logout());
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user: authState.user,
    isLoggedIn: authState.isLoggedin,
    isLoading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    clearError
  };
};