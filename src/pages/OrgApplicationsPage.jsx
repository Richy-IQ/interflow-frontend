import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { applicationsAPI, opportunitiesAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['under_review', 'shortlisted', 'accepted', 'rejected'];
const statusColors = {
  pending: 'badge-gold', under_review: 'badge-info',
  shortlisted: 'badge-success', accepted: 'badge-success',
  rejected: 'badge-error', withdrawn: 'badge-grey',
};

const OrgApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpp, setFilterOpp] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ status: '', org_notes: '', org_feedback: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      applicationsAPI.orgAll(),
      opportunitiesAPI.manage(),
    ]).then(([a, o]) => {
      setApplications(a.data.data || []);
      setOpportunities(o.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(a => {
    if (filterOpp && a.opportunity?.id !== filterOpp) return false;
    if (filterStatus && a.status !== filterStatus) return false;
    return true;
  });

  const handleView = (app) => {
    setSelected(app);
    setFeedback({ status: app.status, org_notes: app.org_notes || '', org_feedback: app.org_feedback || '' });
  };

  const handleUpdateStatus = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const r = await applicationsAPI.updateStatus(selected.id, feedback);
      setApplications(a => a.map(x => x.id === selected.id ? { ...x, ...r.data.data } : x));
      setSelected(null);
      toast.success('Application status updated!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout>
      <div className="dash-page-header">
        <h1 className="dash-page-title">Applications</h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select className="form-input form-select" style={{ width: '240px' }} value={filterOpp} onChange={e => setFilterOpp(e.target.value)}>
          <option value="">All Opportunities</option>
          {opportunities.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
        </select>
        <select className="form-input form-select" style={{ width: '180px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {['pending','under_review','shortlisted','accepted','rejected','withdrawn'].map(s => (
            <option key={s} value={s}>{s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>
          ))}
        </select>
        <div style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          {filtered.length} application{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Applications Table */}
      <div className="section-card">
        {loading ? (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '8px' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <div>No applications yet. Post an opportunity to start receiving applications.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--grey-1)' }}>
                  {['Artist', 'Opportunity', 'Discipline', 'Applied', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => {
                  const init = (app.artist_name || 'A').charAt(0).toUpperCase();
                  return (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--grey-1)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                            {app.artist_avatar ? <img src={app.artist_avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : init}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--dark)' }}>{app.artist_name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.artist_location}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.opportunity?.title || '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge badge-gold">{app.artist_discipline || '—'}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${statusColors[app.status] || 'badge-grey'}`}>
                          {app.status.replace(/_/g,' ')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button className="btn btn-sm btn-outline" onClick={() => handleView(app)}>Review</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '560px', padding: '32px', animation: 'scaleIn 0.25s ease', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--dark)' }}>Review Application</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {/* Artist info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: 'var(--grey-1)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--gold)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', flexShrink: 0 }}>
                {(selected.artist_name || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--dark)' }}>{selected.artist_name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selected.artist_discipline} · {selected.artist_location}</div>
              </div>
            </div>

            {/* Cover letter */}
            {selected.cover_letter && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Cover Letter</div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', padding: '14px', background: 'var(--grey-1)', borderRadius: 'var(--radius-md)' }}>{selected.cover_letter}</p>
              </div>
            )}

            {/* Portfolio link */}
            {selected.portfolio_link && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Portfolio</div>
                <a href={selected.portfolio_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', fontSize: '14px', textDecoration: 'underline' }}>{selected.portfolio_link}</a>
              </div>
            )}

            {/* Status update */}
            {selected.status !== 'withdrawn' && (
              <>
                <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Update Status</label>
                    <select className="form-input form-select" value={feedback.status} onChange={e => setFeedback(f => ({ ...f, status: e.target.value }))}>
                      <option value="">Keep current ({selected.status})</option>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Internal Notes <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(not shown to artist)</span></label>
                    <textarea className="form-input" rows="2" placeholder="Your internal notes..." value={feedback.org_notes} onChange={e => setFeedback(f => ({ ...f, org_notes: e.target.value }))} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Feedback to Artist <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(visible to artist)</span></label>
                    <textarea className="form-input" rows="2" placeholder="Feedback shown to the artist..." value={feedback.org_feedback} onChange={e => setFeedback(f => ({ ...f, org_feedback: e.target.value }))} style={{ resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={handleUpdateStatus} disabled={saving}>
                      {saving ? <span className="spinner" /> : 'Update Application'}
                    </button>
                    <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrgApplicationsPage;
