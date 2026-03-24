import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orgAPI } from '../services/api';
import toast from 'react-hot-toast';
import '../components/onboarding/Onboarding.css';

const Logo = () => (
  <svg width="110" height="32" viewBox="0 0 120 36" fill="none">
    <path d="M8 6 C8 6 14 2 18 8 C22 14 16 20 20 24 C24 28 28 26 28 26" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M4 14 C4 14 10 10 14 16 C18 22 12 26 16 30" stroke="#A07C1E" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <text x="36" y="24" fontFamily="Cormorant Garamond,serif" fontSize="20" fontWeight="700" fill="#FFFFFF">Interflow</text>
    <text x="36" y="33" fontFamily="DM Sans,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.4)" letterSpacing="0.15em">ARTIST'S EXCHANGE</text>
  </svg>
);

const ORG_STEPS = [
  { num:1, label:'Organization Info' },
  { num:2, label:'Your Goals' },
  { num:3, label:'Verification' },
  { num:4, label:'Verification Status' },
];

const GOALS = [
  { value:'manage_profile', label:'Manage your company profile' },
  { value:'post_jobs', label:'Post jobs, auditions and opportunities' },
  { value:'create_applications', label:'Create applications with Interflow' },
  { value:'scout_talent', label:'Search and scout for talents' },
];

