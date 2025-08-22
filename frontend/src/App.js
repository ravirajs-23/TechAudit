import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import QuestionnaireBuilder from './components/QuestionnaireBuilder/QuestionnaireBuilder';
import Questions from './pages/Questions/Questions';
import Sections from './pages/Sections/Sections';
import Technologies from './pages/Technologies/Technologies';
import './index.css';
import Layout from './components/Layout/Layout';

// Placeholder components for other routes
const Audits = () => (
  <Layout>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Audits Management</h2>
      <p>This page will contain audit management functionality.</p>
    </div>
  </Layout>
);

const Profile = () => (
  <Layout>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>User Profile</h2>
      <p>This page will contain user profile management.</p>
    </div>
  </Layout>
);

const Settings = () => (
  <Layout>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Settings</h2>
      <p>This page will contain application settings.</p>
    </div>
  </Layout>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/builder" 
              element={
                <ProtectedRoute>
                  <QuestionnaireBuilder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/questions" 
              element={
                <ProtectedRoute>
                  <Questions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sections" 
              element={
                <ProtectedRoute>
                  <Sections />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/technologies" 
              element={
                <ProtectedRoute>
                  <Technologies />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/audits" 
              element={
                <ProtectedRoute>
                  <Audits />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
