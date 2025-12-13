import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { adminAuthAPI } from './api/admin';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Home from './pages/Home';
import Insurance from './pages/Insurance';
import MyInsuranceForms from './pages/MyInsuranceForms';
import AdminRoutes from './routes/adminRoutes';
import './App.css';

// Protected route component for regular users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />

        {/* Protected user routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/insurance" element={
          <ProtectedRoute>
            <Insurance />
          </ProtectedRoute>
        } />

        <Route path="/my-insurance-forms" element={
          <ProtectedRoute>
            <MyInsuranceForms />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
