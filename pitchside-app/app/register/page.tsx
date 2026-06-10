'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePredictionStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = usePredictionStore((s) => s.setUser);
  const submitted = usePredictionStore((s) => s.submitted);

  const [form, setForm] = useState({
    name: '',
    nick: '',
    insta: '',
    email: '',
    countryCode: '+91',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // If already submitted, redirect to confirm
  if (submitted) {
    router.replace('/confirm');
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.nick.trim() || form.nick.trim().length < 3)
      e.nick = 'Nickname must be at least 3 characters';
    if (!form.insta.trim()) e.insta = 'Instagram handle is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email is required';
    // Phone: ensure it has a valid length
    const rawPhone = form.phone.trim().replace(/[\s\-().]/g, '');
    if (!rawPhone) {
      e.phone = 'Phone number is required';
    } else if (rawPhone.length < 8) {
      e.phone = 'Phone number is too short';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      setUser({
        name: form.name.trim(),
        nick: form.nick.trim(),
        insta: form.insta.trim().startsWith('@')
          ? form.insta.trim()
          : `@${form.insta.trim()}`,
        email: form.email.trim().toLowerCase(),
        phone: `${form.countryCode}${form.phone.trim()}`,
      });
      router.push('/predict/groups');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrap">
      <h1 className="register-title">Create Your Entry</h1>
      <p className="register-sub">
        You&apos;ll need this to claim your prize if you win.
      </p>

      {/* Name */}
      <div className="form-group">
        <label className="form-label">Your Name</label>
        <input
          id="reg-name"
          className={`form-input ${errors.name ? 'error' : ''}`}
          type="text"
          placeholder="e.g. Swapna Roy"
          autoComplete="off"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      {/* Nickname */}
      <div className="form-group">
        <label className="form-label">
          Predictor Nickname <span style={{ color: 'var(--blue)' }}>★</span>
        </label>
        <input
          id="reg-nick"
          className={`form-input ${errors.nick ? 'error' : ''}`}
          type="text"
          placeholder="e.g. GoatHunter99"
          autoComplete="off"
          value={form.nick}
          onChange={(e) => handleChange('nick', e.target.value)}
        />
        {form.nick.trim().length > 2 && !errors.nick && (
          <div className="nickname-preview">
            Your leaderboard name: &quot;{form.nick.trim()}&quot; 🔥
          </div>
        )}
        {errors.nick && <div className="form-error">{errors.nick}</div>}
        <div className="form-hint">
          This is your public identity on the leaderboard. Make it legendary.
        </div>
      </div>

      {/* Instagram */}
      <div className="form-group">
        <label className="form-label">Instagram Handle</label>
        <input
          id="reg-insta"
          className={`form-input ${errors.insta ? 'error' : ''}`}
          type="text"
          placeholder="@yourhandle"
          autoComplete="off"
          value={form.insta}
          onChange={(e) => handleChange('insta', e.target.value)}
        />
        {errors.insta && <div className="form-error">{errors.insta}</div>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          id="reg-email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          type="email"
          placeholder="you@email.com"
          autoComplete="off"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>

      {/* Phone */}
      <div className="form-group">
        <label className="form-label">Phone</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            className={`form-input`}
            style={{ width: '100px', flexShrink: 0, paddingRight: '4px' }}
            value={form.countryCode}
            onChange={(e) => handleChange('countryCode', e.target.value)}
          >
            <option value="+1">+1 (US/CA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+91">+91 (IN)</option>
            <option value="+61">+61 (AU)</option>
            <option value="+971">+971 (UAE)</option>
            <option value="+966">+966 (KSA)</option>
            <option value="+27">+27 (ZA)</option>
            <option value="+234">+234 (NG)</option>
            <option value="+86">+86 (CN)</option>
            <option value="+81">+81 (JP)</option>
            <option value="+49">+49 (DE)</option>
            <option value="+33">+33 (FR)</option>
            <option value="+34">+34 (ES)</option>
            <option value="+39">+39 (IT)</option>
            <option value="+55">+55 (BR)</option>
            <option value="+52">+52 (MX)</option>
            <option value="+54">+54 (AR)</option>
            <option value="+56">+56 (CL)</option>
            <option value="+57">+57 (CO)</option>
            <option value="+51">+51 (PE)</option>
            <option value="+82">+82 (KR)</option>
            <option value="+62">+62 (ID)</option>
            <option value="+60">+60 (MY)</option>
            <option value="+65">+65 (SG)</option>
            <option value="+63">+63 (PH)</option>
            <option value="+66">+66 (TH)</option>
            <option value="+84">+84 (VN)</option>
            <option value="+92">+92 (PK)</option>
            <option value="+880">+880 (BD)</option>
            <option value="+94">+94 (LK)</option>
          </select>
          <input
            id="reg-phone"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            type="tel"
            placeholder="98765 43210"
            autoComplete="off"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
        {errors.phone && <div className="form-error">{errors.phone}</div>}
      </div>

      <button
        id="register-submit"
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Continue to Group Stage →'}
      </button>

      <p className="terms">
        By entering you agree to the{' '}
        <a href="#">contest rules</a>. One entry per person. Must follow
        @thepitchsidetv.
      </p>
    </div>
  );
}
