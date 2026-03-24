import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

// ─── Step 1: Role Selection ───────────────────────────────────────
const RoleSelect = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  const roles = [
    {
      key: 'artist',
      icon: '🎤',
      title: 'As an Artist',
      desc: "Build your personalized portfolio and find your next best opportunity with Interflow",
    },
    {
      key: 'organization',
      icon: '🏢',
      title: 'As an Organization',
      desc: "Build your personalized profile and find your next best opportunity with Interflow",
    },
  ];

  return (
    <div className="role-select-page">
      <div className="role-select-bg" />
      <div className="role-select-inner">
        <div className="role-select-logo"><Logo white /></div>
        <h2 className="role-select-title">Welcome!</h2>
        <p className="role-select-sub">Build your artist portfolio, connect with opportunities and organize events.</p>
        <p className="role-select-question">How would you like to use Interflow?</p>
        <div className="role-cards">
          {roles.map((r) => (
            <div
              key={r.key}
              className={`role-card ${selected === r.key ? 'selected' : ''}`}
              onClick={() => setSelected(r.key)}
            >
              <div className="role-card-img">{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
              <button className="role-card-btn" onClick={(e) => { e.stopPropagation(); onSelect(r.key); }}>
                Continue →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Step 2: Sign Up Form ─────────────────────────────────────────
const SignUpForm = ({ role, onSuccess }) => {
  const [form, setForm] = useState({ email: '', password: '', confirm_password: '', agreed: false });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Min 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Must contain an uppercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Must contain a number';
    if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
    if (!form.agreed) e.agreed = 'Please agree to Terms of Service';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authAPI.register({ email: form.email, password: form.password, confirm_password: form.confirm_password, role });
      onSuccess(form.email);
    } catch (err) {
      const data = err.response?.data;
      setErrors(data?.errors || { email: data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="auth-page">
      {/* Visual */}
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-visual-content">
          <div className="auth-visual-logo"><Logo white /></div>
          <div className="auth-visual-tagline">Join Africa's<br /><span>Creative Exchange</span></div>
          <p className="auth-visual-sub">Thousands of artists and organizations already building their future on Interflow.</p>
          <div className="auth-visual-artists">
            {['🎭','🎵','💃','🎸'].map((e,i) => (
              <div className="auth-visual-img" key={i}>{e}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-panel">
        <div className="auth-form-wrapper">
          <div className="auth-logo-mobile"><Logo /></div>
          <h1 className="auth-title">Sign Up</h1>
          <p className="auth-subtitle">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">✉</span>
                <input
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
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
                />
                <span className="auth-eye-btn" onClick={() => setShowPwd(p => !p)}>
                  {showPwd ? '🙈' : '👁'}
                </span>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <div className="auth-input-wrapper">
                <input
                  className={`form-input ${errors.confirm_password ? 'error' : ''}`}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={form.confirm_password}
                  onChange={set('confirm_password')}
                />
                <span className="auth-eye-btn" onClick={() => setShowConfirm(p => !p)}>
                  {showConfirm ? '🙈' : '👁'}
                </span>
              </div>
              {errors.confirm_password && <span className="form-error">{errors.confirm_password}</span>}
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Passwords must be at least 8 characters and contain at least one uppercase letter and one number
            </p>

            <label className="auth-terms">
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={e => setForm(f => ({ ...f, agreed: e.target.checked }))}
              />
              <span>Agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>
            {errors.agreed && <span className="form-error">{errors.agreed}</span>}

            <button className="btn btn-primary auth-btn" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Continue →'}
            </button>

            <div className="divider auth-divider">OR</div>

            <button type="button" className="auth-social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign up with Google
            </button>

            <button type="button" className="auth-social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Sign up with Apple
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── OTP Verification ─────────────────────────────────────────────
const OTPVerification = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const inputRefs = React.useRef([]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter the complete 6-digit code'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.verifyOTP({ email, code });
      const { access, refresh } = res.data.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      onSuccess(res.data.data);
    } catch (err) {
      setError(err.response?.data?.errors?.code?.[0] || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendOTP({ email });
      setResent(true);
      setTimeout(() => setResent(false), 10000);
    } catch {}
    finally { setResending(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-visual-content">
          <div className="auth-visual-logo"><Logo white /></div>
          <div className="auth-visual-tagline">Check Your<br /><span>Email</span></div>
          <p className="auth-visual-sub">We sent a 6-digit verification code to confirm your email address.</p>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-form-wrapper" style={{ textAlign: 'center' }}>
          <div className="auth-logo-mobile"><Logo /></div>
          <div className="otp-mail-icon">✉️</div>
          <h1 className="auth-title" style={{ textAlign: 'center' }}>You've Got a Mail!</h1>
          <p className="auth-subtitle" style={{ textAlign: 'center' }}>
            A confirmation email has been sent to <strong>{email}</strong>.
            Enter the 6-digit code below.
          </p>

          <div className="otp-wrapper" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                className="otp-input-box"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
              />
            ))}
          </div>

          {error && <p className="form-error" style={{ textAlign: 'center', marginTop: '8px' }}>{error}</p>}

          <button
            className="btn btn-primary auth-btn"
            style={{ marginTop: '24px' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Continue →'}
          </button>

          <p className="otp-resend" style={{ marginTop: '20px' }}>
            {resent ? '✅ Code resent!' : <>
              If you did not receive the email,{' '}
              <span onClick={handleResend}>{resending ? 'Resending...' : 'resend another email'}</span>
            </>}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Congratulations ──────────────────────────────────────────────
const Congratulations = ({ onContinue }) => (
  <div className="congrats-page">
    <div className="congrats-bg" />
    <div className="congrats-inner">
      <div className="congrats-check">✓</div>
      <h2 className="congrats-title">Your Account Has Been Created!</h2>
      <p className="congrats-sub">
        Congratulations! Your account is now set up and ready to go. To get the best experience, complete your profile so you can personalize your feed!
      </p>
      <button className="btn btn-primary btn-lg" onClick={onContinue}>
        Setup Portfolio →
      </button>
    </div>
  </div>
);

// ─── Main Register Page ───────────────────────────────────────────
const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('role');    // role → signup → otp → congrats
  const [role, setRole] = useState(searchParams.get('role') || null);
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);

  const handleRoleSelect = (r) => { setRole(r); setStep('signup'); };
  const handleSignupSuccess = (em) => { setEmail(em); setStep('otp'); };
  const handleOTPSuccess = (data) => { setUserData(data); setStep('congrats'); };
  const handleContinue = () => {
    if (userData?.role === 'artist') navigate('/onboarding/artist');
    else navigate('/onboarding/organization');
  };

  // Auto-skip role if passed via URL
  React.useEffect(() => {
    if (role && step === 'role') setStep('signup');
  }, []);

  if (step === 'role') return <RoleSelect onSelect={handleRoleSelect} />;
  if (step === 'signup') return <SignUpForm role={role} onSuccess={handleSignupSuccess} />;
  if (step === 'otp') return <OTPVerification email={email} onSuccess={handleOTPSuccess} />;
  if (step === 'congrats') return <Congratulations onContinue={handleContinue} />;
  return null;
};

export default RegisterPage;
