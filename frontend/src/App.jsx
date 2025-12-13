import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Home from './pages/Home';
import Insurance from './pages/Insurance';
import MyInsuranceForms from './pages/MyInsuranceForms';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/my-insurance-forms" element={<MyInsuranceForms />} />
      </Routes>
    </Router>
  );
}

export default App;
