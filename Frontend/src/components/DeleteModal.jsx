import React, { useEffect } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import './DeleteModal.css'

export const DeleteModal = ({ isOpen, onClose, onConfirm, recordName, recordId, loading }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="delete-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="delete-modal-container fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-icon-wrap">
          <AlertTriangle size={32} className="delete-warning-icon" />
        </div>
        <h3 className="delete-modal-title">Delete Record #{recordId}?</h3>
        <p className="delete-modal-desc">
          Are you sure you want to permanently delete <strong>"{recordName}"</strong>? This action cannot be reversed.
        </p>
        <div className="delete-modal-actions">
          <button
            type="button"
            className="delete-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-btn-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            <Trash2 size={16} />
            {loading ? 'Deleting...' : 'Yes, Delete Record'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
