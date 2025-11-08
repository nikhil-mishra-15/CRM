import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f4f6',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated ? (
          user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/contacts" replace />
        ) : (
          <LoginPage />
        )
      } />
      <Route path="/signup" element={
        isAuthenticated ? (
          user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/contacts" replace />
        ) : (
          <SignupPage />
        )
      } />

      {/* Protected routes */}
      <Route path="/contacts" element={
        <ProtectedRoute>
          <ContactPage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminPage />
        </ProtectedRoute>
      } />

      {/* Default redirect - always go to login if not authenticated */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/contacts') : '/login'} replace />
      } />
      
      {/* Catch all other routes and redirect to login if not authenticated */}
      <Route path="*" element={
        <Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/contacts') : '/login'} replace />
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
    <div className="app-container">
          <AppRoutes />
    </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


