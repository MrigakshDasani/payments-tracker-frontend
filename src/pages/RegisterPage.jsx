import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Account created! You can now sign in.');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow top-left" />
      <div className="auth-glow bottom-right" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">💳</div>
          <span className="auth-logo-text">PayTrack</span>
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Register as a user or vendor</p>

        {error   && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your name" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">I am a…</label>
            <select className="form-select" value={form.role}
              onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="user">👤 User (Internal Staff)</option>
              <option value="vendor">🏢 Vendor (External Supplier)</option>
            </select>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account…' : '→ Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/login')}>Sign in</span>
        </div>
      </div>
    </div>
  );
}
