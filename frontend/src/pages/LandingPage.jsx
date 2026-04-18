import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="lp">

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-glow" />
        <div className="lp-hero-badge">🎓 Smart Campus Operations Platform</div>
        <h1 className="lp-hero-title">
          One Hub for Your<br />
          <span className="lp-hero-accent">Entire Campus</span>
        </h1>
        <p className="lp-hero-sub">
          Book facilities, report incidents, manage resources and stay notified
          — all in one smart platform built for students, staff and administrators.
        </p>
        <div className="lp-hero-btns">
          {user ? (
            <Link to="/bookings" className="lp-btn-white">
              🚀 Go to Dashboard
            </Link>
          ) : (
            <a
              href="http://localhost:8080/oauth2/authorization/google"
              className="lp-btn-white"
            >
              🚀 Get Started Free
            </a>
          )}
          <Link to="/resources" className="lp-btn-outline">
            📖 Learn More
          </Link>
        </div>
        <div className="lp-hero-stats">
          {[
            { n: '48+', l: 'Campus Facilities' },
            { n: '1,200+', l: 'Active Users' },
            { n: '99.9%', l: 'Uptime' },
            { n: '5 sec', l: 'Avg. Booking Time' },
          ].map((s) => (
            <div key={s.l} className="lp-stat">
              <span className="lp-stat-n">{s.n}</span>
              <span className="lp-stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-section">
        <p className="lp-sect-label">What We Offer</p>
        <h2 className="lp-sect-title">Everything your campus needs</h2>
        <p className="lp-sect-sub">
          From booking a lecture hall to reporting a broken AC —
          UniDesk has it covered.
        </p>
        <div className="lp-feat-grid">
          {[
            { icon: '🏫', color: 'teal', title: 'Facility Catalogue', desc: 'Browse all campus spaces — labs, halls, courts and meeting rooms. See live availability at a glance.' },
            { icon: '📅', color: 'blue', title: 'Smart Booking', desc: 'Reserve any facility in seconds. Built-in conflict detection prevents double bookings automatically.' },
            { icon: '🔧', color: 'amber', title: 'Incident Tickets', desc: 'Report maintenance issues, upload photos, and track technician updates in real time.' },
            { icon: '🔔', color: 'coral', title: 'Smart Notifications', desc: 'Get instant alerts for booking confirmations, incident updates and role changes.' },
          ].map((f) => (
            <div key={f.title} className="lp-feat-card">
              <div className={`lp-feat-icon lp-icon-${f.color}`}>{f.icon}</div>
              <h3 className="lp-feat-title">{f.title}</h3>
              <p className="lp-feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-how">
        <p className="lp-sect-label">How It Works</p>
        <h2 className="lp-sect-title" style={{ marginBottom: '44px' }}>
          Three simple steps
        </h2>
        <div className="lp-steps">
          {[
            { n: '1', title: 'Log In Securely', desc: 'Sign in with your Google account using OAuth 2.0 — no new password needed.' },
            { n: '2', title: 'Browse & Book', desc: 'Find the facility you need, pick a time, confirm your booking in seconds.' },
            { n: '3', title: 'Stay Updated', desc: 'Receive notifications, track incidents, and manage everything from your dashboard.' },
          ].map((s, i, arr) => (
            <div key={s.n} className="lp-step">
              <div className="lp-step-circle">{s.n}</div>
              <p className="lp-step-title">{s.title}</p>
              <p className="lp-step-desc">{s.desc}</p>
              {i < arr.length - 1 && <div className="lp-step-arrow" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="lp-section lp-roles-section">
        <p className="lp-sect-label">Built for Everyone</p>
        <h2 className="lp-sect-title">Who uses UniDesk?</h2>
        <p className="lp-sect-sub">
          Role-based access ensures every user sees exactly what they need.
        </p>
        <div className="lp-roles-grid">
          {[
            {
              icon: '🎓', color: 'teal', name: 'Students',
              desc: 'Browse facilities, book rooms and report maintenance issues with ease.',
              perms: ['Book Facilities', 'Report Incidents', 'View Bookings'],
            },
            {
              icon: '🔧', color: 'amber', name: 'Technicians',
              desc: 'Manage assigned tickets, update status and add resolution notes.',
              perms: ['View Tickets', 'Update Status', 'Add Notes'],
            },
            {
              icon: '🔐', color: 'blue', name: 'Administrators',
              desc: 'Full system control — users, roles, analytics and all campus operations.',
              perms: ['Full Access', 'Manage Users', 'System Config'],
            },
          ].map((r) => (
            <div key={r.name} className="lp-role-card">
              <div className={`lp-role-avatar lp-ra-${r.color}`}>{r.icon}</div>
              <h3 className="lp-role-name">{r.name}</h3>
              <p className="lp-role-desc">{r.desc}</p>
              <div className="lp-role-perms">
                {r.perms.map((p) => (
                  <span key={p} className="lp-role-perm">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <h2 className="lp-cta-title">Ready to Get Started?</h2>
        <p className="lp-cta-sub">
          Sign in with your Google account and start managing campus resources today.
        </p>
        {!user && (
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="lp-btn-white"
          >
            🚀 Get Started Free
          </a>
        )}
      </section>

    </div>
  );
};

export default LandingPage;