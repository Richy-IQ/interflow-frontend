import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artistAPI } from '../services/api';

const PublicPortfolioPage = () => {
  const { token } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    artistAPI.getPublicPortfolio(token).then(r => setProfile(r.data.data)).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(139,105,20,0.2)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '48px' }}>🔍</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--white)' }}>Portfolio Not Found</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>This portfolio link may be invalid or expired.</p>
      <Link to="/" className="btn btn-primary">Go to Interflow →</Link>
    </div>
  );

  const name = `${profile.first_name} ${profile.last_name}`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
      {/* Header */}
      <div style={{ background: 'var(--dark)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--white)', fontWeight: '700' }}>Interflow</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Join Interflow →</Link>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '800px' }}>
        {/* Profile Card */}
        <div className="section-card" style={{ marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ height: '140px', background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-3) 100%)' }} />
          <div style={{ padding: '0 28px 28px' }}>
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'var(--gold)', border: '4px solid white', marginTop: '-42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '700', color: 'white', overflow: 'hidden' }}>
              {profile.avatar ? <img src={profile.avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', marginTop: '12px', marginBottom: '4px' }}>{name}</h1>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>{profile.job_title} · {profile.city}{profile.country ? `, ${profile.country}` : ''}</p>
            {profile.instruments?.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {profile.instruments.map(i => <span key={i} className="badge badge-gold">{i}</span>)}
              </div>
            )}
            {profile.bio && <p style={{ marginTop: '16px', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>{profile.bio}</p>}
          </div>
        </div>

        {/* Media Grid */}
        {profile.media?.length > 0 && (
          <div className="section-card" style={{ marginBottom: '20px' }}>
            <div className="section-card-header"><span className="section-card-title">Portfolio Media</span></div>
            <div className="section-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: '12px' }}>
                {profile.media.map(m => (
                  <div key={m.id} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '1', background: 'var(--grey-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {m.media_type === 'photo' ? <img src={m.file} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '32px' }}>{m.media_type==='video'?'🎬':m.media_type==='audio'?'🎵':'📁'}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {profile.experiences?.length > 0 && (
          <div className="section-card" style={{ marginBottom: '20px' }}>
            <div className="section-card-header"><span className="section-card-title">Career & Education</span></div>
            <div className="section-card-body">
              {profile.experiences.map(exp => (
                <div key={exp.id} style={{ display: 'flex', gap: '14px', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{exp.experience_type==='career'?'🎭':'🎓'}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--dark)' }}>{exp.role_title || exp.degree_or_program}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{exp.organization || exp.field_of_study} · {exp.start_year}{exp.is_current?' – Present':exp.end_year?` – ${exp.end_year}`:''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ background: 'var(--dark)', borderRadius: 'var(--radius-xl)', padding: '36px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--white)', marginBottom: '12px' }}>Connect with {profile.first_name} on Interflow</h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Join the platform connecting Africa's creative community</p>
          <Link to="/register" className="btn btn-primary btn-lg">Join Interflow for Free →</Link>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolioPage;
