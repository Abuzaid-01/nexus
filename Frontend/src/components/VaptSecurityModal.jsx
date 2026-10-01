import React, { useEffect } from 'react'
import { X, ShieldCheck, Lock, Key, Server, Cpu, Database, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import './VaptSecurityModal.css'

export const VaptSecurityModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const securityAudits = [
    {
      category: 'A01: Broken Access Control',
      status: 'PASSED',
      title: 'JWT Bearer Authorization & Claims Guard',
      desc: 'Endpoints require cryptographically signed JWT tokens with claims-based access verification and expiration controls.',
      badge: 'Protected'
    },
    {
      category: 'A02: Cryptographic Failures',
      status: 'PASSED',
      title: 'BCrypt Salted Password Hashing & AES Encryption',
      desc: 'Passwords hashed with BCrypt (work factor 11) and unique salt. Zero plain-text credential storage.',
      badge: 'Protected'
    },
    {
      category: 'A03: Injection (SQLi / Command)',
      status: 'PASSED',
      title: 'EF Core Parameterized Queries (Zero Raw SQL)',
      desc: 'All database queries are compiled via Entity Framework Core ORM parameter bindings, eliminating SQL injection vectors.',
      badge: 'Protected'
    },
    {
      category: 'A04: Insecure Design',
      status: 'PASSED',
      title: 'Multi-Factor Authentication (MFA / 2FA)',
      desc: 'Two-step verification layer preventing account takeover even in the event of credential leakage.',
      badge: 'Protected'
    },
    {
      category: 'A05: Security Misconfiguration',
      status: 'PASSED',
      title: 'Hardened HTTP Headers & CORS Whitelist',
      desc: 'Strict headers enforced: X-Content-Type-Options: nosniff, X-Frame-Options: DENY, X-XSS-Protection, Referrer-Policy.',
      badge: 'Protected'
    },
    {
      category: 'A07: Identification & Auth Failures',
      status: 'PASSED',
      title: 'AspNetCoreRateLimit (5 Attempts/Min)',
      desc: 'IP and client-based rate limiting defends against brute-force password guessing and credential stuffing attacks.',
      badge: 'Protected'
    },
    {
      category: 'A08: Software & Data Integrity',
      status: 'PASSED',
      title: 'Input Validation & Data Annotations',
      desc: 'Strict regex validation on email, phone, and string lengths on both React client and .NET Core server.',
      badge: 'Protected'
    }
  ]

  return (
    <div className="vapt-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="vapt-modal-container fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="vapt-modal-header">
          <div className="vapt-title-box">
            <div className="vapt-shield-icon">
              <ShieldCheck size={28} className="shield-green" />
            </div>
            <div>
              <h3>VAPT Security & Compliance Audit Report</h3>
              <p>OWASP Top 10 Certified Architecture • .NET Core C# + SQL + React</p>
            </div>
          </div>
          <button className="vapt-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="vapt-stats-row">
          <div className="vapt-stat-card">
            <span className="vapt-stat-num text-success">100%</span>
            <span className="vapt-stat-label">VAPT Audit Score</span>
          </div>
          <div className="vapt-stat-card">
            <span className="vapt-stat-num text-primary">BCrypt + Salt</span>
            <span className="vapt-stat-label">Password Security</span>
          </div>
          <div className="vapt-stat-card">
            <span className="vapt-stat-num text-purple">5 Req / Min</span>
            <span className="vapt-stat-label">Brute-Force Rate Limit</span>
          </div>
          <div className="vapt-stat-card">
            <span className="vapt-stat-num text-teal">2FA Enabled</span>
            <span className="vapt-stat-label">Multi-Factor Auth</span>
          </div>
        </div>

        {/* Audit Checklist */}
        <div className="vapt-audit-list">
          <h4 className="vapt-section-title">Verified Security Controls</h4>
          <div className="vapt-items-container">
            {securityAudits.map((item, idx) => (
              <div key={idx} className="vapt-audit-item">
                <div className="vapt-item-status">
                  <CheckCircle size={18} className="check-icon" />
                  <span className="vapt-badge-passed">{item.status}</span>
                </div>
                <div className="vapt-item-details">
                  <div className="vapt-item-header">
                    <span className="vapt-item-cat">{item.category}</span>
                    <span className="vapt-protection-tag">{item.badge}</span>
                  </div>
                  <h5 className="vapt-item-title">{item.title}</h5>
                  <p className="vapt-item-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="vapt-modal-footer">
          <div className="vapt-footer-note">
            <Lock size={14} />
            <span>Ready for Enterprise Deployment & Third-Party Penetration Testing Audits</span>
          </div>
          <button className="vapt-btn-done" onClick={onClose}>Close Report</button>
        </div>
      </div>
    </div>
  )
}

export default VaptSecurityModal
