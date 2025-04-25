import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <div className="navbar-logo">
              <Link to="/dashboard" className="navbar-logo-text">Admin Dashboard</Link>
            </div>
            <nav className="navbar-navigation">
              <div className="navbar-nav-list">
                <Link
                  to="/dashboard"
                  className="navbar-nav-link"
                >
                  Dashboard
                </Link>
                <Link
                  to="/services"
                  className="navbar-nav-link"
                >
                  Services
                </Link>
              </div>
            </nav>
          </div>
          <div className="navbar-right">
            <div className="navbar-user">
              <div className="navbar-user-info">
                <span className="navbar-username">{user?.name || 'User'}</span>
                <button
                  onClick={onLogout}
                  className="navbar-logout-btn"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;