const StepSidebar = ({ current }) => (
  <div className="onboard-sidebar">
    <div className="onboard-sidebar-logo"><Logo /></div>
    <div className="onboard-steps">
      {ORG_STEPS.map(s => (
        <div key={s.num} className={`onboard-step ${s.num===current?'active':s.num<current?'done':''}`}>
          <div className="onboard-step-num">{s.num<current?'✓':s.num}</div>
          <div className="onboard-step-label">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const Step1 = ({ onNext }) => {
  const [form, setForm] = useState({ organization_name:'', industry:'', city:'', province:'', phone_number:'', business_address:'', website:'' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const handleSubmit = async () => {
    if (!form.organization_name) { toast.error('Organization name is required'); return; }
    setLoading(true);
    try { await orgAPI.step1(form); toast.success('Info saved!'); onNext(); }
    catch(e) { toast.error(e.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="onboard-form-section">
      <h2 className="onboard-title">Tell us about your Organization</h2>
      <p className="onboard-sub">Provide your organization details to set up your Interflow profile</p>
      <div className="onboard-field-grid">
        <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Organization Name *</label><input className="form-input" placeholder="e.g. Lagos Arts Council" value={form.organization_name} onChange={set('organization_name')} /></div>
        <div className="form-group"><label className="form-label">Industry</label><input className="form-input" placeholder="e.g. Arts Education" value={form.industry} onChange={set('industry')} /></div>
        <div className="form-group"><label className="form-label">City</label><input className="form-input" placeholder="City" value={form.city} onChange={set('city')} /></div>
        <div className="form-group"><label className="form-label">Province / State</label><input className="form-input" placeholder="Province" value={form.province} onChange={set('province')} /></div>
        <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" placeholder="+234..." value={form.phone_number} onChange={set('phone_number')} /></div>
        <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Business Address</label><textarea className="form-input" rows="2" placeholder="Full address" value={form.business_address} onChange={set('business_address')} style={{resize:'vertical'}} /></div>
        <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Website <span style={{color:'var(--text-muted)',fontSize:'12px'}}>(optional)</span></label><input className="form-input" placeholder="https://..." value={form.website} onChange={set('website')} /></div>
      </div>
      <div className="onboard-actions">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading?<span className="spinner"/>:'Next →'}</button>
      </div>
    </div>
  );
};

const Step2 = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = v => setSelected(s => s.includes(v) ? s.filter(x=>x!==v) : [...s,v]);

  const handleSubmit = async () => {
    if (!selected.length) { toast.error('Select at least one goal'); return; }
    setLoading(true);
    try { await orgAPI.step2({ goals: selected }); toast.success('Goals saved!'); onNext(); }
    catch { toast.error('Failed to save'); } finally { setLoading(false); }
  };

  return (
    <div className="onboard-form-section">
      <h2 className="onboard-title">What do you want to do with Interflow?</h2>
      <p className="onboard-sub">Select all that apply to your organization</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'32px' }}>
        {GOALS.map((g,i) => (
          <label key={g.value} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px 20px', border:`2px solid ${selected.includes(g.value)?'var(--gold)':'var(--border)'}`, borderRadius:'var(--radius-md)', cursor:'pointer', background:selected.includes(g.value)?'var(--gold-pale)':'var(--white)', transition:'all var(--transition)' }}>
            <input type="checkbox" checked={selected.includes(g.value)} onChange={()=>toggle(g.value)} style={{accentColor:'var(--gold)',width:'18px',height:'18px'}} />
            <span style={{fontSize:'14px',fontWeight:'500',color:'var(--dark)'}}>{i+1}. {g.label}</span>
          </label>
        ))}
      </div>
      <div className="onboard-actions">
        <button className="btn btn-outline" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading?<span className="spinner"/>:'Next →'}</button>
      </div>
    </div>
  );
};

const Step3 = ({ onNext, onBack }) => {
  const [form, setForm] = useState({ business_email:'', social_media_link:'' });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const handleSubmit = async () => {
    if (!form.business_email || !form.social_media_link) { toast.error('Business email and social link are required'); return; }
    setLoading(true);
    const fd = new FormData();
    fd.append('business_email', form.business_email);
    fd.append('social_media_link', form.social_media_link);
    if (logo) fd.append('logo', logo);
    try { await orgAPI.step3(fd); toast.success('Verification submitted!'); onNext(); }
    catch(e) { toast.error(e.response?.data?.message || 'Submission failed'); } finally { setLoading(false); }
  };

  return (
    <div className="onboard-form-section">
      <h2 className="onboard-title">Organization Verification</h2>
      <p className="onboard-sub">Help us verify your organization to ensure a safe platform for all artists</p>
      <div className="onboard-field-grid">
        <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Business Email *</label><input className="form-input" type="email" placeholder="official@organization.com" value={form.business_email} onChange={set('business_email')} /></div>
        <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Active Social Media Link *</label><input className="form-input" placeholder="https://instagram.com/yourorg" value={form.social_media_link} onChange={set('social_media_link')} /></div>
        <div className="form-group" style={{gridColumn:'1/-1'}}>
          <label className="form-label">Organization Logo</label>
          <label className="media-upload-card" style={{flexDirection:'row',gap:'14px',justifyContent:'flex-start',padding:'16px'}}>
            <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>setLogo(e.target.files[0])} />
            <div style={{fontSize:'24px'}}>🏢</div>
            <div style={{fontSize:'13px',color:'var(--text-muted)'}}>{logo ? logo.name : 'Upload organization logo (JPG, PNG, SVG — max 5MB)'}</div>
          </label>
        </div>
      </div>
      <div className="onboard-actions">
        <button className="btn btn-outline" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading?<span className="spinner"/>:'Submit for Verification →'}</button>
      </div>
    </div>
  );
};

const Step4 = ({ onFinish }) => (
  <div className="onboard-form-section" style={{textAlign:'center'}}>
    <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'var(--gold-pale)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'36px',margin:'0 auto 24px'}}>⏳</div>
    <h2 className="onboard-title">Verification Status</h2>
    <p className="onboard-sub">Your organization is under review. This typically takes 1–3 business days. We'll notify you by email once verified.</p>
    <div style={{background:'var(--grey-1)',borderRadius:'var(--radius-lg)',padding:'20px',marginBottom:'32px',textAlign:'left'}}>
      <div style={{fontSize:'14px',fontWeight:'600',color:'var(--dark)',marginBottom:'8px'}}>While you wait, you can:</div>
      {['Complete your company profile','Browse the platform','Prepare your first opportunity posting'].map((item,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',fontSize:'14px',color:'var(--text-secondary)',borderBottom:i<2?'1px solid var(--border)':'none'}}>
          <span style={{color:'var(--gold)'}}>→</span>{item}
        </div>
      ))}
    </div>
    <button className="btn btn-primary btn-lg" onClick={onFinish}>Go to Dashboard →</button>
  </div>
);

const OrgOnboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const next = () => setStep(s=>s+1);
  const back = () => setStep(s=>s-1);
  const finish = async () => { try { await orgAPI.completeOnboarding(); } catch {} navigate('/org/dashboard'); };

  return (
    <div className="onboard-page">
      <StepSidebar current={step} />
      <div className="onboard-main">
        <div className="onboard-card">
          {step===1 && <Step1 onNext={next} />}
          {step===2 && <Step2 onNext={next} onBack={back} />}
          {step===3 && <Step3 onNext={next} onBack={back} />}
          {step===4 && <Step4 onFinish={finish} />}
        </div>
      </div>
    </div>
  );
};

export default OrgOnboarding;
