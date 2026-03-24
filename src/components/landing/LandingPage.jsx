import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Landing.css';

// ─── Interflow Logo SVG ───────────────────────────────────────────
const Logo = ({ white = false }) => (
  <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6 C8 6 14 2 18 8 C22 14 16 20 20 24 C24 28 28 26 28 26" stroke={white ? '#8B6914' : '#8B6914'} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M4 14 C4 14 10 10 14 16 C18 22 12 26 16 30" stroke={white ? '#A07C1E' : '#A07C1E'} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <text x="36" y="24" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="20" fontWeight="700" fill={white ? '#FFFFFF' : '#1A1A1A'}>Interflow</text>
    <text x="36" y="34" fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="400" fill={white ? 'rgba(255,255,255,0.5)' : '#888888'} letterSpacing="0.15em">ARTIST'S EXCHANGE</text>
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-logo">
          <Logo white />
        </div>
        <div className="nav-links">
          <a href="#about">Artists</a>
          <a href="#features">Organizations</a>
          <a href="#stats">Resources</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="nav-signin">Sign In</Link>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>
            Get Started →
          </button>
        </div>
      </div>
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-bg-grid" />
      <div className="hero-bg-glow" />
      <div className="hero-bg-glow2" />
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Africa's Creative Industry Platform
            </div>
            <h1 className="hero-title">
              Empowering Artists<br />
              <span>Connecting</span><br />
              Opportunities
            </h1>
            <p className="hero-subtitle">
              Build your artist portfolio, connect with opportunities and organize events. 
              The platform built for Africa's creative economy.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                Get Started →
              </button>
              <button className="btn btn-ghost btn-lg" style={{ color: 'rgba(255,255,255,0.7)' }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">$2T+</div>
                <div className="hero-stat-label">ETF Creative Economy</div>
              </div>
              <div>
                <div className="hero-stat-value">20%</div>
                <div className="hero-stat-label">Creative Employers</div>
              </div>
              <div>
                <div className="hero-stat-value">48%</div>
                <div className="hero-stat-label">Untapped Opportunities</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-collage">
              <div className="hero-img">
                <div className="hero-img-placeholder" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
                  <span style={{ fontSize: '80px', opacity: 0.3 }}>🎭</span>
                </div>
              </div>
              <div className="hero-img">
                <div className="hero-img-placeholder" style={{ background: 'linear-gradient(135deg, #2a1a00 0%, #3a2a00 100%)' }}>
                  <span style={{ fontSize: '60px', opacity: 0.3 }}>🎵</span>
                </div>
              </div>
              <div className="hero-img">
                <div className="hero-img-placeholder" style={{ background: 'linear-gradient(135deg, #001a2a 0%, #002a3a 100%)' }}>
                  <span style={{ fontSize: '60px', opacity: 0.3 }}>💃</span>
                </div>
              </div>
            </div>
            <div className="hero-badge">
              <div className="hero-badge-icon">🎨</div>
              <div>
                <div className="hero-badge-text">Join 10,000+ Creatives</div>
                <div className="hero-badge-sub">Already on Interflow</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── About Section ────────────────────────────────────────────────
const About = () => (
  <section className="about-section" id="about">
    <div className="container">
      <div className="about-inner">
        <div className="about-visual">
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>🎬</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>Interflow Platform</div>
            </div>
          </div>
          <div className="about-visual-overlay" />
          <div className="about-visual-badge">
            <span style={{ fontSize: '24px' }}>🏆</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--dark)' }}>Africa's #1</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Creative Platform</div>
            </div>
          </div>
        </div>

        <div className="about-text">
          <span className="section-eyebrow">About Interflow</span>
          <h2 className="section-title">
            The Platform Built<br />
            for <span>Creatives</span>
          </h2>
          <p className="section-body">
            Interflow is where Africa's creative industry comes alive. We connect performing artists, 
            musicians, dancers, and vocalists with organizations, studios, and life-changing opportunities.
          </p>
          <div className="about-features">
            {[
              { icon: '🎭', title: 'Showcase Your Portfolio', desc: 'Build a professional portfolio that highlights your talent and journey' },
              { icon: '🔍', title: 'Discover Opportunities', desc: 'Find auditions, jobs, and collaborations tailored to your discipline' },
              { icon: '🤝', title: 'Build Your Network', desc: 'Connect with artists, organizations, and industry professionals' },
            ].map((f, i) => (
              <div className="about-feature" key={i}>
                <div className="about-feature-icon">{f.icon}</div>
                <div className="about-feature-text">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => window.location.href = '/register'}>
            Start Your Journey →
          </button>
        </div>
      </div>
    </div>
  </section>
);

// ─── Features Section ─────────────────────────────────────────────
const Features = () => (
  <section className="features-section" id="features">
    <div className="container">
      <div className="features-header">
        <span className="section-eyebrow">What We Offer</span>
        <h2 className="section-title" style={{ color: 'var(--white)' }}>
          Kickstart your Experience<br />
          <span>with Interflow</span>
        </h2>
        <p className="section-body" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Everything a creative professional needs to thrive in Africa's growing creative economy
        </p>
      </div>

      <div className="features-grid">
        {[
          {
            icon: '🏅',
            title: 'Showcase your Achievements',
            desc: 'Build a stunning portfolio that tells your story. Upload photos, videos, audio, and creative projects that represent your best work.',
            link: 'Build your portfolio',
          },
          {
            icon: '🌍',
            title: 'Discover and Apply for Global Opportunities',
            desc: 'Browse auditions, jobs, collaborations, and residencies from verified organizations across Africa and beyond.',
            link: 'Browse opportunities',
          },
          {
            icon: '⚡',
            title: 'Built for Creatives Worldwide',
            desc: 'From dancers to musicians, vocalists to theatre performers — Interflow is designed for every discipline in the performing arts.',
            link: 'Explore disciplines',
          },
        ].map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <div className="feature-link">{f.link} →</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Stats Section ────────────────────────────────────────────────
const Stats = () => (
  <section className="stats-section" id="stats">
    <div className="container">
      <div className="stats-inner">
        <div className="stats-person">
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #1a1200 0%, #2a1e00 40%, #3d2b00 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '100px' }}>👤</div>
            </div>
          </div>
        </div>
        <div className="stats-content">
          <span className="section-eyebrow">Why Interflow Matters</span>
          <h2 className="section-title">
            A $2 Trillion Industry<br />
            <span>Waiting to be Tapped</span>
          </h2>
          <p className="section-body">
            Africa's creative economy is one of the fastest growing sectors in the world. 
            Interflow exists to ensure African artists get their fair share.
          </p>
          <div className="stats-grid">
            {[
              { value: '$2T+', label: 'ETF Creative Economy', color: 'var(--gold)' },
              { value: '20%', label: 'of Creative Employers actively seeking talent', color: 'var(--success)' },
              { value: '$13B+', label: 'Global Untapped Revenue in performing arts', color: 'var(--info)' },
              { value: '48%', label: 'of Loose Opportunities go unfilled', color: '#8B5CF6' },
            ].map((s, i) => (
              <div className="stat-box" key={i}>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── CTA Section ──────────────────────────────────────────────────
const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="cta-section">
      <div className="cta-bg" />
      <div className="container">
        <div className="cta-content">
          <span className="section-eyebrow">Join Interflow Today</span>
          <h2 className="cta-title">Ready to Transform Your Creative Career?</h2>
          <p className="cta-subtitle">
            Join thousands of artists and organizations already using Interflow to connect, 
            discover, and grow.
          </p>
          <div className="cta-role-cards">
            <div className="cta-role-card" onClick={() => navigate('/register?role=artist')}>
              <div className="cta-role-icon">🎤</div>
              <h4>As an Artist</h4>
              <p>Build your personalized portfolio and find your next best opportunity with Interflow</p>
              <div style={{ marginTop: '16px', color: 'var(--gold)', fontSize: '14px', fontWeight: '500' }}>
                Continue →
              </div>
            </div>
            <div className="cta-role-card" onClick={() => navigate('/register?role=organization')}>
              <div className="cta-role-icon">🏢</div>
              <h4>As an Organization</h4>
              <p>Post opportunities, scout talent, and manage your creative projects efficiently</p>
              <div style={{ marginTop: '16px', color: 'var(--gold)', fontSize: '14px', fontWeight: '500' }}>
                Continue →
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────
const Footer = () => (
  <footer className="landing-footer">
    <div className="container">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Interflow</h3>
          <p>Empowering Africa's creative community to connect, grow, and thrive through meaningful opportunities.</p>
          <div className="footer-socials">
            {['𝕏', 'in', '📷', '▶'].map((s, i) => (
              <div className="footer-social" key={i}>{s}</div>
            ))}
          </div>
        </div>
        <div className="footer-col">
          <h4>About Interflow</h4>
          <ul>
            {['About Us', 'How It Works', 'Careers', 'Blog', 'Press'].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            {['For Artists', 'For Organizations', 'Opportunities', 'Connections', 'Support'].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <h4>Social Links</h4>
          <ul>
            {['Twitter / X', 'Instagram', 'LinkedIn', 'YouTube', 'Facebook'].map(l => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Interflow. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Privacy Policy</a>
          <a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Terms of Service</a>
          <a href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

// ─── Main Landing Page ────────────────────────────────────────────
const LandingPage = () => (
  <div className="page-enter">
    <Navbar />
    <Hero />
    <About />
    <Features />
    <Stats />
    <CTA />
    <Footer />
  </div>
);

export default LandingPage;
