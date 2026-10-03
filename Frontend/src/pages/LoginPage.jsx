import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react'
import { authService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './LoginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requiresMfa, setRequiresMfa] = useState(false)
  const [mfaCode, setMfaCode] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  // Pre-warm live backend on mount to reduce Render free-tier spin-up latency
  useEffect(() => {
    fetch('https://nexus-api-vpkv.onrender.com/api/records').catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Presentation Quick Demo Autofill (Clean & subtle)
  const handleAutofillDemo = () => {
    setFormData({
      email: 'admin@crudapp.com',
      password: 'Admin@123',
      rememberMe: true
    })
    setRequiresMfa(false)
    toast.success('Filled: admin@crudapp.com')
  }

  const handleInstantSignIn = () => {
    const demoToken = 'demo_session_instant_' + Date.now()
    const demoUser = { id: 1, email: 'admin@crudapp.com', mfaEnabled: false, role: 'Administrator (Demo)' }
    login(demoUser, demoToken)
    toast.success('Instant sign-in successful (Demo Mode)')
    navigate('/dashboard', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = formData.email.trim()
    const password = formData.password.trim()

    if (!email || !password) {
      toast.error('Please enter your username/email and password')
      return
    }

    setLoading(true)
    try {
      const response = await authService.login(
        email,
        password,
        formData.rememberMe,
        requiresMfa ? mfaCode.trim() : null
      )

      if (response.requiresMfa) {
        setRequiresMfa(true)
        toast.info(response.message || 'MFA security code required')
      } else if (response.success && response.token) {
        login(response.user || { id: 1, email }, response.token)
        toast.success(response.message || 'Welcome back!')
        navigate('/dashboard', { replace: true })
      } else {
        toast.error(response.message || 'Sign in failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMsg =
        error?.message ||
        error?.title ||
        (typeof error === 'string' ? error : 'Invalid username or password')
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail) {
      toast.error('Please enter your account email')
      return
    }

    setLoading(true)
    try {
      const res = await authService.forgotPassword(forgotEmail)
      toast.success(res.message || 'Password reset link sent to your email')
      setShowForgotPassword(false)
      setForgotEmail('')
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      <button
        type="button"
        className="theme-toggle login-theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
      {/* Background ambient lighting */}
      <div className="ambient-glow glow-top"></div>
      <div className="ambient-glow glow-bottom"></div>
      <div className="grid-overlay"></div>

      <div className="login-card-wrapper fade-in">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
              <rect x="13" y="3" width="8" height="8" rx="2" fill="#58D6A5" />
              <rect x="3" y="13" width="8" height="8" rx="2" fill="#F3A08B" />
              <rect x="13" y="13" width="8" height="8" rx="2" fill="#E8795E" />
            </svg>
          </div>
          <h1 className="brand-name">Nexus</h1>
          <p className="brand-tagline">Enterprise Directory & Records Management</p>
        </div>

        {/* Card Body */}
        <div className="auth-card">
          {!showForgotPassword ? (
            <form onSubmit={handleSubmit} className="auth-form">
              {!requiresMfa ? (
                <>
                  <div className="card-headline">
                    <h2>Sign in to workspace</h2>
                    <p>Enter your credentials to continue to the console</p>
                  </div>

                  {/* Username / Email */}
                  <div className="input-group">
                    <label htmlFor="email" className="input-label">
                      Username / Email
                    </label>
                    <div className="input-field-wrap">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="text-input"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="input-group">
                    <div className="label-row">
                      <label htmlFor="password" className="input-label">
                        Password
                      </label>
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="input-field-wrap">
                      <Lock size={16} className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        className="text-input with-toggle"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="eye-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="options-row">
                    <label className="checkbox-wrap">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-label-text">Remember this session</span>
                    </label>
                  </div>
                </>
              ) : (
                /* MFA Verification Screen */
                <div className="mfa-box fade-in">
                  <div className="mfa-hero">
                    <div className="mfa-icon-badge">
                      <KeyRound size={22} />
                    </div>
                    <h2>Two-Factor Verification</h2>
                    <p>Enter the 6-digit authentication code generated for your account</p>
                  </div>

                  <div className="input-group">
                    <input
                      type="text"
                      className="mfa-digits-input"
                      placeholder="• • • • • •"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      autoFocus
                      required
                    />
                    <span className="mfa-demo-note">Demo Code: <strong>123456</strong></span>
                  </div>
                </div>
              )}

              {/* Login button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-state">
                    <RefreshCw size={16} className="spin-fast" />
                    Connecting to Cloud API...
                  </span>
                ) : (
                  <span className="btn-content">
                    {requiresMfa ? 'Verify Security Code' : 'Sign in to Console'}
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
              {loading && (
                <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '8px', lineHeight: '1.4' }}>
                  Connecting to live API. If server was asleep, please allow 10-15s to spin up.
                </div>
              )}

              {requiresMfa && (
                <button
                  type="button"
                  className="ghost-cancel-btn"
                  onClick={() => {
                    setRequiresMfa(false)
                    setMfaCode('')
                  }}
                >
                  Return to email login
                </button>
              )}
            </form>
          ) : (
            /* Forgot Password Flow */
            <form onSubmit={handleForgotPassword} className="auth-form fade-in">
              <div className="card-headline">
                <h2>Reset password</h2>
                <p>Provide your account email to receive recovery instructions</p>
              </div>

              <div className="input-group">
                <label htmlFor="forgotEmail" className="input-label">
                  Account Email
                </label>
                <div className="input-field-wrap">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    id="forgotEmail"
                    className="text-input"
                    placeholder="name@company.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Dispatching instructions...' : 'Send Recovery Link'}
              </button>

              <button
                type="button"
                className="ghost-cancel-btn"
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotEmail('')
                }}
              >
                Back to Sign in
              </button>
            </form>
          )}

          {/* Quick Demo Autofill Pill */}
          <div className="demo-helper-bar">
            <button
              type="button"
              className="quick-demo-pill"
              onClick={handleAutofillDemo}
              title="Click to fill test credentials"
            >
              <Sparkles size={13} className="spark-icon" />
              <span>Fill Admin (admin@crudapp.com)</span>
            </button>
            <button
              type="button"
              className="quick-demo-pill instant-pill"
              onClick={handleInstantSignIn}
              title="Instant bypass for client presentation"
            >
              <span>⚡ Instant Sign-In</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <span>Protected Enterprise Workspace</span>
          <span className="footer-dot">•</span>
          <span>End-to-End Encrypted Session</span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
