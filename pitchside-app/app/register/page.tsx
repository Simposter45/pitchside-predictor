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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    if (!form.nick.trim() || form.nick.trim().length < 3) {
      e.nick = 'Nickname must be at least 3 characters';
    }
    
    const instaRaw = form.insta.trim().replace(/^@/, '');
    if (!instaRaw) {
      e.insta = 'Instagram handle is required';
    } else if (!/^[a-zA-Z0-9._]{1,30}$/.test(instaRaw)) {
      e.insta = 'Invalid Instagram handle format';
    }

    const emailRaw = form.email.trim().toLowerCase();
    if (!emailRaw || !/\S+@\S+\.\S+/.test(emailRaw)) {
      e.email = 'Valid email is required';
    } else {
      const domain = emailRaw.split('@')[1];
      const blocked = ['yopmail.com', 'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'throwawaymail.com', 'temp-mail.org', 'tempmail.net', 'sharklasers.com', 'grr.la', 'mail.ru'];
      if (blocked.includes(domain)) {
        e.email = 'Disposable emails are not allowed';
      }
    }

    // Phone: ensure it is exactly 10 digits (ignoring the country code)
    const rawPhone = form.phone.trim().replace(/[\s\-().]/g, '');
    if (!rawPhone) {
      e.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(rawPhone)) {
      e.phone = 'Please enter exactly 10 digits';
    }
    
    if (!acceptedTerms) {
      e.terms = 'You must agree to the contest rules to enter';
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
    <div className="register-split-container">
      <div className="register-rules-section">
        <h2 className="rules-heading">Win an iPhone 17 Pro</h2>
        <p className="rules-intro">Submit your perfect World Cup 2026 bracket to win the grand prize.</p>
        
        <ul className="rules-list">
          <li>
            <span className="icon">🎯</span>
            <div>
              <strong>Predict the Path</strong>
              <p>Pick the winner of every group and every knockout match through to the final.</p>
            </div>
          </li>
          <li>
            <span className="icon">⏳</span>
            <div>
              <strong>Perfect Bracket Wins</strong>
              <p>The earliest 100% correct entry wins. No edits allowed after submission.</p>
            </div>
          </li>
          <li>
            <span className="icon">🛑</span>
            <div>
              <strong>One Entry Only</strong>
              <p>Duplicates are strictly disqualified. Real emails and phone numbers required.</p>
            </div>
          </li>
          <li>
            <span className="icon">📱</span>
            <div>
              <strong>Follow Us</strong>
              <p>You must follow @thepitchsidetv on Instagram to be eligible.</p>
            </div>
          </li>
          <li>
            <span className="icon">🔓</span>
            <div>
              <strong>The Condition</strong>
              <p>Prize unlocks when we hit 100k subs on YouTube or Instagram.</p>
            </div>
          </li>
          <li>
            <span className="icon">⚖️</span>
            <div>
              <strong>Tie-Breaker</strong>
              <p>If no perfect bracket exists, the user with the most points wins (10pts R32, 20pts R16, 40pts QF, 80pts SF, 160pts Finalists, 320pts Champion).</p>
            </div>
          </li>
        </ul>

        <div className="prize-badge" style={{ marginBottom: 0, marginTop: '24px', width: '100%' }}>
          <span className="trophy">🏆</span>
          <div className="prize-badge-text">
            <div className="label">Grand Prize</div>
            <div className="value">iPhone 17 Pro (256GB)</div>
          </div>
        </div>
      </div>

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
            maxLength={10}
            placeholder="98765 43210"
            autoComplete="off"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
        {errors.phone && <div className="form-error">{errors.phone}</div>}
      </div>

      {/* Terms & Conditions Checkbox */}
      <div className="form-group" style={{ marginTop: '24px' }}>
        <div 
          className="terms-checkbox-label"
          onClick={() => {
            if (!acceptedTerms) {
              setShowModal(true);
            } else {
              setAcceptedTerms(false);
            }
          }}
        >
          <input
            type="checkbox"
            className="terms-checkbox"
            checked={acceptedTerms}
            readOnly
          />
          <span>
            I agree to the{' '}
            <button
              type="button"
              className="terms-link-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              contest rules
            </button>
            . One entry per person. Must follow @thepitchsidetv.
          </span>
        </div>
        {errors.terms && <div className="form-error" style={{ marginTop: '8px' }}>{errors.terms}</div>}
      </div>

      <button
        id="register-submit"
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Continue to Group Stage →'}
      </button>

      {/* Terms Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <h2>Giveaway Rules</h2>
            <div className="modal-body">
              <p><strong>How to win.</strong> Submit a full World Cup 2026 prediction path — every group winner and every knockout match winner through to the champion. The earliest entry with a 100% correct prediction path wins the prize.</p>
              <p><strong>The prize.</strong> One iPhone 17 Pro (256GB). No cash alternative. Prize is awarded to the winner at no cost.</p>
              <p><strong>The condition.</strong> The prize is awarded only when PitchSide TV reaches 100,000 subscribers on YouTube or 100,000 followers on Instagram, whichever comes first. If this milestone is not reached, no prize is awarded and no compensation is owed to any entrant.</p>
              <p><strong>Eligibility.</strong> Open to anyone worldwide. Entrants must follow @thepitchsidetv on Instagram at the time of winner announcement to be eligible.</p>
              <p><strong>One entry per person.</strong> Duplicate entries are disqualified. Entries must be submitted with a valid email, phone number, and Instagram handle.</p>
              <p><strong>No edits after submission.</strong> Your prediction path is locked the moment you submit. No changes allowed.</p>
              <p><strong>Winner determination.</strong> The winning entry is the earliest timestamped entry with a fully correct path. Timestamp is recorded at submission. In the event of a tie, the earlier timestamp wins.</p>
              <p><strong>Winner notification.</strong> The winner will be contacted via the Instagram handle provided at registration and announced publicly on PitchSide TV.</p>
              <p style={{ marginTop: '16px' }}>PitchSide TV reserves the right to disqualify any entry found to be fraudulent, duplicate, or in violation of these rules.</p>
              <p style={{ marginTop: '16px', fontSize: '13px' }}><em>By entering, you confirm you have read and accepted these rules.</em></p>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--gray-border)', fontSize: '11px', textAlign: 'center' }}>
                &copy; 2026 PitchSide TV — The World&apos;s Game. Daily.
              </div>
              <div style={{ marginTop: '24px' }}>
                <button
                  type="button"
                  className="submit-btn"
                  onClick={() => {
                    setAcceptedTerms(true);
                    if (errors.terms) setErrors((err) => ({ ...err, terms: '' }));
                    setShowModal(false);
                  }}
                >
                  I Accept the Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
