import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { ArrowRight, Image, Play, UserPlus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import FloatingInput from '@/components/common/FloatingInput';
import FloatingSelect from '@/components/common/FloatingSelect';
import { artistAPI, connectionsAPI } from '@/services/index';

/* ─── Shared button ── */
const GoldBtn = ({ children, onClick, disabled, type = 'button', outline = false, className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-[14px] font-semibold transition-all disabled:opacity-55 ${
      outline
        ? 'border-2 border-[#8B6914] text-[#8B6914] hover:bg-[#8B6914]/8 bg-white'
        : 'bg-[#8B6914] text-white hover:bg-[#7A5C12]'
    } ${className}`}
  >
    {children}
  </button>
);

const LOCATION_OPTIONS = [
  'Lagos, Nigeria','Abuja, Nigeria','Port Harcourt, Nigeria','Accra, Ghana',
  'Nairobi, Kenya','Cairo, Egypt','Johannesburg, South Africa','Douala, Cameroon',
].map(v => ({ value: v, label: v }));

const PRONOUN_OPTIONS = [
  { value: 'He/Him', label: 'He/Him' },
  { value: 'She/Her', label: 'She/Her' },
  { value: 'They/Them', label: 'They/Them' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
];

const DISCIPLINE_OPTIONS = [
  'Voice','Vocals','Guitar','Piano','Drums','Bass','Violin','Dance',
  'Ballet','Hip-hop','Afrobeats','Theatre','Acting','Directing','Choreography',
].map(v => ({ value: v.toLowerCase(), label: v }));

const ROLE_OPTIONS = [
  'Singer','Dancer','Musician','Actor','Director','Choreographer',
  'Performer','Composer','Songwriter','Producer',
].map(v => ({ value: v.toLowerCase(), label: v }));

const INDUSTRY_OPTIONS = [
  'Music','Film','Theatre','Dance','Visual Arts','Fashion',
  'Television','Radio','Digital Media','Event Production',
].map(v => ({ value: v.toLowerCase(), label: v }));

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December']
  .map((m,i) => ({ value: String(i+1).padStart(2,'0'), label: m }));

const YEARS = Array.from({ length: 40 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { value: String(y), label: String(y) };
});

/* ════════════════════════════════════════════════════════════════ */
/*  STEP 1 – Personal Details                                      */
/* ════════════════════════════════════════════════════════════════ */
const Step1 = ({ onNext }) => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', location: '', pronoun: '',
    instrument: '', professionalRole: '', jobTitle: '', industry: '', specialSkills: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = async () => {
    if (!form.firstName || !form.lastName) { toast.error('First and last name required'); return; }
    try {
      await artistAPI.step1({
        first_name: form.firstName, last_name: form.lastName,
        location: form.location, pronouns: form.pronoun,
        instrument_voice_type: form.instrument,
        professional_role: form.professionalRole,
        job_title: form.jobTitle,
        industry: form.industry,
        special_skills: form.specialSkills,
      });
      onNext();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save details');
    }
  };

  return (
    <>
      <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Welcome!, Get Started with Your Portfolio
      </h2>
      <p className="text-[13.5px] text-[#888] mb-8 leading-relaxed">
        Start by providing key details about yourself to build a strong and credible portfolio
      </p>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <FloatingInput label="First name*" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
          <FloatingInput label="Last name*"  value={form.lastName}  onChange={e => set('lastName',  e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FloatingSelect label="Location"         value={form.location} options={LOCATION_OPTIONS} onChange={e => set('location', e.target.value)} />
          <FloatingSelect label="Preferred pronoun" value={form.pronoun}  options={PRONOUN_OPTIONS}  onChange={e => set('pronoun',  e.target.value)} />
        </div>

        <p className="text-[14px] font-semibold text-[#1A1A1A] pt-1">What do you do in the Industry?</p>
        <FloatingSelect label="Instrument/ Voice Type" value={form.instrument}       options={DISCIPLINE_OPTIONS} onChange={e => set('instrument',       e.target.value)} />
        <FloatingSelect label="Professional Role"      value={form.professionalRole} options={ROLE_OPTIONS}       onChange={e => set('professionalRole', e.target.value)} />
        <FloatingSelect label="Job title"              value={form.jobTitle}         options={ROLE_OPTIONS}       onChange={e => set('jobTitle',         e.target.value)} />

        <p className="text-[14px] font-semibold text-[#1A1A1A] pt-1">What Industry do you work in most often?</p>
        <FloatingSelect label="Industries"     value={form.industry}      options={INDUSTRY_OPTIONS}  onChange={e => set('industry',      e.target.value)} />
        <FloatingSelect label="Special skills" value={form.specialSkills} options={DISCIPLINE_OPTIONS} onChange={e => set('specialSkills', e.target.value)} />

        <div className="flex justify-center pt-2">
          <GoldBtn onClick={handleNext}>Next <ArrowRight size={15} /></GoldBtn>
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════════════ */
/*  STEP 2 – Proficiency Scale                                     */
/* ════════════════════════════════════════════════════════════════ */
const RatingRow = ({ skill, value, onChange }) => (
  <div className="flex items-center gap-6">
    <div className="w-[120px] bg-[#F0EDE6] rounded-full px-4 py-2 text-[13.5px] font-medium text-[#5C4A1E] text-center shrink-0">
      {skill}
    </div>
    <div className="flex gap-3">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-10 h-10 rounded-full text-[14px] font-semibold border-2 transition-all ${
            value === n
              ? 'bg-[#8B6914] border-[#8B6914] text-white'
              : 'border-[#C8A870] text-[#C8A870] hover:border-[#8B6914] hover:text-[#8B6914]'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  </div>
);

const Step2 = ({ onNext }) => {
  const [skills, setSkills] = useState({ Drums: 0, Dance: 0, Performance: 0 });
  const set = (k, v) => setSkills(s => ({ ...s, [k]: v }));

  const handleNext = async () => {
    try {
      const payload = Object.entries(skills).map(([skill, level]) => ({ skill, level }));
      await artistAPI.step2({ proficiency: payload });
      onNext();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save proficiency');
    }
  };

  return (
    <>
      <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-1 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        What is your professional proficiency in these areas?
      </h2>
      <p className="text-[13.5px] text-[#888] mb-8 text-center leading-relaxed max-w-[520px] mx-auto">
        On the scale below, number one indicates an amateur skill level while five indicates that you offer the skill at the highest professional level.
      </p>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-10">
        <div className="space-y-6">
          {Object.entries(skills).map(([skill, val]) => (
            <RatingRow key={skill} skill={skill} value={val} onChange={v => set(skill, v)} />
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <GoldBtn onClick={handleNext}>Next <ArrowRight size={15} /></GoldBtn>
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════════════ */
/*  STEP 3 – Customize Portfolio                                   */
/* ════════════════════════════════════════════════════════════════ */
const UploadCard = ({ icon: Icon, title, desc, onDrop, preview }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });
  return (
    <div
      {...getRootProps()}
      className={`flex items-center gap-5 p-5 rounded-xl border-2 cursor-pointer transition-all ${
        isDragActive ? 'border-[#8B6914] bg-[#8B6914]/5' : 'border-[#E8E4DC] bg-[#FAFAF7] hover:border-[#8B6914]/40'
      }`}
    >
      <input {...getInputProps()} />
      <div className="w-[90px] h-[72px] rounded-xl bg-[#EBEBEB] flex items-center justify-center shrink-0 overflow-hidden">
        {preview
          ? <img src={preview} alt="" className="w-full h-full object-cover rounded-xl" />
          : <Icon size={28} strokeWidth={1.4} className="text-[#AAAAAA]" />
        }
      </div>
      <div>
        <p className="text-[14.5px] font-semibold text-[#1A1A1A]">{title}</p>
        <p className="text-[12.5px] text-[#888] leading-snug mt-0.5">{desc}</p>
      </div>
    </div>
  );
};

const Step3 = ({ onNext, onSkip }) => {
  const [avatar,  setAvatar]  = useState(null);
  const [avatarPrev, setAvatarPrev] = useState(null);
  const [media,   setMedia]   = useState(null);

  const onAvatarDrop  = useCallback(files => {
    if (files[0]) { setAvatar(files[0]); setAvatarPrev(URL.createObjectURL(files[0])); }
  }, []);
  const onMediaDrop = useCallback(files => { if (files[0]) setMedia(files[0]); }, []);

  const handleNext = async () => {
    try {
      if (avatar) {
        const fd = new FormData(); fd.append('avatar', avatar);
        await artistAPI.uploadAvatar(fd);
      }
      if (media) {
        const fd = new FormData(); fd.append('file', media);
        await artistAPI.uploadMedia(fd);
      }
      onNext();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <>
      <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Customize your Profile.
      </h2>
      <p className="text-[13.5px] text-[#888] mb-8 leading-relaxed">
        Make some design choices by customizing your profile to your preference.
      </p>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 space-y-4">
        <UploadCard
          icon={Image}
          title="Upload Photo"
          desc="Go ahead, add your favourite photo. You'll be able to crop it perfectly on your profile later."
          onDrop={onAvatarDrop}
          preview={avatarPrev}
        />
        <UploadCard
          icon={Play}
          title="Showcase Media"
          desc="Add video, audio, and creative projects to your profile here."
          onDrop={onMediaDrop}
        />

        <div className="flex items-center gap-4 pt-2">
          <GoldBtn onClick={handleNext} className="flex-1 justify-center">Next <ArrowRight size={15} /></GoldBtn>
          <GoldBtn onClick={onSkip} outline className="flex-1 justify-center">Skip</GoldBtn>
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════════════ */
/*  STEP 4 – Previous Experience                                   */
/* ════════════════════════════════════════════════════════════════ */
const Step4 = ({ onNext, onSkip }) => {
  const [type, setType]    = useState('career'); // 'career' | 'education'
  const [current, setCurrent] = useState(false);
  const [form, setForm]    = useState({
    org: '', role: '', production: '', degree: '', fieldOfStudy: '',
    startMonth: '', startYear: '', endMonth: '', endYear: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = async () => {
    try {
      const payload = {
        organization: form.org,
        type,
        is_current: current,
        start_month: form.startMonth,
        start_year:  form.startYear,
        end_month:   current ? '' : form.endMonth,
        end_year:    current ? '' : form.endYear,
        ...(type === 'career'
          ? { role_title: form.role, production_show: form.production }
          : { degree_program: form.degree, field_of_study: form.fieldOfStudy }),
      };
      await artistAPI.addExperience(payload);
      onNext();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save experience');
    }
  };

  const RadioBtn = ({ value, label }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
          type === value ? 'border-[#22C55E]' : 'border-[#CCCCCC]'
        }`}
        onClick={() => setType(value)}
      >
        {type === value && <div className="w-2 h-2 rounded-full bg-[#22C55E]" />}
      </div>
      <span className="text-[13.5px] font-medium text-[#333]">{label}</span>
    </label>
  );

  return (
    <>
      <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Where have you previously worked and learned?
      </h2>
      <p className="text-[13.5px] text-[#888] mb-8 text-center leading-relaxed max-w-[520px] mx-auto">
        Workplace, educational Institutions, resident and artist and training programs and houses where you performed.
      </p>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8 space-y-4">
        <FloatingInput
          label={type === 'career' ? 'Organization*' : 'Educational Institution*'}
          value={form.org}
          onChange={e => set('org', e.target.value)}
        />

        {/* Toggle */}
        <div className="flex items-center gap-8">
          <RadioBtn value="career"    label="Career Highlights" />
          <RadioBtn value="education" label="Education" />
        </div>

        {type === 'career' ? (
          <>
            <FloatingInput label="Role, Title, Position or Program Name*" value={form.role}       onChange={e => set('role',       e.target.value)} />
            <FloatingInput label="Production, Show or Work"               value={form.production} onChange={e => set('production', e.target.value)} />
          </>
        ) : (
          <>
            <FloatingInput label="Degree or Program"  value={form.degree}       onChange={e => set('degree',       e.target.value)} />
            <FloatingInput label="Field of Study"     value={form.fieldOfStudy} onChange={e => set('fieldOfStudy', e.target.value)} />
          </>
        )}

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={current}
            onChange={e => setCurrent(e.target.checked)}
            className="w-4 h-4 rounded accent-[#8B6914]"
          />
          <span className="text-[13.5px] text-[#555]">I am currently affiliated with this organization</span>
        </label>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <FloatingSelect label="Start month" value={form.startMonth} options={MONTHS} onChange={e => set('startMonth', e.target.value)} />
          <FloatingSelect label="Start year"  value={form.startYear}  options={YEARS}  onChange={e => set('startYear',  e.target.value)} />
        </div>
        {!current && (
          <div className="grid grid-cols-2 gap-4">
            <FloatingSelect label="End month" value={form.endMonth} options={MONTHS} onChange={e => set('endMonth', e.target.value)} />
            <FloatingSelect label="End year"  value={form.endYear}  options={YEARS}  onChange={e => set('endYear',  e.target.value)} />
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <GoldBtn onClick={handleNext} className="flex-1 justify-center">Next <ArrowRight size={15} /></GoldBtn>
          <GoldBtn onClick={onSkip} outline className="flex-1 justify-center">Skip</GoldBtn>
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════════════ */
/*  STEP 5 – Make Connections                                      */
/* ════════════════════════════════════════════════════════════════ */
const MOCK_CONNECTIONS = [
  { id:1, name:'Reuben Hamilton', roles:'Voice, Dancer, Stage Performer, Actor', genres:['Opera','Dance Theatre'], img:'/assets/images/onboarding/connect-1.jpg' },
  { id:2, name:'Karim Anderson',  roles:'Voice, Dancer, Stage Performer, Actor', genres:['Opera','Dance Theatre'], img:'/assets/images/onboarding/connect-2.jpg' },
  { id:3, name:'Aderoju Peter',   roles:'Voice, Dancer, Stage Performer, Actor', genres:['Opera','Dance Theatre'], img:'/assets/images/onboarding/connect-3.jpg' },
  { id:4, name:'Mercy Adekanye',  roles:'Voice, Dancer, Stage Performer, Actor', genres:['Opera','Dance Theatre'], img:'/assets/images/onboarding/connect-4.jpg' },
  { id:5, name:'Deborah Kim',     roles:'Voice, Dancer, Stage Performer, Actor', genres:['Opera','Dance Theatre'], img:'/assets/images/onboarding/connect-5.jpg' },
  { id:6, name:'Peter Kingston',  roles:'Voice, Flutist, Stage Performer, Actor',genres:['Opera','Dance Theatre'], img:'/assets/images/onboarding/connect-6.jpg' },
];

const Step5 = ({ onNext, onSkip }) => {
  const [sent, setSent] = useState(new Set());

  const toggle = async (id) => {
    if (sent.has(id)) return;
    try {
      await connectionsAPI.send({ to_user: id });
      setSent(s => new Set([...s, id]));
    } catch {
      // optimistically mark sent anyway
      setSent(s => new Set([...s, id]));
    }
  };

  return (
    <>
      <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-1 text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Great! Let's start building your network
      </h2>
      <p className="text-[13.5px] text-[#888] mb-8 text-center">
        Select connections from the list to get started.
      </p>

      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-8">
        <div className="grid grid-cols-3 gap-4">
          {MOCK_CONNECTIONS.map(c => (
            <div key={c.id} className="rounded-xl border border-[#EBEBEB] overflow-hidden hover:shadow-md transition-shadow">
              {/* Photo */}
              <div className="relative h-[140px] bg-[#1a1a1a]">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display='none'; }} />
                <button
                  onClick={() => toggle(c.id)}
                  className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    sent.has(c.id)
                      ? 'bg-[#8B6914] text-white'
                      : 'bg-white/90 text-[#8B6914] hover:bg-[#8B6914] hover:text-white'
                  }`}
                >
                  {sent.has(c.id) ? <Check size={14} /> : <UserPlus size={14} />}
                </button>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-[13.5px] font-semibold text-[#1A1A1A] mb-0.5">{c.name}</p>
                <p className="text-[11.5px] text-[#888] mb-2 leading-snug">{c.roles}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.genres.map(g => (
                    <span key={g} className="text-[11px] px-2.5 py-0.5 bg-[#F5EDD6] text-[#8B6914] rounded-full">{g}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-6">
          <GoldBtn onClick={onNext} className="flex-1 justify-center">Next <ArrowRight size={15} /></GoldBtn>
          <GoldBtn onClick={onSkip} outline className="flex-1 justify-center">Skip</GoldBtn>
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════════════ */
/*  Main ArtistOnboarding                                          */
/* ════════════════════════════════════════════════════════════════ */
const ArtistOnboarding = () => {
  const [step, setStep] = useState(1);
  const navigate        = useNavigate();

  const next = () => setStep(s => s + 1);
  const skip = () => setStep(s => s + 1);

  const finish = async () => {
    try {
      await artistAPI.completeOnboarding();
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    }
  };

  const STEPS = {
    1: <Step1 onNext={next} />,
    2: <Step2 onNext={next} />,
    3: <Step3 onNext={next} onSkip={skip} />,
    4: <Step4 onNext={next} onSkip={skip} />,
    5: <Step5 onNext={finish} onSkip={finish} />,
  };

  return (
    <OnboardingLayout currentStep={step}>
      {STEPS[step]}
    </OnboardingLayout>
  );
};

export default ArtistOnboarding;
