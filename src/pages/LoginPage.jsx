import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import PingUpLogo from '../components/PingUpLogo';
import { useApp } from '../context/AppContext';

const AVATAR_URLS = [
  'https://api.dicebear.com/9.x/avataaars/svg?seed=p1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=p2&backgroundColor=ffd5dc',
  'https://api.dicebear.com/9.x/avataaars/svg?seed=p3&backgroundColor=d1f4e0',
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Min 6 characters';
    if (isSignup && !name.trim()) errs.name = 'Name is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    login(email, password);
    navigate('/feed');
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    login('google@user.com', 'google');
    navigate('/feed');
  };

  return (
    <div className="auth-page">
      {/* ── Left Branding ── */}
      <div className="auth-left">
        <div className="auth-logo">
          <PingUpLogo size={28} color="var(--primary)" />
          <span>pingup</span>
        </div>

        <div className="auth-social-proof">
          <div className="auth-avatars">
            {AVATAR_URLS.map((url, i) => (
              <img key={i} src={url} alt="user" />
            ))}
          </div>
          <div>
            <div className="auth-stars">
              {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <div className="auth-social-text">Used by 12k+ developers</div>
          </div>
        </div>

        <h1 className="auth-heading">
          More than just friends<br />truly connect
        </h1>
        <p className="auth-subheading">
          connect with global community on pingup.
        </p>
      </div>

      {/* ── Right Auth Card ── */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">
            {isSignup ? 'Create your account' : 'Sign in to PingUp'}
          </h2>
          <p className="auth-card-subtitle">
            {isSignup
              ? 'Welcome! Please fill in the details to get started.'
              : 'Welcome back! Please sign in to continue'}
          </p>

          {/* Google Button */}
          <button
            className="auth-google-btn"
            onClick={handleGoogle}
            disabled={loading}
            type="button"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span>or</span>
            <div className="auth-divider-line" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <div className="auth-field">
                <label className="auth-label">Full name</label>
                <input
                  className={`auth-input ${errors.name ? 'error' : ''}`}
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ''})); }}
                />
                {errors.name && <span className="auth-error">{errors.name}</span>}
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input
                className={`auth-input ${errors.email ? 'error' : ''}`}
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
              />
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  className={`auth-input ${errors.password ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isSignup ? 'Create a password' : 'Enter your password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>{isSignup ? 'Create Account' : 'Continue'} <FaArrowRight size={13} /></>
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            {isSignup ? (
              <>Already have an account? <span onClick={() => { setIsSignup(false); setErrors({}); }}>Sign in</span></>
            ) : (
              <>Don't have an account? <span onClick={() => { setIsSignup(true); setErrors({}); }}>Sign up</span></>
            )}
          </p>

          <div className="auth-secured">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            Secured by clerk
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
