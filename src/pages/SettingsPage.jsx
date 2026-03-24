import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import { settingsAPI, authAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ email: '' });
  const [notifPrefs, setNotifPrefs] = useState({});
  const [privacy, setPrivacy] = useState({});
  const [twoFA, setTwoFA] = useState({ is_enabled: false });
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    settingsAPI.getProfile().then(r => setProfileForm({ email: r.data.data?.email || '' })).catch(() => {});
    settingsAPI.getNotificationPrefs().then(r => setNotifPrefs(r.data.data || {})).catch(() => {});
    settingsAPI.getPrivacy().then(r => setPrivacy(r.data.data || {})).catch(() => {});
    settingsAPI.get2FAStatus().then(r => setTwoFA(r.data.data || {})).catch(() => {});
  }, []);

  const save = async (fn, successMsg) => {
    setLoading(true);
    try { await fn(); toast.success(successMsg); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed to save'); }
    finally { setLoading(false); }
  };

  const TABS = [
    { key: 'profile', label: 'Profile Information', icon: '👤' },
    { key: 'notifications', label: 'Notification Settings', icon: '🔔' },
    { key: 'privacy', label: 'Privacy Settings', icon: '🔒' },
    { key: '2fa', label: '2FA Security', icon: '🛡' },
    { key: 'account', label: 'Account Management', icon: '⚙' },
  ];

  return (
    <DashboardLayout>
      <div className="dash-page-header"><h1 className="dash-page-title">Settings</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px' }}>
        {/* Settings Nav */}
        <div className="section-card" style={{ padding: '12px', height: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '11px 12px', borderRadius: 'var(--radius-sm)', background: tab===t.key?'var(--gold-pale)':'none', color: tab===t.key?'var(--gold)':'var(--text-secondary)', fontWeight: tab===t.key?'600':'400', fontSize: '14px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all var(--transition)', textAlign: 'left', marginBottom: '2px' }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="section-card" style={{ padding: '28px' }}>
          {tab === 'profile' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Profile Information</h3>
              <div className="form-group" style={{ maxWidth: '400px', marginBottom: '20px' }}>
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <button className="btn btn-primary" disabled={loading} onClick={() => save(() => settingsAPI.updateProfile(profileForm), 'Profile updated!')}>
                {loading ? <span className="spinner" /> : 'Save Changes'}
              </button>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Notification Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { key: 'email_new_connection', label: 'New connection request', type: 'Email' },
                  { key: 'email_connection_accepted', label: 'Connection accepted', type: 'Email' },
                  { key: 'email_new_application', label: 'New application (orgs)', type: 'Email' },
                  { key: 'email_application_status', label: 'Application status update', type: 'Email' },
                  { key: 'email_new_opportunity', label: 'New opportunity matching my profile', type: 'Email' },
                  { key: 'email_marketing', label: 'Marketing & promotions', type: 'Email' },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--dark)' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.type} notification</div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input type="checkbox" checked={!!notifPrefs[item.key]} onChange={e => { const updated = { ...notifPrefs, [item.key]: e.target.checked }; setNotifPrefs(updated); settingsAPI.updateNotificationPrefs({ [item.key]: e.target.checked }).catch(() => {}); }} style={{ display: 'none' }} />
                      <span style={{ position: 'absolute', inset: 0, background: notifPrefs[item.key] ? 'var(--gold)' : 'var(--grey-2)', borderRadius: '12px', cursor: 'pointer', transition: 'background var(--transition)' }}>
                        <span style={{ position: 'absolute', left: notifPrefs[item.key] ? '22px' : '2px', top: '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left var(--transition)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'privacy' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Privacy Settings</h3>
              {[
                { key: 'profile_visible_to', label: 'Profile Visibility', type: 'select', options: [['everyone','Everyone'],['connections','Connections Only'],['organizations','Organizations Only']] },
                { key: 'allow_messages_from', label: 'Allow Messages From', type: 'select', options: [['everyone','Everyone'],['connections','Connections Only'],['organizations','Organizations Only']] },
                { key: 'show_location', label: 'Show my location on profile', type: 'toggle' },
                { key: 'show_in_search', label: 'Appear in search results', type: 'toggle' },
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--dark)' }}>{item.label}</div>
                  {item.type === 'select' ? (
                    <select className="form-input form-select" style={{ width: '180px' }} value={privacy[item.key] || ''} onChange={e => { const up = { ...privacy, [item.key]: e.target.value }; setPrivacy(up); settingsAPI.updatePrivacy({ [item.key]: e.target.value }).catch(() => {}); }}>
                      {item.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  ) : (
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input type="checkbox" checked={!!privacy[item.key]} onChange={e => { const up = { ...privacy, [item.key]: e.target.checked }; setPrivacy(up); settingsAPI.updatePrivacy({ [item.key]: e.target.checked }).catch(() => {}); }} style={{ display: 'none' }} />
                      <span style={{ position: 'absolute', inset: 0, background: privacy[item.key] ? 'var(--gold)' : 'var(--grey-2)', borderRadius: '12px', cursor: 'pointer', transition: 'background var(--transition)' }}>
                        <span style={{ position: 'absolute', left: privacy[item.key] ? '22px' : '2px', top: '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left var(--transition)' }} />
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === '2fa' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Two-Factor Authentication</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Add an extra layer of security to your account using an authenticator app.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ fontSize: '32px' }}>🛡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--dark)' }}>Authenticator App</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Use Google Authenticator, Authy, or similar</div>
                </div>
                <span className={`badge ${twoFA.is_enabled ? 'badge-success' : 'badge-grey'}`}>{twoFA.is_enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              {!twoFA.is_enabled ? (
                <button className="btn btn-primary" onClick={() => settingsAPI.setup2FA().then(r => { const { otpauth_uri, secret } = r.data.data; alert(`Scan this in your authenticator app:\n\nSecret: ${secret}\n\nOr use the URI: ${otpauth_uri}`); }).catch(() => toast.error('Setup failed'))}>
                  Enable 2FA
                </button>
              ) : (
                <button className="btn btn-outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => { const code = prompt('Enter your current OTP code to disable 2FA:'); if (code) settingsAPI.disable2FA({ otp_code: code }).then(() => { setTwoFA({ is_enabled: false }); toast.success('2FA disabled'); }).catch(() => toast.error('Invalid code')); }}>
                  Disable 2FA
                </button>
              )}
            </div>
          )}

          {tab === 'account' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Account Management</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--dark)', marginBottom: '8px' }}>Deactivate Account</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Temporarily disable your account. You can reactivate by signing in.</p>
                  <button className="btn btn-outline btn-sm" onClick={() => { if (window.confirm('Deactivate your account?')) settingsAPI.deactivateAccount().then(() => { logout(); navigate('/login'); }).catch(() => toast.error('Failed')); }}>
                    Deactivate Account
                  </button>
                </div>
                <div style={{ padding: '20px', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', background: '#FFF5F5' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--error)', marginBottom: '8px' }}>Delete Account</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Permanently delete your account and all data. This cannot be undone.</p>
                  <button className="btn btn-sm" style={{ background: 'var(--error)', color: 'white' }} onClick={() => { const pwd = prompt('Enter your password:'); if (!pwd) return; if (window.confirm('Type "DELETE" to confirm:') !== true) return; settingsAPI.deleteAccount({ password: pwd, confirm: 'DELETE' }).then(() => { logout(); navigate('/'); toast.success('Account deleted'); }).catch(() => toast.error('Failed')); }}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
