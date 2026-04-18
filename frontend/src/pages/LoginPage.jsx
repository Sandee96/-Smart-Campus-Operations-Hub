import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/bookings', { replace: true });
  }, [user]);

  return (
    <div className="login-page">

      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-logo">
          <div className="ll-logo-box">U</div>
        </div>
        <h1 className="login-left-title">
          Smart Campus<br />Operations Hub
        </h1>
        <p className="login-left-sub">
          Your all-in-one platform for campus bookings, facilities
          and maintenance — built for SLIIT.
        </p>
        <div className="login-features">
          {[
            { icon: '🏫', text: 'Browse & book campus facilities instantly' },
            { icon: '📅', text: 'Smart conflict-free reservation system' },
            { icon: '🔧', text: 'Report & track maintenance tickets' },
            { icon: '🔔', text: 'Real-time notifications & role management' },
          ].map((f) => (
            <div key={f.text} className="login-feat">
              <span className="login-feat-icon">{f.icon}</span>
              <span className="login-feat-text">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-box">
          <div className="login-header">
            <h2 className="login-title">Welcome back 👋</h2>
            <p className="login-sub">
              Sign in to access UniDesk. Use your Google account
              for the fastest and most secure login.
            </p>
          </div>

          {/* Google OAuth button */}
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="login-google-btn"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              width={20}
              height={20}
            />
            Continue with Google (OAuth 2.0)
          </a>

          {/* OAuth flow diagram */}
          <div className="login-flow">
            <p className="login-flow-title">🔐 OAuth 2.0 Secure Flow</p>
            <div className="login-flow-steps">
              {['1 · Login', '2 · Google IDP', '3 · Auth Code', '4 · JWT Token', '5 · Access'].map(
                (s, i, arr) => (
                  <div key={s} className="login-flow-row">
                    <span className="login-flow-step">{s}</span>
                    {i < arr.length - 1 && (
                      <span className="login-flow-arrow">→</span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="login-security">
            🔒 Secured by OAuth 2.0 · Your credentials are never stored
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;