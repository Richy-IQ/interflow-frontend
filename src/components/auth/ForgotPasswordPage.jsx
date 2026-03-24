import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Auth.css';

const Logo = ({ white = false }) => (
  <svg width="120" height="36" viewBox="0 0 120 36" fill="none">
    <path d="M8 6 C8 6 14 2 18 8 C22 14 16 20 20 24 C24 28 28 26 28 26" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M4 14 C4 14 10 10 14 16 C18 22 12 26 16 30" stroke="#A07C1E" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <text x="36" y="24" fontFamily="Cormorant Garamond,serif" fontSize="20" fontWeight="700" fill={white ? '#FFFFFF' : '#1A1A1A'}>Interflow</text>
    <text x="36" y="34" fontFamily="DM Sans,sans-serif" fontSize="8" fontWeight="400" fill={white ? 'rgba(255,255,255,0.5)' : '#888'} letterSpacing="0.15em">ARTIST'S EXCHANGE</text>
  </svg>
);

const ForgotPasswordPage = () => {
  const [step, setStep] = useState('request'); // request → otp → reset → done
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const [form, setForm] = useState({ new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setLoading(true);
    try {
      await authAPI.requestPasswordReset({ email });
      setStep('otp');
      setError('');
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleOTPChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) inputRefs.current[idx+1]?.focus();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.confirmPasswordReset({ email, code: otp.join(''), ...form });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Check your code.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-visual-content">
          <div className="auth-visual-logo"><Logo white /></div>
          <div className="auth-visual-tagline">Reset Your<br /><span>Password</span></div>
          <p className="auth-visual-sub">We'll help you get back into your account securely.</p>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrapper">
          <div className="auth-logo-mobile"><Logo /></div>

          {step === 'request' && (
            <>
              <h1 className="auth-title">Forgot Password?</h1>
              <p className="auth-subtitle">Enter your email and we'll send you a reset code. <Link to="/login">Back to login</Link></p>
              <form className="auth-form" onSubmit={handleRequest}>
                <div className="form-group">
                  <input className="form-input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
                  {error && <span className="form-error">{error}</span>}
                </div>
                <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Send Reset Code →'}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="otp-mail-icon">✉️</div>
              <h1 className="auth-title" style={{ textAlign: 'center' }}>Check Your Email</h1>
              <p className="auth-subtitle" style={{ textAlign: 'center' }}>Enter the 6-digit code sent to <strong>{email}</strong></p>
              <div className="otp-wrapper">
                {otp.map((d,i) => (
                  <input key={i} ref={el => inputRefs.current[i]=el} className="otp-input-box" type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handleOTPChange(i, e.target.value)}
                    onKeyDown={e => { if(e.key==='Backspace' && !d && i>0) inputRefs.current[i-1]?.focus(); }}
                  />
                ))}
              </div>
              {error && <p className="form-error" style={{ textAlign: 'center', marginTop: '8px' }}>{error}</p>}
              <button className="btn btn-primary auth-btn" style={{ marginTop: '24px' }} onClick={() => setStep('reset')}>
                Continue →
              </button>
            </>
          )}

          {step === 'reset' && (
            <>
              <h1 className="auth-title">New Password</h1>
              <p className="auth-subtitle">Choose a strong new password for your account</p>
              <form className="auth-form" onSubmit={handleReset}>
                <div className="form-group">
                  <div className="auth-input-wrapper">
                    <input className="form-input" type={showPwd ? 'text' : 'password'} placeholder="New password" value={form.new_password} onChange={e => setForm(f=>({...f,new_password:e.target.value}))} />
                    <span className="auth-eye-btn" onClick={() => setShowPwd(p=>!p)}>{showPwd ? '🙈' : '👁'}</span>
                  </div>
                </div>
                <div className="form-group">
                  <input className="form-input" type="password" placeholder="Confirm new password" value={form.confirm_password} onChange={e => setForm(f=>({...f,confirm_password:e.target.value}))} />
                </div>
                {error && <span className="form-error">{error}</span>}
                <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Reset Password →'}
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div style={{ textAlign: 'center' }}>
              <div className="congrats-check" style={{ margin: '0 auto 24px', width: '64px', height: '64px', fontSize: '28px' }}>✓</div>
              <h1 className="auth-title">Password Reset!</h1>
              <p className="auth-subtitle">Your password has been reset successfully. You can now sign in with your new password.</p>
              <button className="btn btn-primary auth-btn" onClick={() => navigate('/login')}>Sign In →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
