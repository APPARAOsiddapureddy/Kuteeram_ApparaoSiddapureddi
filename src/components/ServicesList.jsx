import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicesList.css'; // Make sure to import the CSS file

function ServicesList({ services }) {
  const [filteredServices, setFilteredServices] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  useEffect(() => {
    let result = [...services];

    // Apply filters
    if (filters.category) {
      result = result.filter(service => service.category === filters.category);
    }
    if (filters.status) {
      result = result.filter(service => service.status === filters.status);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(service => 
        service.name.toLowerCase().includes(searchLower) || 
        service.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredServices(result);
  }, [services, filters, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-completed';
    }
  };

  return (
    <div className="services-container">
      <div className="header-container">
        <div>
          <h1 className="header-title">Services</h1>
          <p className="header-subtitle">Manage your services</p>
        </div>
        <Link to="/services/new" className="add-service-btn">
          <svg className="add-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Service
        </Link>
      </div>

      <div className="card">
        <div className="filter-section">
          <div className="filters-container">
            <div className="filter-group">
              <div>
                <label htmlFor="category-filter" className="sr-only">Filter by Category</label>
                <select
                  id="category-filter"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>
              <div>
                <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
                <select
                  id="status-filter"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="search-container">
              <label htmlFor="search" className="sr-only">Search</label>

              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search services"
                value={filters.search}
                onChange={handleFilterChange}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>
                    <div className="table-header-content">
                      Name {getSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('category')}>
                    <div className="table-header-content">
                      Category {getSortIcon('category')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')}>
                    <div className="table-header-content">
                      Status {getSortIcon('status')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('price')}>
                    <div className="table-header-content">
                      Price {getSortIcon('price')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('createdAt')}>
                    <div className="table-header-content">
                      Created At {getSortIcon('createdAt')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <div className="service-item">
                          <div className="service-name">{service.name}</div>
                          <div className="service-description">
                            {service.description.slice(0, 50)}
                            {service.description.length > 50 ? '...' : ''}
                          </div>
                        </div>
                      </td>
                      <td>{service.category}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(service.status)}`}>
                          {service.status}
                        </span>
                      </td>
                      <td>${service.price.toFixed(2)}</td>
                      <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No services found. 
                      <Link to="/services/new">
                        Add a service
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesList;