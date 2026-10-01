import React, { useState, useEffect } from 'react'
import { X, Youtube, ExternalLink, Play, CheckCircle2, Shield, Sparkles, Edit3 } from 'lucide-react'
import './YouTubeModal.css'

const DEFAULT_YOUTUBE_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

export const YouTubeModal = ({ isOpen, onClose }) => {
  const [videoUrl, setVideoUrl] = useState(() => {
    return localStorage.getItem('custom_youtube_url') || 'https://www.youtube.com/watch?v=L_LUpnjgPso'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [tempUrl, setTempUrl] = useState(videoUrl)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Convert standard watch?v= or youtu.be/ URL to embed URL
  const getEmbedUrl = (url) => {
    try {
      if (!url) return 'https://www.youtube-nocookie.com/embed/L_LUpnjgPso'
      if (url.includes('embed/')) return url
      if (url.includes('watch?v=')) {
        const id = url.split('watch?v=')[1]?.split('&')[0]
        return `https://www.youtube-nocookie.com/embed/${id}`
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0]
        return `https://www.youtube-nocookie.com/embed/${id}`
      }
      return url
    } catch {
      return 'https://www.youtube-nocookie.com/embed/L_LUpnjgPso'
    }
  }

  const handleSaveUrl = (e) => {
    e.preventDefault()
    setVideoUrl(tempUrl)
    localStorage.setItem('custom_youtube_url', tempUrl)
    setIsEditing(false)
  }

  return (
    <div className="youtube-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="youtube-modal-container fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="youtube-modal-header">
          <div className="youtube-badge-title">
            <div className="youtube-icon-pill">
              <Youtube size={22} className="yt-icon-red" />
            </div>
            <div>
              <h3>Project Demo & Architecture Walkthrough</h3>
              <p>React + .NET Core C# + SQL + VAPT Security + MFA</p>
            </div>
          </div>
          <button className="youtube-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Video Player */}
        <div className="youtube-player-wrapper">
          <iframe
            src={getEmbedUrl(videoUrl)}
            title="Project Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="youtube-iframe"
          />
        </div>

        {/* Video Controls & Custom URL setting */}
        <div className="youtube-controls-bar">
          {!isEditing ? (
            <div className="youtube-link-display">
              <div className="yt-link-info">
                <Youtube size={16} className="yt-icon-red" />
                <span className="yt-url-text" title={videoUrl}>{videoUrl}</span>
              </div>
              <div className="yt-actions-group">
                <button
                  type="button"
                  className="yt-action-btn edit"
                  onClick={() => {
                    setTempUrl(videoUrl)
                    setIsEditing(true)
                  }}
                >
                  <Edit3 size={14} />
                  Change Link
                </button>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="yt-action-btn external"
                >
                  <ExternalLink size={14} />
                  Open in YouTube
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveUrl} className="youtube-edit-form">
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="Paste your YouTube video URL (e.g. https://www.youtube.com/watch?v=...)"
                className="yt-url-input"
                autoFocus
                required
              />
              <button type="submit" className="yt-btn-save">Save Link</button>
              <button type="button" className="yt-btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          )}
        </div>

        {/* Architecture Highlights Pill List */}
        <div className="youtube-highlights">
          <h4>🚀 Included Architecture Features:</h4>
          <div className="highlights-grid">
            <div className="highlight-pill">
              <CheckCircle2 size={16} className="pill-check" />
              <span><strong>React 18</strong> - Modular Single Page Application</span>
            </div>
            <div className="highlight-pill">
              <CheckCircle2 size={16} className="pill-check" />
              <span><strong>.NET Core C# API</strong> - High Performance REST Endpoints</span>
            </div>
            <div className="highlight-pill">
              <CheckCircle2 size={16} className="pill-check" />
              <span><strong>SQL Database</strong> - Relational Entity Framework Core</span>
            </div>
            <div className="highlight-pill">
              <CheckCircle2 size={16} className="pill-check" />
              <span><strong>VAPT Security</strong> - OWASP Top 10 Hardened & Protected</span>
            </div>
            <div className="highlight-pill">
              <CheckCircle2 size={16} className="pill-check" />
              <span><strong>MFA Protection</strong> - Multi-Factor 2-Step Authentication</span>
            </div>
            <div className="highlight-pill">
              <CheckCircle2 size={16} className="pill-check" />
              <span><strong>Full CRUD Engine</strong> - Create, Read, Update, Delete & CSV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YouTubeModal
