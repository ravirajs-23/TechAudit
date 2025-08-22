import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOAD_USER: 'LOAD_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true, // Start with loading true
  error: null,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Set auth token header
  useEffect(() => {
    if (state.token) {
      console.log('🔑 AuthContext: Setting Authorization header with token');
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      // Store token in localStorage
      localStorage.setItem('token', state.token);
    } else {
      console.log('🔑 AuthContext: Removing Authorization header');
      delete api.defaults.headers.common['Authorization'];
      // Remove token from localStorage
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Test API connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🧪 Testing API connection...');
        const response = await api.get('/health');
        console.log('✅ API connection successful:', response.data);
      } catch (error) {
        console.error('❌ API connection failed:', error);
      }
    };
    
    testConnection();
  }, []);

  // Check for stored token on app startup
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !state.token) {
      console.log('🔍 AuthContext: Found stored token, restoring session...');
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token: storedToken, user: null }
      });
    } else if (!storedToken) {
      // No stored token, set loading to false
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    }
  }, []);

  // Load user on mount if token exists
  useEffect(() => {
    if (state.token && !state.user) {
      loadUser();
    } else if (state.token && state.user) {
      // User already loaded, set loading to false
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    } else if (!state.token) {
      // No token, set loading to false
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    }
  }, [state.token, state.user]);

  // Load user from API
  const loadUser = async () => {
    try {
      console.log('🔍 AuthContext: Loading user data...');
      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        console.log('✅ AuthContext: User data loaded successfully:', response.data.user);
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER,
          payload: response.data.user,
        });
      } else {
        console.log('❌ AuthContext: Failed to load user - API returned success: false');
        logout();
      }
    } catch (error) {
      console.error('❌ AuthContext: Failed to load user:', error);
      if (error.response?.status === 401) {
        console.log('🔒 AuthContext: Token expired or invalid, logging out...');
        logout();
      } else {
        // Other errors, set loading to false but keep token
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      }
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext: Starting login process...');
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      console.log('🌐 AuthContext: Making API call to /api/auth/login...');
      const response = await api.post('/api/auth/login', { email, password });
      
      console.log('📡 AuthContext: API response received:', response.data);
      
      if (response.data.success) {
        const { user, token } = response.data;
        
        console.log('✅ AuthContext: Login successful, storing token and user data...');
        console.log('👤 User:', user);
        console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'No token');
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: response.data,
        });
        
        console.log('🎯 AuthContext: Dispatching LOGIN_SUCCESS, navigating to dashboard...');
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        console.log('❌ AuthContext: Login failed - API returned success: false');
        const errorMessage = response.data.error || 'Login failed';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: errorMessage,
        });
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('💥 AuthContext: Login error caught:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // Server responded with error status
        console.log('📡 AuthContext: Server error response:', error.response);
        errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.log('🌐 AuthContext: Network error - no response received');
        errorMessage = 'Network error - please check your connection';
      } else {
        // Something else happened
        console.log('❓ AuthContext: Other error:', error.message);
        errorMessage = error.message || 'Login failed';
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      
      const response = await api.post('/api/auth/register', userData);
      
      if (response.data.success) {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: response.data,
        });
        
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_FAILURE,
          payload: response.data.error,
        });
        toast.error(response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      if (state.token) {
        await api.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  // Check if user is auditor
  const isAuditor = () => {
    return state.user?.role === 'auditor';
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    loadUser,
    clearError,
    isAdmin,
    isAuditor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
