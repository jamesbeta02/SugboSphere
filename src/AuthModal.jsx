import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, LogIn, Shield, User, UserPlus } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// ── lowercase so comparison is always case-insensitive ──
const ADMIN_EMAILS = ['admin123@gmail.com'];

function AuthModal({ onClose }) {
  const [tab, setTab]                   = useState('user');  // 'user' | 'admin'
  const [mode, setMode]                 = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus]             = useState('idle');
  const [errorMsg, setErrorMsg]         = useState('');
  const [form, setForm]                 = useState({ name: '', email: '', password: '' });

  const setField = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const resetForm = () => {
    setForm({ name: '', email: '', password: '' });
    setErrorMsg('');
    setStatus('idle');
    setShowPassword(false);
  };

  const switchTab  = (t) => { setTab(t);  resetForm(); setMode('login'); };
  const switchMode = (m) => { setMode(m); resetForm(); };

  // Friendly Firebase error messages
  const getFirebaseError = (code) => {
    const map = {
      'auth/email-already-in-use':  'This email is already registered. Try logging in.',
      'auth/user-not-found':        'No account found with this email.',
      'auth/wrong-password':        'Incorrect password. Please try again.',
      'auth/invalid-email':         'Please enter a valid email address.',
      'auth/invalid-credential':    'Incorrect email or password. Please try again.',
      'auth/too-many-requests':     'Too many failed attempts. Please wait a moment.',
      'auth/user-disabled':         'This account has been disabled.',
      'auth/network-request-failed':'Network error. Please check your connection.',
      'auth/operation-not-allowed': 'Email/Password login is not enabled. Please enable it in Firebase Console.',
    };
    return map[code] || `Login failed (${code}). Please try again.`;
  };

  // ── User: Login or Signup ──
  const handleUserSubmit = async () => {
    const { name, email, password } = form;

    if (!email || !password || (mode === 'signup' && !name)) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      if (mode === 'signup') {
        // Create account
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: name.trim() });

        // ── Save user record to Firestore users collection ──
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid:       cred.user.uid,
          name:      name.trim(),
          email:     email.trim().toLowerCase(),
          banned:    false,
          createdAt: serverTimestamp()
        });

      } else {
        // Login — check ban status BEFORE letting them in
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

        // ── Check if user is banned ──
        const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
        if (userSnap.exists() && userSnap.data().banned === true) {
          await signOut(auth); // force sign out
          setStatus('error');
          setErrorMsg('Your account has been suspended. Please contact support.');
          return;
        }
      }

      setStatus('success');
      setTimeout(() => onClose(), 1400);
    } catch (err) {
      console.error('User auth error:', err.code, err.message);
      setStatus('error');
      setErrorMsg(getFirebaseError(err.code));
    }
  };

  // ── Admin: Login only, restricted ──
  const handleAdminSubmit = async () => {
    const { email, password } = form;

    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    // Case-insensitive check
    const normalizedEmail = email.trim().toLowerCase();
    if (!ADMIN_EMAILS.includes(normalizedEmail)) {
      setErrorMsg('Access restricted. Only authorized admins can log in here.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      // Use the normalized (lowercase) email to log in
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);

      // Double-check after Firebase auth
      if (!ADMIN_EMAILS.includes(cred.user.email?.toLowerCase())) {
        await signOut(auth);
        setStatus('error');
        setErrorMsg('Access restricted. Only authorized admins can log in here.');
        return;
      }

      setStatus('success');
      setTimeout(() => onClose(), 1400);
    } catch (err) {
      console.error('Admin auth error:', err.code, err.message);
      setStatus('error');
      setErrorMsg(getFirebaseError(err.code));
    }
  };

  const handleSubmit  = () => tab === 'admin' ? handleAdminSubmit() : handleUserSubmit();
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };

  const isAdmin     = tab === 'admin';
  const accentGrad  = isAdmin ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
  const accentColor = isAdmin ? '#d97706' : '#2563eb';
  const shadowColor = isAdmin ? 'rgba(245,158,11,0.35)' : 'rgba(59,130,246,0.35)';

  const inputStyle = {
    width: '100%', padding: '11px 14px 11px 40px',
    borderRadius: '10px', border: '1px solid #d1d5db',
    fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', color: '#111827',
    background: 'white', fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block', fontWeight: '600',
    color: '#374151', marginBottom: '6px', fontSize: '0.88rem'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 99999, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '22px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 30px 70px rgba(0,0,0,0.35)',
        position: 'relative', animation: 'authSlideIn 0.3s ease',
        overflow: 'hidden'
      }}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px', lineHeight: 1, zIndex: 2
        }}>
          <X size={20} color="#9ca3af" />
        </button>

        {/* ── Tab switcher ── */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f3f4f6' }}>
          {[
            { id: 'user',  label: 'User',  icon: <User   size={15} /> },
            { id: 'admin', label: 'Admin', icon: <Shield size={15} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              style={{
                flex: 1, padding: '16px 12px',
                border: 'none', cursor: 'pointer',
                background: tab === t.id ? 'white' : '#f9fafb',
                fontWeight: tab === t.id ? '700' : '500',
                fontSize: '0.92rem',
                color: tab === t.id
                  ? (t.id === 'admin' ? '#d97706' : '#2563eb')
                  : '#9ca3af',
                borderBottom: tab === t.id
                  ? `3px solid ${t.id === 'admin' ? '#f59e0b' : '#3b82f6'}`
                  : '3px solid transparent',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '7px',
                transition: 'all 0.2s ease'
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '28px 32px 34px' }}>

          {/* Icon + title */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: accentGrad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: `0 8px 20px ${shadowColor}`
            }}>
              {isAdmin
                ? <Shield size={26} color="white" />
                : (mode === 'signup' ? <UserPlus size={26} color="white" /> : <LogIn size={26} color="white" />)
              }
            </div>
            <h4 style={{ color: '#1e3a5f', fontWeight: '700', marginBottom: '4px', fontSize: '1.1rem' }}>
              {isAdmin ? 'Admin Sign In' : (mode === 'signup' ? 'Create Account' : 'Welcome Back')}
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.84rem', margin: 0 }}>
              {isAdmin
                ? 'Restricted to authorized administrators only'
                : (mode === 'signup'
                  ? "Join SugboSphere and explore Cebu's heritage"
                  : 'Sign in to your SugboSphere account')}
            </p>
          </div>

          {/* ── Success ── */}
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '10px 0 6px' }}>
              <div style={{
                width: '58px', height: '58px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px', color: 'white',
                fontWeight: '700', fontSize: '1.6rem'
              }}>✓</div>
              <p style={{ color: '#1e3a5f', fontWeight: '700', margin: '0 0 4px', fontSize: '1rem' }}>
                {isAdmin ? 'Welcome, Admin!' : (mode === 'signup' ? 'Account Created!' : 'Signed In!')}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.84rem', margin: 0 }}>Redirecting you now...</p>
            </div>
          ) : (
            <>
              {/* Name — signup only */}
              {!isAdmin && mode === 'signup' && (
                <div style={{ marginBottom: '13px', position: 'relative' }}>
                  <label style={labelStyle}>Full Name</label>
                  <User size={15} color="#9ca3af" style={{ position: 'absolute', left: '13px', top: '37px' }} />
                  <input
                    type="text" placeholder="Your full name"
                    value={form.name} onChange={setField('name')} onKeyDown={handleKeyDown}
                    style={inputStyle}
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: '13px', position: 'relative' }}>
                <label style={labelStyle}>{isAdmin ? 'Admin Email' : 'Email'}</label>
                <Mail size={15} color="#9ca3af" style={{ position: 'absolute', left: '13px', top: '37px' }} />
                <input
                  type="email"
                  placeholder={isAdmin ? 'admin123@gmail.com' : 'your@email.com'}
                  value={form.email} onChange={setField('email')} onKeyDown={handleKeyDown}
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '18px', position: 'relative' }}>
                <label style={labelStyle}>Password</label>
                <Lock size={15} color="#9ca3af" style={{ position: 'absolute', left: '13px', top: '37px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password} onChange={setField('password')} onKeyDown={handleKeyDown}
                  style={{ ...inputStyle, paddingRight: '42px' }}
                />
                <button onClick={() => setShowPassword(p => !p)} style={{
                  position: 'absolute', right: '12px', top: '33px',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px', lineHeight: 1
                }}>
                  {showPassword ? <EyeOff size={16} color="#9ca3af" /> : <Eye size={16} color="#9ca3af" />}
                </button>
              </div>

              {/* Error */}
              {errorMsg && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '10px', padding: '10px 14px',
                  color: '#dc2626', fontSize: '0.84rem',
                  marginBottom: '14px', lineHeight: '1.5'
                }}>
                  🔒 {errorMsg}
                </div>
              )}

              {/* Firebase not enabled hint */}
              {errorMsg.includes('not enabled') && (
                <div style={{
                  background: '#fffbeb', border: '1px solid #fde68a',
                  borderRadius: '10px', padding: '10px 14px',
                  color: '#92400e', fontSize: '0.82rem',
                  marginBottom: '14px', lineHeight: '1.5'
                }}>
                  ⚠️ Go to <strong>Firebase Console → Authentication → Sign-in method</strong> and enable <strong>Email/Password</strong>.
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                style={{
                  width: '100%', padding: '13px',
                  background: accentGrad,
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontWeight: '700', fontSize: '1rem',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.7 : 1,
                  transition: 'all 0.3s ease', marginBottom: '14px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px'
                }}
              >
                {status === 'loading' ? 'Please wait...' : (
                  isAdmin
                    ? <><Shield size={17} /> Sign In as Admin</>
                    : mode === 'signup'
                      ? <><UserPlus size={17} /> Create Account</>
                      : <><LogIn size={17} /> Sign In</>
                )}
              </button>

              {/* Toggle login ↔ signup (user only) */}
              {!isAdmin && (
                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <span
                    onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                    style={{ color: accentColor, fontWeight: '700', cursor: 'pointer' }}
                  >
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes authSlideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default AuthModal;