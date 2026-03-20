import { useState, useEffect } from 'react';
import { getVendorNotifications } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const fmt = (n) => `₹${parseFloat(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getVendorNotifications()
      .then(r => setData(r.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  const totalPaid = (data?.data || []).reduce((s, p) => s + parseFloat(p.amount_paid || 0), 0);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div className="vendor-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 16px var(--accent-glow)' }}>💳</div>
          <span style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg, #f0f4ff, var(--accent-hover))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PayTrack</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{initials}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Vendor</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout →</button>
        </div>
        </div>
      </div>

      {/* Content */}
      <div className="vendor-content-wrap" style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>👋 Hello, {user?.name?.split(' ')[0]}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here are your payment notifications from PayTrack.</p>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: 32 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)' }}>💸</div>
            <div className="stat-value">{data?.total_notifications || 0}</div>
            <div className="stat-label">Payments Received</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(251,191,36,0.12)' }}>💰</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{fmt(totalPaid)}</div>
            <div className="stat-label">Total Amount Received</div>
          </div>
        </div>

        {loading && <div className="spinner">Loading your notifications…</div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {!loading && data?.data?.length === 0 && (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🔔</div>
              <div className="empty-state-text">No payment notifications yet</div>
              <div className="empty-state-sub">You'll see them here once a payment has been made and you've been notified.</div>
            </div>
          </div>
        )}

        {!loading && (data?.data || []).length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)' }}>PAYMENT NOTIFICATIONS</h2>
            {data.data.map((p, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>💸</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{fmt(p.amount_paid)} Received</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                        {p.po_number} · {p.payment_type}
                      </div>
                    </div>
                    <span className="badge badge-notified">✓ Notified</span>
                  </div>
                  <div style={{
                    marginTop: 12, padding: '10px 14px', background: 'var(--success-light)',
                    borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)',
                    fontSize: 13, color: '#6ee7b7'
                  }}>
                    {p.message}
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>🔖 UTR: <strong style={{ color: 'var(--text-secondary)' }}>{p.utr_reference}</strong></span>
                    <span>📅 {p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}