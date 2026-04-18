import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiBell, FiMenu, FiX, FiLogOut, FiSettings, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Header.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchUnread();
      const id = setInterval(fetchUnread, 30000);
      return () => clearInterval(id);
    }
  }, [user]);

  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  const fetchUnread = async () => {
    try {
      const res = await api.get('/api/notifications/unread/count');
      setUnread(res.data.count || 0);
    } catch (_) {}
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navLinks = [
    { to: '/bookings', label: 'Bookings' },
    { to: '/tickets', label: 'Tickets' },
    { to: '/resources', label: 'Resources' },
  ];

  return (
    <header className="hdr">
      <div className="hdr-inner">

        {/* Logo */}
        <Link to="/" className="hdr-logo">
          <div className="hdr-logo-box">U</div>
          <div className="hdr-logo-text-wrap">
            <span className="hdr-logo-name">UniDesk</span>
            <span className="hdr-logo-tag">SLIIT · Faculty of Computing</span>
          </div>
        </Link>

        {/* Desktop nav */}
        {user && (
          <nav className="hdr-nav">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={isActive(to) ? 'hdr-link active' : 'hdr-link'}
              >
                {label}
              </Link>
            ))}
            {isAdmin() && (
              <Link
                to="/admin"
                className={isActive('/admin') ? 'hdr-link admin active' : 'hdr-link admin'}
              >
                <FiShield size={13} /> Admin
              </Link>
            )}
          </nav>
        )}

        {/* Right side */}
        <div className="hdr-right">
          {user ? (
            <>
              {/* Bell */}
              <button
                className="hdr-bell"
                onClick={() => navigate('/notifications')}
                aria-label="Notifications"
              >
                <FiBell size={18} />
                {unread > 0 && (
                  <span className="hdr-bell-badge">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </button>

              {/* Avatar */}
              <div className="hdr-profile-wrap">
                <button
                  className="hdr-avatar-btn"
                  onClick={() => setDropOpen((p) => !p)}
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="hdr-avatar-img"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="hdr-avatar-fb">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hdr-avatar-name">{user.name}</span>
                </button>

                {dropOpen && (
                  <>
                    <div
                      className="hdr-drop-overlay"
                      onClick={() => setDropOpen(false)}
                    />
                    <div className="hdr-drop">
                      {/* Drop header */}
                      <div className="hdr-drop-top">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="hdr-drop-avatar"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="hdr-drop-avatar-fb">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <div className="hdr-drop-info">
                          <p className="hdr-drop-name">{user.name}</p>
                          <p className="hdr-drop-email">{user.email}</p>
                          <span className="hdr-drop-role">
                            {user.roles && user.roles[0]}
                          </span>
                        </div>
                      </div>

                      <div className="hdr-drop-divider" />

                      <button
                        className="hdr-drop-item"
                        onClick={() => { navigate('/settings'); setDropOpen(false); }}
                      >
                        <FiSettings size={14} /> Settings
                      </button>

                      <button
                        className="hdr-drop-item"
                        onClick={() => { navigate('/notifications'); setDropOpen(false); }}
                      >
                        <FiBell size={14} /> Notifications
                        {unread > 0 && (
                          <span className="hdr-drop-badge">{unread}</span>
                        )}
                      </button>

                      {isAdmin() && (
                        <button
                          className="hdr-drop-item hdr-drop-admin"
                          onClick={() => { navigate('/admin'); setDropOpen(false); }}
                        >
                          <FiShield size={14} /> Admin Panel
                        </button>
                      )}

                      <div className="hdr-drop-divider" />

                      <button
                        className="hdr-drop-item hdr-drop-danger"
                        onClick={logout}
                      >
                        <FiLogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="hdr-auth-btns">
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="hdr-btn-outline"
              >
                Log In
              </a>
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="hdr-btn-solid"
              >
                Get Started
              </a>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="hdr-toggle"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="hdr-mobile">
          {user ? (
            <>
              <div className="mob-user">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="mob-avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="mob-avatar-fb">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <p className="mob-name">{user.name}</p>
                  <p className="mob-email">{user.email}</p>
                </div>
              </div>
              <div className="mob-divider" />
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className="mob-link">
                  {label}
                </Link>
              ))}
              {isAdmin() && (
                <Link to="/admin" className="mob-link mob-admin">
                  <FiShield size={14} /> Admin Panel
                </Link>
              )}
              <Link to="/notifications" className="mob-link">
                <FiBell size={14} /> Notifications
                {unread > 0 && (
                  <span className="mob-badge">{unread}</span>
                )}
              </Link>
              <Link to="/settings" className="mob-link">
                <FiSettings size={14} /> Settings
              </Link>
              <div className="mob-divider" />
              <button className="mob-link mob-danger" onClick={logout}>
                <FiLogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="mob-link"
              >
                Log In
              </a>
              <a
                href="http://localhost:8080/oauth2/authorization/google"
                className="mob-link"
              >
                Get Started
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;