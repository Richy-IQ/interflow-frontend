import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistAPI, connectionsAPI } from '../services/api';
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

const STEPS = [
  { num: 1, label: 'Personal Details' },
  { num: 2, label: 'Proficiency Scale' },
  { num: 3, label: 'Customize Portfolio' },
  { num: 4, label: 'Previous Experience' },
  { num: 5, label: 'Make Connections' },
];

const DISCIPLINES = [
  { value: 'poet_spoken_word', label: 'Poet / Spoken Word Artist' },
  { value: 'dancer', label: 'Dancer' },
  { value: 'musician', label: 'Musician' },
  { value: 'singer_vocalist', label: 'Singer / Vocalist' },
  { value: 'theatre_performer', label: 'Theatre Performer / Actor' },
  { value: 'performance_artist', label: 'Performance Artist' },
  { value: 'storyteller', label: 'Storyteller' },
  { value: 'multidisciplinary', label: 'Multidisciplinary Performer' },
];
const CAREER_STAGES = ['student','emerging','early_career','mid_career','established','independent'];
const PRONOUNS = ['he_him','she_her','they_them','other'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const StepSidebar = ({ current }) => (
  <div className="onboard-sidebar">
    <div className="onboard-sidebar-logo"><Logo /></div>
    <div className="onboard-steps">
      {STEPS.map(s => (
        <div key={s.num} className={`onboard-step ${s.num === current ? 'active' : s.num < current ? 'done' : ''}`}>
          <div className="onboard-step-num">{s.num < current ? '✓' : s.num}</div>
          <div className="onboard-step-info">
            <div className="onboard-step-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Step1 = ({ onNext }) => {
  const [form, setForm] = useState({ first_name:'', last_name:'', country:'', city:'', willing_to_travel:false, pronoun:'', professional_role:'', job_title:'', career_stage:'', primary_discipline:'', current_focus:'', bio:'' });
  const [disciplineOptions, setDisciplineOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target ? e.target.value : e }));

  useEffect(() => {
    if (form.primary_discipline) {
      artistAPI.getDisciplineOptions(form.primary_discipline).then(r => setDisciplineOptions(r.data.data)).catch(() => {});
    }
  }, [form.primary_discipline]);

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name) { toast.error('Name is required'); return; }
    setLoading(true);
    try { await artistAPI.step1(form); toast.success('Details saved!'); onNext({ discipline: form.primary_discipline, disciplineOptions }); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed to save'); }
    finally { setLoading(false); }
  };

  return (
    <div className="onboard-form-section">
      <h2 className="onboard-title">Welcome, Get Started with Your Portfolio</h2>
      <p className="onboard-sub">Start by providing key details about yourself to build a strong and incredible portfolio</p>
      <div className="onboard-field-grid">
        <div className="form-group"><label className="form-label">First Name *</label><input className="form-input" placeholder="First" value={form.first_name} onChange={set('first_name')} /></div>
        <div className="form-group"><label className="form-label">Last Name *</label><input className="form-input" placeholder="Last" value={form.last_name} onChange={set('last_name')} /></div>
        <div className="form-group"><label className="form-label">Country</label><input className="form-input" placeholder="e.g. Nigeria" value={form.country} onChange={set('country')} /></div>
        <div className="form-group"><label className="form-label">City</label><input className="form-input" placeholder="e.g. Lagos" value={form.city} onChange={set('city')} /></div>
        <div className="form-group">
          <label className="form-label">Primary Discipline</label>
          <select className="form-input form-select" value={form.primary_discipline} onChange={set('primary_discipline')}>
            <option value="">Select discipline</option>
            {DISCIPLINES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Career Stage</label>
          <select className="form-input form-select" value={form.career_stage} onChange={set('career_stage')}>
            <option value="">Select stage</option>
            {CAREER_STAGES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Pronoun</label>
          <select className="form-input form-select" value={form.pronoun} onChange={set('pronoun')}>
            <option value="">Select</option>
            {PRONOUNS.map(p => <option key={p} value={p}>{p.replace('_','/')}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Job Title</label><input className="form-input" placeholder="e.g. Contemporary Dancer" value={form.job_title} onChange={set('job_title')} /></div>
        {disciplineOptions && (
          <div className="form-group">
            <label className="form-label">Professional Role</label>
            <select className="form-input form-select" value={form.professional_role} onChange={set('professional_role')}>
              <option value="">Select role</option>
              {disciplineOptions.roles?.map(r => <option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}
            </select>
          </div>
        )}
        <div className="form-group" style={{ gridColumn:'1/-1' }}>
          <label className="form-label">Bio</label>
          <textarea className="form-input" rows="3" placeholder="Tell us about yourself..." value={form.bio} onChange={set('bio')} style={{ resize:'vertical' }} />
        </div>
        <div className="form-group" style={{ gridColumn:'1/-1' }}>
          <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', fontSize:'14px', color:'var(--text-secondary)' }}>
            <input type="checkbox" checked={form.willing_to_travel} onChange={e => setForm(f=>({...f,willing_to_travel:e.target.checked}))} style={{ accentColor:'var(--gold)' }} />
            Willing to travel
          </label>
        </div>
      </div>
      <div className="onboard-actions">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? <span className="spinner"/> : 'Next →'}</button>
      </div>
    </div>
  );
};

const Step2 = ({ onNext, onBack }) => {
  const skills = ['Drums','Dance','Performance','Vocals','Songwriting','Choreography','Stage Presence'];
  const [ratings, setRatings] = useState(() => Object.fromEntries(skills.map(s=>[s,3])));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await artistAPI.step2({ ratings: Object.fromEntries(Object.entries(ratings).map(([k,v])=>[k.toLowerCase().replace(' ','_'),v])) });
      toast.success('Proficiency saved!'); onNext();
    } catch { toast.error('Failed to save'); } finally { setLoading(false); }
  };

  return (
    <div className="onboard-form-section">
      <h2 className="onboard-title">What is your professional proficiency in these areas?</h2>
      <p className="onboard-sub">On the scale below, number one indicates an amateur level while five indicates that you offer this skill at the highest professional level</p>
      <div className="proficiency-list">
        {Object.entries(ratings).map(([skill, rating]) => (
          <div key={skill} className="proficiency-row">
            <div className="proficiency-label">{skill}</div>
            <div className="proficiency-stars">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`proficiency-star ${n<=rating?'active':''}`} onClick={()=>setRatings(r=>({...r,[skill]:n}))}>{n}</button>
              ))}
            </div>
          </div>
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
  const [uploading, setUploading] = useState(null);
  const mediaTypes = [
    { key:'video', label:'+ Add videos', icon:'🎬', accept:'video/*' },
    { key:'photo', label:'+ Add Pictures', icon:'🖼', accept:'image/*' },
    { key:'audio', label:'+ Add Audio files', icon:'🎵', accept:'audio/*' },
    { key:'project', label:'+ Add Projects', icon:'📁', accept:'*/*' },
  ];

  const handleUpload = async (e, mediaType) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(mediaType);
    const fd = new FormData(); fd.append('file',file); fd.append('media_type',mediaType); fd.append('title',file.name);
    try { await artistAPI.uploadMedia(fd); toast.success(`${mediaType} uploaded!`); }
    catch { toast.error('Upload failed'); } finally { setUploading(null); }
  };

  return (
    <div className="onboard-form-section">
      <h2 className="onboard-title">Customize your Profile.</h2>
      <p className="onboard-sub">Go ahead and add your favourite profile photo and showcase media. You'll be able to crop it to fit perfectly on your profile page</p>
      <div className="media-section">
        <div className="media-section-label">📸 Upload Photo</div>
        <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'16px' }}>Add your profile photos here. You'll be able to crop it to fit perfectly on your profile page</p>
        <div className="media-upload-grid">
          {mediaTypes.map(m => (
            <label key={m.key} className="media-upload-card">
              <input type="file" accept={m.accept} style={{ display:'none' }} onChange={e=>handleUpload(e,m.key)} />
              <div className="media-upload-icon">{uploading===m.key ? '⏳' : m.icon}</div>
              <div className="media-upload-label">{uploading===m.key ? 'Uploading...' : m.label}</div>
            </label>
          ))}
        </div>
      </div>
      <div className="onboard-actions">
        <button className="btn btn-outline" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>Next →</button>
        <button className="btn btn-ghost" style={{ color:'var(--text-muted)' }} onClick={onNext}>Help</button>
      </div>
    </div>
  );
};

