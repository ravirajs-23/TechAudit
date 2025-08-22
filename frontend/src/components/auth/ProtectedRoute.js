import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user, token } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute:', {
    path: location.pathname,
    isAuthenticated,
    loading,
    hasUser: !!user,
    hasToken: !!token,
    user: user
  });

  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading, showing spinner...');
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !token) {
    console.log('❌ ProtectedRoute: Not authenticated, redirecting to login...');
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    console.log('⚠️ ProtectedRoute: Has token but no user data, redirecting to login...');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ ProtectedRoute: Authenticated, rendering children...');
  return children;
};

export default ProtectedRoute;
