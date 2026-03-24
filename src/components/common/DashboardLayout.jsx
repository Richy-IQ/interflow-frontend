import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { notificationsAPI } from '../../services/api';
import './Layout.css';

const Logo = () => (
  <svg width="110" height="32" viewBox="0 0 120 36" fill="none">
    <path d="M8 6 C8 6 14 2 18 8 C22 14 16 20 20 24 C24 28 28 26 28 26" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M4 14 C4 14 10 10 14 16 C18 22 12 26 16 30" stroke="#A07C1E" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <text x="36" y="24" fontFamily="Cormorant Garamond,serif" fontSize="20" fontWeight="700" fill="#FFFFFF">Interflow</text>
    <text x="36" y="33" fontFamily="DM Sans,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.4)" letterSpacing="0.15em">ARTIST'S EXCHANGE</text>
  </svg>
);

const ARTIST_LINKS = [
  { to: '/dashboard',         icon: '⊞',  label: 'Dashboard' },
  { to: '/portfolio',         icon: '👤', label: 'My Portfolio' },
  { to: '/network',           icon: '👥', label: 'My Network' },
  { to: '/opportunities',     icon: '💡', label: 'Opportunities' },
  { to: '/applications',      icon: '📋', label: 'Applications' },
  { to: '/portfolio/share',   icon: '🔗', label: 'Share Portfolio' },
];

const ORG_LINKS = [
  { to: '/org/dashboard',      icon: '⊞',  label: 'Dashboard' },
  { to: '/org/opportunities',  icon: '💡', label: 'Opportunities' },
  { to: '/org/applications',   icon: '📋', label: 'Applications' },
  { to: '/network',            icon: '👥', label: 'My Network' },
];

const BOTTOM_LINKS = [
  { to: '/notifications', icon: '🔔', label: 'Notifications' },
  { to: '/support',       icon: '❓', label: 'Support' },
  { to: '/settings',      icon: '⚙',  label: 'Settings' },
];

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const links = user?.role === 'organization' ? ORG_LINKS : ARTIST_LINKS;

  useEffect(() => {
    notificationsAPI.unreadCount()
      .then(r => setUnread(r.data.data?.unread_count || 0))
      .catch(() => {});
    const interval = setInterval(() => {
      notificationsAPI.unreadCount().then(r => setUnread(r.data.data?.unread_count || 0)).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const displayName = user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(/[\s._-]/).map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="dash-layout">
      {mobileOpen && <div className="dash-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`dash-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo"><Logo /></div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-role">{user?.role === 'organization' ? 'Organization' : 'Artist'}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {BOTTOM_LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon">{l.icon}</span>
              <span>{l.label}</span>
              {l.to === '/notifications' && unread > 0 && (
                <span style={{ marginLeft:'auto', background:'var(--error)', color:'white', borderRadius:'9999px', padding:'1px 7px', fontSize:'11px', fontWeight:'700' }}>{unread}</span>
              )}
            </NavLink>
          ))}
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-link-icon">🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setMobileOpen(o => !o)}>☰</button>
          <div className="dash-search">
            <span className="dash-search-icon">🔍</span>
            <input type="text" placeholder="Search Interflow..." className="dash-search-input" />
          </div>
          <div className="dash-topbar-actions">
            <button className="dash-icon-btn" style={{ position:'relative' }} onClick={() => navigate('/notifications')}>
              🔔
              {unread > 0 && (
                <span style={{ position:'absolute', top:'2px', right:'2px', width:'16px', height:'16px', borderRadius:'50%', background:'var(--error)', color:'white', fontSize:'10px', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'center' }}>{unread > 9 ? '9+' : unread}</span>
              )}
            </button>
            <div className="dash-topbar-avatar" onClick={() => navigate('/settings')}>{initials}</div>
          </div>
        </header>
        <main className="dash-content page-enter">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