const Step4 = ({ onNext, onBack }) => {
  const [expType, setExpType] = useState('career');
  const [form, setForm] = useState({ organization:'', role_title:'', production:'', is_current:false, degree_or_program:'', field_of_study:'', start_month:'', start_year:'', end_month:'', end_year:'' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState([]);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const handleSave = async () => {
    setLoading(true);
    try {
      await artistAPI.addExperience({ experience_type:expType, ...form });
      toast.success('Experience added!');
      setSaved(s=>[...s, form]);
      setForm({ organization:'',role_title:'',production:'',is_current:false,degree_or_program:'',field_of_study:'',start_month:'',start_year:'',end_month:'',end_year:'' });
    } catch { toast.error('Failed to save'); } finally { setLoading(false); }
  };

  return (
    <div className="onboard-form-section">
      <h2 className="onboard-title">Where have you previously worked and learned?</h2>
      <p className="onboard-sub">Input previous educational institutions, sessions and artist and training programs and discuss where you performed</p>
      <div className="exp-type-tabs">
        <label className="exp-tab-label"><input type="radio" name="expType" checked={expType==='career'} onChange={()=>setExpType('career')} style={{accentColor:'var(--gold)'}} /> Career Highlights</label>
        <label className="exp-tab-label"><input type="radio" name="expType" checked={expType==='education'} onChange={()=>setExpType('education')} style={{accentColor:'var(--gold)'}} /> Education</label>
      </div>
      <div className="onboard-field-grid">
        {expType==='career' ? <>
          <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Organization Name</label><input className="form-input" placeholder="Enter text here" value={form.organization} onChange={set('organization')} /></div>
          <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Role, Title, Position or Program Name</label><input className="form-input" placeholder="Enter text here" value={form.role_title} onChange={set('role_title')} /></div>
          <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Production, Show or Work</label><input className="form-input" placeholder="Enter text here" value={form.production} onChange={set('production')} /></div>
          <div className="form-group" style={{gridColumn:'1/-1'}}>
            <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',fontSize:'14px',color:'var(--text-secondary)'}}>
              <input type="checkbox" checked={form.is_current} onChange={e=>setForm(f=>({...f,is_current:e.target.checked}))} style={{accentColor:'var(--gold)'}} />
              I am currently affiliated with this organization
            </label>
          </div>
        </> : <>
          <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Degree or Program</label><input className="form-input" placeholder="e.g. Bachelor of Arts" value={form.degree_or_program} onChange={set('degree_or_program')} /></div>
          <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Field of Study</label><input className="form-input" placeholder="e.g. Performing Arts" value={form.field_of_study} onChange={set('field_of_study')} /></div>
        </>}
        <div className="form-group"><label className="form-label">Start Month</label><select className="form-input form-select" value={form.start_month} onChange={set('start_month')}><option value="">Select</option>{MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select></div>
        <div className="form-group"><label className="form-label">Start Year</label><select className="form-input form-select" value={form.start_year} onChange={set('start_year')}><option value="">Select</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
        {!form.is_current && <>
          <div className="form-group"><label className="form-label">End Month</label><select className="form-input form-select" value={form.end_month} onChange={set('end_month')}><option value="">Select</option>{MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select></div>
          <div className="form-group"><label className="form-label">End Year</label><select className="form-input form-select" value={form.end_year} onChange={set('end_year')}><option value="">Select</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
        </>}
      </div>
      {saved.length > 0 && <div className="exp-saved-list">{saved.map((s,i)=><div key={i} className="exp-saved-item">✓ {s.organization||s.degree_or_program}</div>)}</div>}
      <div className="onboard-actions">
        <button className="btn btn-outline" onClick={onBack}>← Back</button>
        <button className="btn btn-outline" onClick={handleSave} disabled={loading}>{loading?<span className="spinner"/>:'+ Add'}</button>
        <button className="btn btn-primary" onClick={onNext}>Next →</button>
        <button className="btn btn-ghost" style={{color:'var(--text-muted)'}} onClick={onNext}>Skip</button>
      </div>
    </div>
  );
};

const Step5 = ({ onFinish, onBack }) => {
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    connectionsAPI.discover().then(r=>setUsers(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const handleConnect = async (id) => {
    try { await connectionsAPI.send({ receiver_id:id }); setConnected(s=>new Set([...s,id])); toast.success('Request sent!'); }
    catch { toast.error('Could not send request'); }
  };

  const handleFinish = async () => {
    try { await artistAPI.completeOnboarding(); } catch {}
    onFinish();
  };

  return (
    <div className="onboard-form-section">
      <h2 className="onboard-title">Great! Let's start building your network</h2>
      <p className="onboard-sub">Connect with artists and organizations to grow your creative community</p>
      {loading ? <div style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>Loading suggestions...</div> : (
        <div className="connections-grid">
          {users.slice(0,6).map(u => {
            const name = u.display_name||u.email; const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
            return (
              <div key={u.id} className="connection-card">
                <div className="connection-avatar">{initials}</div>
                <div className="connection-name">{name}</div>
                <div className="connection-role">{u.role}</div>
                <button className={`btn btn-sm ${connected.has(u.id)?'btn-outline':'btn-primary'}`} onClick={()=>!connected.has(u.id)&&handleConnect(u.id)} disabled={connected.has(u.id)}>
                  {connected.has(u.id)?'✓ Sent':'+ Connect'}
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="onboard-actions">
        <button className="btn btn-outline" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={handleFinish}>Finish →</button>
        <button className="btn btn-ghost" style={{color:'var(--text-muted)'}} onClick={handleFinish}>Skip</button>
      </div>
    </div>
  );
};

const ArtistOnboarding = () => {
  const [step, setStep] = useState(1);
  const [stepData, setStepData] = useState({});
  const navigate = useNavigate();
  const next = (data={}) => { setStepData(s=>({...s,...data})); setStep(s=>s+1); };
  const back = () => setStep(s=>s-1);
  const finish = () => navigate('/dashboard');

  return (
    <div className="onboard-page">
      <StepSidebar current={step} />
      <div className="onboard-main">
        <div className="onboard-card">
          {step===1 && <Step1 onNext={next} />}
          {step===2 && <Step2 onNext={next} onBack={back} />}
          {step===3 && <Step3 onNext={next} onBack={back} />}
          {step===4 && <Step4 onNext={next} onBack={back} />}
          {step===5 && <Step5 onFinish={finish} onBack={back} />}
        </div>
      </div>
    </div>
  );
};

export default ArtistOnboarding;
