import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; 

function Dashboard({ user, services }) {
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    pendingServices: 0,
    completedServices: 0
  });

  useEffect(() => {
    // Calculate statistics
    const activeServices = services.filter(service => service.status === 'active').length;
    const pendingServices = services.filter(service => service.status === 'pending').length;
    const completedServices = services.filter(service => service.status === 'completed').length;

    setStats({
      totalServices: services.length,
      activeServices,
      pendingServices,
      completedServices
    });
  }, [services]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || 'User'}</h1>
        <p>Here's an overview of your services</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            
            <div className="stat-details">
              <div className="stat-title">Total Services</div>
              <div className="stat-value">{stats.totalServices}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
           
            <div className="stat-details">
              <div className="stat-title">Active Services</div>
              <div className="stat-value">{stats.activeServices}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            
            <div className="stat-details">
              <div className="stat-title">Pending Services</div>
              <div className="stat-value">{stats.pendingServices}</div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            
            <div className="stat-details">
              <div className="stat-title">Completed Services</div>
              <div className="stat-value">{stats.completedServices}</div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Dashboard;