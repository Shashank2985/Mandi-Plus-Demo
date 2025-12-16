import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { adminAuthAPI } from './api/admin';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Home from './pages/Home';
import Insurance from './pages/Insurance';
import MyInsuranceForms from './pages/MyInsuranceForms';
import Tracking from './pages/tracking/Tracking';
import KnowVehicle from './pages/know-vehicle/KnowVehicle';
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

        <Route path="/know-your-vehicle" element={
          <ProtectedRoute>
            <KnowVehicle />
          </ProtectedRoute>
        } />

        <Route path="/tracking" element={
          <ProtectedRoute>
            <Tracking />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
