// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ServicesForm from './components/ServicesForm';
import ServicesList from './components/ServicesList';
import Navbar from './components/Navbar';
import api from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setIsAuthenticated(true);
      fetchServices();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    fetchServices();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const addService = async (service) => {
    try {
      const response = await api.post('/services', service);
      setServices([...services, response.data]);
      return true;
    } catch (error) {
      console.error('Error adding service:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {isAuthenticated}
        <div className="flex flex-col flex-1 overflow-hidden">
          {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <Routes>
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
              />
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <Dashboard user={user} services={services} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/services/new" 
                element={isAuthenticated ? <ServicesForm onSubmit={addService} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/services" 
                element={isAuthenticated ? <ServicesList services={services} /> : <Navigate to="/login" />} 
              />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;