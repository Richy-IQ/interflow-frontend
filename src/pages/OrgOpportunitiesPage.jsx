import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { opportunitiesAPI } from '../services/api';
import toast from 'react-hot-toast';

const OPP_TYPES = ['job','audition','collaboration','workshop','residency','festival','other'];
const PAYMENT_TYPES = ['paid','unpaid','negotiable','stipend'];

const OrgOpportunitiesPage = () => {
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', opportunity_type: 'audition', description: '', requirements: '',
    disciplines: [], skills_required: [], location: '', is_remote: false,
    payment_type: 'negotiable', budget: '', currency: 'NGN',
    application_deadline: '', start_date: '', end_date: '', status: 'draft',
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    opportunitiesAPI.manage().then(r => setOpps(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target ? e.target.value : e }));

  const resetForm = () => {
    setForm({ title:'', opportunity_type:'audition', description:'', requirements:'', disciplines:[], skills_required:[], location:'', is_remote:false, payment_type:'negotiable', budget:'', currency:'NGN', application_deadline:'', start_date:'', end_date:'', status:'draft' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (opp) => {
    setForm({ ...opp, budget: opp.budget || '', disciplines: opp.disciplines || [], skills_required: opp.skills_required || [] });
    setEditing(opp.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) { toast.error('Title and description are required'); return; }
    setSaving(true);
    const payload = { ...form, budget: form.budget ? parseFloat(form.budget) : null };
    try {
      if (editing) {
        const r = await opportunitiesAPI.update(editing, payload);
        setOpps(o => o.map(x => x.id === editing ? r.data.data : x));
        toast.success('Opportunity updated!');
      } else {
        const r = await opportunitiesAPI.create(payload);
        setOpps(o => [r.data.data, ...o]);
        toast.success('Opportunity created!');
      }
      resetForm();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'publish') await opportunitiesAPI.publish(id);
      else if (action === 'close') await opportunitiesAPI.close(id);
      else if (action === 'cancel') await opportunitiesAPI.cancel(id);
      else if (action === 'delete') { await opportunitiesAPI.delete(id); setOpps(o => o.filter(x => x.id !== id)); toast.success('Deleted'); return; }
      load();
      toast.success(`Opportunity ${action}ed!`);
    } catch { toast.error(`Failed to ${action}`); }
  };

  const statusBadge = { draft: 'badge-grey', published: 'badge-success', closed: 'badge-error', cancelled: 'badge-error' };

  return (
    <DashboardLayout>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Manage Opportunities</h1>
          <p className="dash-page-sub">Create and manage your job postings, auditions, and opportunities</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(s => !s); }}>
          {showForm ? '✕ Cancel' : '+ Post Opportunity'}
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="section-card" style={{ padding: '28px', marginBottom: '24px', animation: 'fadeIn 0.3s ease' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            {editing ? 'Edit Opportunity' : 'Create New Opportunity'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="e.g. Lead Dancer for Afrobeats Commercial" value={form.title} onChange={set('title')} />
            </div>
            <div className="form-group">
              <label className="form-label">Opportunity Type</label>
              <select className="form-input form-select" value={form.opportunity_type} onChange={set('opportunity_type')}>
                {OPP_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Type</label>
              <select className="form-input form-select" value={form.payment_type} onChange={set('payment_type')}>
                {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Description *</label>
              <textarea className="form-input" rows="4" placeholder="Describe the opportunity..." value={form.description} onChange={set('description')} style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Requirements</label>
              <textarea className="form-input" rows="3" placeholder="What are you looking for?" value={form.requirements} onChange={set('requirements')} style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" placeholder="e.g. Lagos, Nigeria" value={form.location} onChange={set('location')} />
            </div>
            <div className="form-group">
              <label className="form-label">Budget ({form.currency})</label>
              <input className="form-input" type="number" placeholder="0" value={form.budget} onChange={set('budget')} />
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input className="form-input" type="date" value={form.application_deadline} onChange={set('application_deadline')} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input form-select" value={form.status} onChange={set('status')}>
                <option value="draft">Save as Draft</option>
                <option value="published">Publish Immediately</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form.is_remote} onChange={e => setForm(f => ({ ...f, is_remote: e.target.checked }))} style={{ accentColor: 'var(--gold)' }} />
                Remote / Online opportunity
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? <span className="spinner" /> : editing ? 'Update Opportunity' : 'Create Opportunity'}
            </button>
            <button className="btn btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      {/* Opportunities Table */}
      <div className="section-card">
        <div className="section-card-header">
          <span className="section-card-title">Your Opportunities ({opps.length})</span>
        </div>
        {loading ? (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '8px' }} />)}
          </div>
        ) : opps.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <div>No opportunities posted yet. Create your first one above!</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--grey-1)' }}>
                  {['Title', 'Type', 'Status', 'Deadline', 'Applicants', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {opps.map((opp, i) => (
                  <tr key={opp.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--grey-1)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--dark)', marginBottom: '2px' }}>{opp.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opp.is_remote ? '🌐 Remote' : `📍 ${opp.location || 'TBD'}`}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-gold">{opp.opportunity_type}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${statusBadge[opp.status] || 'badge-grey'}`}>{opp.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {opp.application_deadline || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--dark)' }}>
                      {opp.applications_count}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {opp.status === 'draft' && (
                          <button className="btn btn-sm btn-primary" onClick={() => handleAction(opp.id, 'publish')}>Publish</button>
                        )}
                        {opp.status === 'published' && (
                          <button className="btn btn-sm btn-outline" onClick={() => handleAction(opp.id, 'close')}>Close</button>
                        )}
                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(opp)}>Edit</button>
                        <button className="btn btn-sm btn-outline" style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                          onClick={() => window.confirm('Delete this opportunity?') && handleAction(opp.id, 'delete')}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrgOpportunitiesPage;
