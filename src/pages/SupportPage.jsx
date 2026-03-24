import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { supportAPI } from '../services/api';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'technical', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supportAPI.list().then(r => setTickets(r.data.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) { toast.error('Subject and message are required'); return; }
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    try {
      const r = await supportAPI.create(fd);
      setTickets(t => [r.data.data, ...t]);
      setShowForm(false);
      setForm({ category: 'technical', subject: '', message: '' });
      toast.success(`Ticket ${r.data.data.ticket_number} submitted!`);
    } catch { toast.error('Failed to submit ticket'); }
    finally { setLoading(false); }
  };

  const CATEGORIES = [
    { value: 'account', label: 'Account Issue' },
    { value: 'technical', label: 'Technical Problem' },
    { value: 'billing', label: 'Billing' },
    { value: 'opportunity', label: 'Opportunity / Application' },
    { value: 'report', label: 'Report a User' },
    { value: 'other', label: 'Other' },
  ];

  const statusColors = { open: 'badge-gold', in_progress: 'badge-info', resolved: 'badge-success', closed: 'badge-grey' };

  return (
    <DashboardLayout>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Support</h1>
          <p className="dash-page-sub">Get help from the Interflow team</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕ Cancel' : '+ New Ticket'}
        </button>
      </div>

      {/* Support categories info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { icon: '📖', title: 'FAQ', desc: 'Find answers to common questions' },
          { icon: '💬', title: 'Live Chat', desc: 'Chat with our support team' },
          { icon: '📧', title: 'Email Support', desc: 'Get help via email' },
        ].map((c, i) => (
          <div key={i} className="section-card" style={{ padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{c.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--dark)', marginBottom: '6px' }}>{c.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* New Ticket Form */}
      {showForm && (
        <div className="section-card" style={{ padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Submit a Support Ticket</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input className="form-input" placeholder="Brief description of the issue" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea className="form-input" rows="5" placeholder="Describe your issue in detail..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? <span className="spinner" /> : 'Submit Ticket'}</button>
              <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket List */}
      <div className="section-card">
        <div className="section-card-header"><span className="section-card-title">My Tickets</span></div>
        {tickets.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No support tickets yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Ticket #','Category','Subject','Status','Date'].map(h => <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--gold)' }}>#{t.ticket_number}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{t.category_display}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--dark)' }}>{t.subject}</td>
                  <td style={{ padding: '12px 16px' }}><span className={`badge ${statusColors[t.status] || 'badge-grey'}`}>{t.status_display}</span></td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SupportPage;
