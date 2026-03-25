import React from 'react';

const Logo = ({ variant = 'default', size = 'md', className = '' }) => {
  const textColor   = variant === 'white' ? '#FFFFFF' : '#1A1A1A';
  const subColor    = variant === 'white' ? 'rgba(255,255,255,0.45)' : '#AAAAAA';

  const dims = { sm: [110, 34], md: [130, 40], lg: [156, 48] }[size] || [130, 40];

  return (
    <svg
      className={className}
      width={dims[0]}
      height={dims[1]}
      viewBox="0 0 130 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Dancer figure ── */}
      <g>
        {/* Head */}
        <circle cx="17.5" cy="4" r="2.8" fill="#1A6DC8" />
        {/* Torso */}
        <path d="M17.5 6.8 C16 10 13 13 12 17" stroke="#1A6DC8" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
        {/* Left arm (raised back) */}
        <path d="M15.5 10.5 C11 7.5 7 5.5 4.5 7" stroke="#1A6DC8" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Right arm (forward) */}
        <path d="M17 10 C20 8 23.5 7 26 8.5" stroke="#1A6DC8" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Left leg (back kick) */}
        <path d="M12 17 C9.5 20.5 8 24 5.5 26.5" stroke="#1A6DC8" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Right leg (forward step) */}
        <path d="M12 17 C14.5 21 17.5 24 20.5 26.5" stroke="#1A6DC8" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </g>

      {/* ── Wordmark ── */}
      <text
        x="33"
        y="23"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="19"
        fontWeight="700"
        fontStyle="italic"
        fill={textColor}
      >
        Interflow
      </text>
      <text
        x="34"
        y="34"
        fontFamily="DM Sans, sans-serif"
        fontSize="6.8"
        fill={subColor}
        letterSpacing="0.13em"
      >
        ARTIST&apos;S EXCHANGE
      </text>
    </svg>
  );
};

export default Logo;
