import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="ftr">
      <div className="ftr-top">

        {/* Brand */}
        <div className="ftr-brand">
          <div className="ftr-brand-logo">
            <div className="ftr-logo-box">U</div>
            <span className="ftr-brand-name">UniDesk</span>
          </div>
          <p className="ftr-brand-desc">
            A modern campus operations platform built by SLIIT IT Year 3
            students for the PAF module, 2026.
          </p>
        </div>

        {/* Platform links */}
        <div className="ftr-col">
          <h4 className="ftr-col-title">Platform</h4>
          <Link to="/resources">Facilities</Link>
          <Link to="/bookings">Bookings</Link>
          <Link to="/tickets">Incidents</Link>
          <Link to="/notifications">Notifications</Link>
        </div>

        {/* Access links */}
        <div className="ftr-col">
          <h4 className="ftr-col-title">Access</h4>
          <a href="http://localhost:8080/oauth2/authorization/google">
            Student Login
          </a>
          <a href="http://localhost:8080/oauth2/authorization/google">
            Staff Login
          </a>
          <Link to="/admin">Admin Panel</Link>
          <Link to="/settings">Settings</Link>
        </div>

        {/* Support links */}
        <div className="ftr-col">
          <h4 className="ftr-col-title">Support</h4>
          <a href="#">Help Centre</a>
          <a href="#">API Docs</a>
          <a href="#">Report a Bug</a>
          <a href="#">Contact IT</a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="ftr-bottom">
        <span className="ftr-copy">
          © 2026 UniDesk · SLIIT Faculty of Computing · IT3030 PAF
        </span>
        <div className="ftr-badges">
          <span className="ftr-badge">React</span>
          <span className="ftr-badge">Spring Boot</span>
          <span className="ftr-badge">REST API</span>
          <span className="ftr-badge">OAuth 2.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;