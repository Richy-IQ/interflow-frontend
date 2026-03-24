import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import './Auth.css';

const Logo = ({ white = false }) => (
  <svg width="120" height="36" viewBox="0 0 120 36" fill="none">
    <path d="M8 6 C8 6 14 2 18 8 C22 14 16 20 20 24 C24 28 28 26 28 26" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M4 14 C4 14 10 10 14 16 C18 22 12 26 16 30" stroke="#A07C1E" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <text x="36" y="24" fontFamily="Cormorant Garamond,serif" fontSize="20" fontWeight="700" fill={white ? '#FFFFFF' : '#1A1A1A'}>Interflow</text>
    <text x="36" y="34" fontFamily="DM Sans,sans-serif" fontSize="8" fontWeight="400" fill={white ? 'rgba(255,255,255,0.5)' : '#888'} letterSpacing="0.15em">ARTIST'S EXCHANGE</text>
  </svg>
);

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.email) { setErrors({ email: 'Email is required' }); return; }
    if (!form.password) { setErrors({ password: 'Password is required' }); return; }
    try {
      const result = await login(form);
      if (result.is_onboarded) {
        navigate(result.role === 'artist' ? '/dashboard' : '/org/dashboard');
      } else {
        navigate(result.role === 'artist' ? '/onboarding/artist' : '/onboarding/organization');
      }
    } catch (err) {
      const data = err.response?.data;
      setErrors(data?.errors || { email: data?.message || 'Invalid credentials' });
    }
  };

  return (
    <div className="auth-page">
      {/* Visual */}
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-visual-content">
          <div className="auth-visual-logo"><Logo white /></div>
          <div className="auth-visual-tagline">Welcome<br /><span>Back</span></div>
          <p className="auth-visual-sub">Sign in to continue building your creative journey on Interflow.</p>
          <div className="auth-visual-artists">
            {['🎤','🎹','🥁','🎭'].map((e,i) => (
              <div className="auth-visual-img" key={i}>{e}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-panel">
        <div className="auth-form-wrapper">
          <div className="auth-logo-mobile"><Logo /></div>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="auth-input-wrapper">
                <input
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="current-password"
                />
                <span className="auth-eye-btn" onClick={() => setShowPwd(p => !p)}>
                  {showPwd ? '🙈' : '👁'}
                </span>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="auth-forgot">
              <span onClick={() => navigate('/forgot-password')}>Forgot your Password?</span>
            </div>

            <button className="btn btn-primary auth-btn" type="submit" disabled={isLoading}>
              {isLoading ? <span className="spinner" /> : 'Continue →'}
            </button>

            <div className="divider auth-divider">OR</div>

            <button type="button" className="auth-social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            <button type="button" className="auth-social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Continue with Apple
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
