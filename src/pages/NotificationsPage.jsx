import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { notificationsAPI } from '../services/api';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread

  const load = () => {
    const params = filter === 'unread' ? { unread: 'true' } : {};
    notificationsAPI.list(params)
      .then(r => setNotifications(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(n => n.map(x => x.id === id ? { ...x, is_read: true } : x));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(n => n.map(x => ({ ...x, is_read: true })));
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(n => n.filter(x => x.id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const typeIcon = {
    new_application: '📝',
    application_status: '🔄',
    new_connection: '👥',
    connection_accepted: '🤝',
    new_opportunity: '💡',
    profile_view: '👁',
    system: '🔔',
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <DashboardLayout>
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Notifications</h1>
          <p className="dash-page-sub">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={handleMarkAllRead}>
            ✓ Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        {['all', 'unread'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '10px 20px', fontSize: '14px',
            fontWeight: filter === f ? '600' : '400',
            color: filter === f ? 'var(--gold)' : 'var(--text-muted)',
            borderBottom: `2px solid ${filter === f ? 'var(--gold)' : 'transparent'}`,
            background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
            transition: 'all var(--transition)', textTransform: 'capitalize',
          }}>
            {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="section-card">
        {loading ? (
          <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: '64px', borderRadius: '8px' }} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--dark)', marginBottom: '8px' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              We'll notify you when something happens
            </div>
          </div>
        ) : (
          notifications.map((notif, i) => (
            <div
              key={notif.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '16px 20px',
                borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                background: notif.is_read ? 'var(--white)' : 'rgba(139,105,20,0.03)',
                transition: 'background var(--transition)',
              }}
            >
              {/* Unread dot */}
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: notif.is_read ? 'transparent' : 'var(--gold)',
                flexShrink: 0, marginTop: '6px',
              }} />

              {/* Icon */}
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'var(--grey-1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', flexShrink: 0,
              }}>
                {typeIcon[notif.notification_type] || '🔔'}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '14px', fontWeight: notif.is_read ? '400' : '600',
                  color: 'var(--dark)', marginBottom: '4px',
                }}>
                  {notif.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {notif.message}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--grey-3)', marginTop: '6px' }}>
                  {new Date(notif.created_at).toLocaleString()}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {!notif.is_read && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    style={{
                      padding: '5px 10px', fontSize: '12px', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-full)', background: 'none',
                      cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
                      transition: 'all var(--transition)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notif.id)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'none', border: '1px solid var(--border)',
                    cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
