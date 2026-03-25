import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AuthSplitLayout from '@/components/layout/AuthSplitLayout';
import useAuthStore from '@/store/authStore';
import './Auth.css';

/* ─── Brand ─────────────────────────────────────────────────────── */
const GOLD      = '#8D5D1D';
const GOLD_DARK = '#7A4E16';
const GREEN     = '#16A34A';

/* ─── Green checkmark circle ─────────────────────────────────────── */
const CheckCircle = () => (
  <div
    className="flex items-center justify-center mx-auto mb-7"
    style={{ width: 72, height: 72, borderRadius: '50%', background: GREEN }}
  >
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path
        d="M9 18.5L15.5 25L27 12"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   Account Created Success Page
   ───────────────────────────────────────────────────────────────── */
const AccountCreatedPage = () => {
  const navigate = useNavigate();
  const user     = useAuthStore(s => s.user);

  const handleSetup = () => {
    if (user?.role === 'organization') {
      navigate('/onboarding/organization');
    } else {
      navigate('/onboarding/artist');
    }
  };

  return (
    <AuthSplitLayout
      imageSrc="/assets/images/auth/register-bg.jpg"
      imageAlt="Artist on stage"
      leftWidth="52"
    >
      <div className="w-full max-w-[420px] text-center">

        {/* Green checkmark */}
        <CheckCircle />

        {/* Heading */}
        <h1
          className="font-bold text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: 1.2 }}
        >
          Your Account Has<br />Been Created!
        </h1>

        {/* Body text */}
        <p className="text-[14.5px] text-[#777] leading-relaxed mb-10 max-w-[320px] mx-auto">
          Congratulations! Your Interflow account is ready.
          Let's set up your profile so you can start connecting.
        </p>

        {/* Setup Portfolio button */}
        <button
          onClick={handleSetup}
          className="inline-flex items-center justify-center gap-3 font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: GOLD,
            color: '#fff',
            borderRadius: 9999,
            height: 52,
            paddingLeft: 32,
            paddingRight: 16,
            fontSize: 15,
            fontFamily: 'Montserrat, sans-serif',
            minWidth: 220,
          }}
          onMouseEnter={e => e.currentTarget.style.background = GOLD_DARK}
          onMouseLeave={e => e.currentTarget.style.background = GOLD}
        >
          Setup Portfolio
          <span
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.22)' }}
          >
            <ArrowRight size={16} color="#fff" />
          </span>
        </button>

      </div>
    </AuthSplitLayout>
  );
};

export default AccountCreatedPage;
