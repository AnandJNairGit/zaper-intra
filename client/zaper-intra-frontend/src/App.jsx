// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ClientsPage from './pages/Clients/ClientsPage';
import ClientDetailsPage from './pages/Clients/ClientDetailsPage';
import LoginPage from './pages/LoginPage';
import './App.css';

const STORAGE_KEY = 'app_auth';
const SESSION_DURATION = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

// Check if user is authenticated
const isAuthenticated = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  
  try {
    const { timestamp } = JSON.parse(stored);
    const isValid = Date.now() - timestamp < SESSION_DURATION;
    
    if (!isValid) {
      // Session expired, remove from storage
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    
    return true;
  } catch (err) {
    // Invalid stored data, remove it
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/clients" 
          element={
            <ProtectedRoute>
              <Layout>
                <ClientsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/clients/:clientId" 
          element={
            <ProtectedRoute>
              <Layout>
                <ClientDetailsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/clients" replace />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
