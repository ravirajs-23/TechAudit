import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

  // Set auth token in localStorage
  useEffect(() => {
    if (state.token) {
      // Store token in localStorage
      localStorage.setItem('token', state.token);
    } else {
      // Remove token from localStorage
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Initialize application
  useEffect(() => {
    console.log('✅ Auth context initialized');
  }, []);

  // Check for stored token on app startup
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !state.token) {
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

  // Validate token (mock validation)
  const validateToken = () => {
    if (!state.token) return false;
    // For mock tokens, just check if they exist
    return state.token.startsWith('mock-jwt-token-');
  };

  // Load user from stored data (no API)
  const loadUser = () => {
    try {
      // Validate token first
      if (!validateToken()) {
        return;
      }

      // Create mock user based on token
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'admin@example.com',
        role: 'admin'
      };

      dispatch({
        type: AUTH_ACTIONS.LOAD_USER,
        payload: mockUser,
      });
    } catch (error) {
      console.error('Failed to load user:', error);
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    }
  };

  // Login user (mock authentication)
  const login = (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    // Mock authentication - accept any email/password
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: email,
      role: 'admin'
    };

    const mockToken = 'mock-jwt-token-' + Date.now();

    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user: mockUser, token: mockToken },
    });

    toast.success('Login successful!');
    navigate('/dashboard');
    return true;
  };

  // Register user (mock registration)
  const register = (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    // Mock registration - accept any user data
    const mockUser = {
      id: Math.random().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user'
    };

    const mockToken = 'mock-jwt-token-' + Date.now();

    dispatch({
      type: AUTH_ACTIONS.REGISTER_SUCCESS,
      payload: { user: mockUser, token: mockToken },
    });

    toast.success('Registration successful!');
    navigate('/dashboard');
    return true;
  };

  // Logout user
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    navigate('/login');
    toast.success('Logged out successfully');
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
