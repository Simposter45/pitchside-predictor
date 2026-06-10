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
    // Phone: require country code — must start with + after stripping spaces
    const rawPhone = form.phone.trim().replace(/[\s\-().]/g, '');
    if (!rawPhone) {
      e.phone = 'Phone number is required';
    } else if (!rawPhone.startsWith('+')) {
      e.phone = 'Include your country code (e.g. +91 9876543210)';
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
        phone: form.phone.trim(),
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
        <input
          id="reg-phone"
          className={`form-input ${errors.phone ? 'error' : ''}`}
          type="tel"
          placeholder="+91 ..."
          autoComplete="off"
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        {errors.phone && <div className="form-error">{errors.phone}</div>}
        <div className="form-hint">Include country code — e.g. +91 for India, +44 for UK</div>
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
