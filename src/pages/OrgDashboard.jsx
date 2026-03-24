// OrgDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import { authAPI, opportunitiesAPI, applicationsAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const OrgDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const orgName = user?.email?.split('@')[0] || 'Organization';

  useEffect(() => {
    authAPI.getDashboard().then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Connections', value: stats?.connections ?? '—', icon: '👥', color: 'stat-blue' },
    { label: 'Total Applicants', value: stats?.total_applicants ?? '—', icon: '📝', color: 'stat-green' },
    { label: 'Open Opportunities', value: stats?.open_opportunities ?? '—', icon: '💡', color: 'stat-gold' },
    { label: 'New Applicants', value: stats?.new_applicants ?? '—', icon: '⭐', color: 'stat-purple' },
  ];

  return (
    <DashboardLayout>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Organization Dashboard</h1>
          <p className="dash-page-sub">Manage your opportunities and discover talent</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/org/opportunities')}>+ Post Opportunity</button>
      </div>

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
        <div>
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title">Recent Applicants</span>
              <span className="section-card-action" onClick={() => navigate('/org/applications')}>View all →</span>
            </div>
            <div className="section-card-body" style={{ padding: 0 }}>
              {(stats?.recent_activity || []).length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No applications yet. Post an opportunity to get started.</div>
              ) : (
                stats.recent_activity.map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                      {(a.artist_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--dark)' }}>{a.artist_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.opportunity_title}</div>
                    </div>
                    <span className={`badge ${a.status === 'accepted' ? 'badge-success' : a.status === 'rejected' ? 'badge-error' : 'badge-gold'}`}>{a.status_display}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="section-card">
            <div className="section-card-header">
              <span className="section-card-title">Quick Actions</span>
            </div>
            <div className="section-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Post New Opportunity', icon: '➕', action: () => navigate('/org/opportunities') },
                { label: 'View Applications', icon: '📋', action: () => navigate('/org/applications') },
                { label: 'Browse Talent', icon: '🔍', action: () => navigate('/network') },
                { label: 'Company Profile', icon: '🏢', action: () => navigate('/org/profile') },
              ].map((item, i) => (
                <button key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--white)', cursor: 'pointer', transition: 'all var(--transition)', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)', width: '100%', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--grey-1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrgDashboard;
