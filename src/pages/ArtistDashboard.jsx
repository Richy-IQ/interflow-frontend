import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import { authAPI, opportunitiesAPI, applicationsAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const ArtistDashboard = () => {
  const [stats, setStats] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      authAPI.getDashboard(),
      opportunitiesAPI.list({ page_size: 6 }),
    ]).then(([dashRes, oppRes]) => {
      setStats(dashRes.data.data);
      setOpportunities(oppRes.data.results || oppRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const firstName = user?.email?.split('@')[0] || 'there';

  const statCards = [
    { label: 'Connections', value: stats?.connections ?? '—', icon: '👥', color: 'stat-blue' },
    { label: 'Profile Viewers', value: stats?.active_applications ?? '—', icon: '👁', color: 'stat-green' },
    { label: 'Applications', value: stats?.applications ?? '—', icon: '📋', color: 'stat-gold' },
    { label: 'Opportunities', value: stats?.open_opportunities ?? '—', icon: '💡', color: 'stat-purple' },
  ];

  return (
    <DashboardLayout>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Welcome back, {firstName}!</h1>
          <p className="dash-page-sub">Here's what's happening on your Interflow today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/portfolio')}>View Portfolio →</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {statCards.map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`}>
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-value">{loading ? '—' : s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Opportunities */}
        <div>
          <div className="section-card" style={{ marginBottom: '20px' }}>
            <div className="section-card-header">
              <span className="section-card-title">Opportunities for you</span>
              <span className="section-card-action" onClick={() => navigate('/opportunities')}>View all →</span>
            </div>
            <div className="section-card-body" style={{ padding: 0 }}>
              {loading ? (
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '8px' }} />)}
                </div>
              ) : opportunities.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No opportunities yet. Check back soon!</div>
              ) : (
                opportunities.slice(0, 4).map((opp, i) => (
                  <div key={opp.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--grey-1)'}
                    onMouseLeave={e => e.currentTarget.style.background=''}
                    onClick={() => navigate('/opportunities')}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🎭</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{opp.organization_name} · {opp.location || 'Remote'}</div>
                    </div>
                    <span className={`badge ${opp.payment_type === 'paid' ? 'badge-success' : 'badge-grey'}`}>{opp.payment_type}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title">Your Recent Activity</span>
              <span className="section-card-action" onClick={() => navigate('/applications')}>View all</span>
            </div>
            <div className="section-card-body" style={{ padding: 0 }}>
              {(stats?.recent_activity || []).length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No recent activity yet.</div>
              ) : (
                stats.recent_activity.map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: i < stats.recent_activity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.status === 'accepted' ? 'var(--success)' : a.status === 'rejected' ? 'var(--error)' : 'var(--gold)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--dark)' }}>{a.opportunity_title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.organization}</div>
                    </div>
                    <span className={`badge ${a.status === 'accepted' ? 'badge-success' : a.status === 'rejected' ? 'badge-error' : 'badge-gold'}`}>{a.status_display}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Connection Requests */}
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title">Connection Requests</span>
              <span className="section-card-action" onClick={() => navigate('/network')}>View all</span>
            </div>
            <div className="section-card-body" style={{ padding: stats?.pending_connections > 0 ? '0' : '16px 20px' }}>
              {stats?.pending_connections > 0 ? (
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>+{stats.pending_connections}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--dark)' }}>Pending requests</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>from creative professionals</div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '14px' }} onClick={() => navigate('/network')}>Review Requests</button>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No pending connection requests.</p>
              )}
            </div>
          </div>

          {/* Profile completion */}
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title">Profile Strength</span>
            </div>
            <div className="section-card-body">
              {[
                { label: 'Basic Info', done: true },
                { label: 'Portfolio Media', done: false },
                { label: 'Experience', done: false },
                { label: 'Proficiency Ratings', done: true },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: item.done ? 'var(--success)' : 'var(--grey-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', flexShrink: 0 }}>
                    {item.done ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: '13px', color: item.done ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{item.label}</span>
                </div>
              ))}
              <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '8px' }} onClick={() => navigate('/portfolio')}>Complete Profile</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArtistDashboard;
