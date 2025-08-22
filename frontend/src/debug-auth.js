// Debug utility for authentication issues
// Add this to your browser console to debug auth state

export const debugAuth = () => {
  console.log('🔍 === AUTH DEBUG START ===');
  
  // Check localStorage
  const token = localStorage.getItem('token');
  console.log('🔑 Token in localStorage:', token ? `${token.substring(0, 20)}...` : 'No token');
  
  // Check current URL
  console.log('📍 Current URL:', window.location.href);
  console.log('📍 Current pathname:', window.location.pathname);
  
  // Check if we're in React context
  if (window.React) {
    console.log('⚛️ React detected');
  } else {
    console.log('❌ React not detected');
  }
  
  // Check for auth context
  try {
    // This will only work if we're in a component that uses useAuth
    console.log('🔍 Attempting to access auth context...');
  } catch (error) {
    console.log('❌ Auth context not accessible:', error.message);
  }
  
  // Check for any auth-related errors in console
  console.log('🔍 Check console for any auth-related errors above');
  
  console.log('🔍 === AUTH DEBUG END ===');
};

// Function to test navigation
export const testNavigation = (path) => {
  console.log(`🧪 Testing navigation to: ${path}`);
  try {
    window.location.href = path;
  } catch (error) {
    console.error('❌ Navigation failed:', error);
  }
};

// Function to clear auth state
export const clearAuth = () => {
  console.log('🧹 Clearing auth state...');
  localStorage.removeItem('token');
  console.log('✅ Token removed from localStorage');
  console.log('🔄 Refresh the page to see changes');
};

// Function to simulate login
export const simulateLogin = (fakeToken = 'fake-token-123') => {
  console.log('🎭 Simulating login with fake token...');
  localStorage.setItem('token', fakeToken);
  console.log('✅ Fake token set in localStorage');
  console.log('🔄 Refresh the page to see changes');
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
  window.testNavigation = testNavigation;
  window.clearAuth = clearAuth;
  window.simulateLogin = simulateLogin;
  
  console.log('🔧 Auth debug functions available:');
  console.log('• debugAuth() - Show current auth state');
  console.log('• testNavigation(path) - Test navigation to path');
  console.log('• clearAuth() - Clear authentication state');
  console.log('• simulateLogin() - Simulate login with fake token');
}
