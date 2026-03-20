import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Layout({ title, navItems, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (item) => {
    item.onClick();
    setSidebarOpen(false); // close sidebar on mobile after nav
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="sidebar-logo-icon">💳</div>
            <span className="sidebar-logo-text">PayTrack</span>
          </div>
          {/* Hamburger — visible only on mobile via CSS */}
          <button
            className="sidebar-hamburger"
            style={{ display: 'none' }}
            onClick={() => setSidebarOpen(v => !v)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`sidebar-section${sidebarOpen ? ' open' : ''}`}>
          <div className="sidebar-section-label">Navigation</div>
          {navItems.map(item => (
            <div
              key={item.label}
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        <div className={`sidebar-footer${sidebarOpen ? ' open' : ''}`}>
          <div className="sidebar-user" onClick={handleLogout} title="Click to logout">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role} · logout →</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="main-area">
        <div className="topbar">
          <h1 className="topbar-title">{title}</h1>
          <div className="topbar-actions">
            <span className={`badge badge-${user?.role}`}>{user?.role}</span>
          </div>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}