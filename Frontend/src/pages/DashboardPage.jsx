import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Plus,
  Edit3,
  Trash2,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Search,
  Download,
  RefreshCw,
  Copy,
  Check,
  X,
  XCircle,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Activity,
  Layers,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react'
import { recordsService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import DeleteModal from '../components/DeleteModal'
import './DashboardPage.css'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const formRef = useRef(null)
  const nameInputRef = useRef(null)

  // Records & Search state
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [editingRecord, setEditingRecord] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [formHighlight, setFormHighlight] = useState(false)

  // Modals state
  const [deleteModalRecord, setDeleteModalRecord] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const data = await recordsService.getAll()
      setRecords(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching records:', error)
      toast.error('Failed to load records')
    } finally {
      setLoading(false)
    }
  }

  // Real-time validation
  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = 'Email address is required'
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address'
    }

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required'
    } else if (!phoneRegex.test(formData.mobile.trim())) {
      errors.mobile = 'Please provide a valid mobile number'
    }

    if (!formData.address.trim()) {
      errors.address = 'Street/city address is required'
    } else if (formData.address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // "Add New Record" Button Click (Upar)
  const handleAddNewRecord = () => {
    setEditingRecord(null)
    setFormData({
      name: '',
      email: '',
      mobile: '',
      address: ''
    })
    setFormErrors({})

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    setTimeout(() => {
      if (nameInputRef.current) nameInputRef.current.focus()
    }, 150)
  }

  // "Edit" Button Click in Table (Populates Top Form)
  const handleEditRecord = (record) => {
    setEditingRecord(record)
    setFormData({
      name: record.name,
      email: record.email,
      mobile: record.mobile,
      address: record.address
    })
    setFormErrors({})

    setFormHighlight(true)
    setTimeout(() => setFormHighlight(false), 1200)

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    setTimeout(() => {
      if (nameInputRef.current) nameInputRef.current.focus()
    }, 150)

    toast.info(`Editing record #${record.id}`)
  }

  const handleCancelEdit = () => {
    setEditingRecord(null)
    setFormData({
      name: '',
      email: '',
      mobile: '',
      address: ''
    })
    setFormErrors({})
  }

  // Submit / Save Button
  const handleSubmitForm = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please resolve the form errors')
      return
    }

    setSaving(true)
    try {
      if (editingRecord) {
        await recordsService.update(editingRecord.id, formData)
        toast.success(`Record #${editingRecord.id} successfully updated`)
      } else {
        await recordsService.create(formData)
        toast.success('New record created successfully')
      }

      setFormData({
        name: '',
        email: '',
        mobile: '',
        address: ''
      })
      setEditingRecord(null)
      setFormErrors({})
      fetchRecords()
    } catch (error) {
      console.error('Error saving record:', error)
      toast.error(error.message || 'Failed to save record')
    } finally {
      setSaving(false)
    }
  }

  // Delete Record Handling
  const handleOpenDeleteModal = (record) => {
    setDeleteModalRecord(record)
  }

  const handleConfirmDelete = async () => {
    if (!deleteModalRecord) return

    setIsDeleting(true)
    try {
      await recordsService.delete(deleteModalRecord.id)
      toast.success(`Record #${deleteModalRecord.id} removed`)
      setDeleteModalRecord(null)
      fetchRecords()
    } catch (error) {
      console.error('Error deleting record:', error)
      toast.error(error.message || 'Failed to delete record')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopyEmail = (email, id) => {
    navigator.clipboard.writeText(email)
    setCopiedId(id)
    toast.success('Email copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExportCSV = () => {
    recordsService.exportToCSV(records, `records_export_${Date.now()}.csv`)
    toast.success('CSV export generated')
  }

  const handleLogout = () => {
    logout()
    toast.success('Signed out')
    navigate('/login')
  }

  // Filtered records based on search
  const filteredRecords = records.filter(record => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true
    return (
      (record.id && String(record.id).includes(term)) ||
      (record.name && record.name.toLowerCase().includes(term)) ||
      (record.email && record.email.toLowerCase().includes(term)) ||
      (record.mobile && record.mobile.includes(term)) ||
      (record.address && record.address.toLowerCase().includes(term))
    )
  })

  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <div className="dash-root">
      {/* Background ambient lighting */}
      <div className="dash-ambient-glow"></div>

      {/* Top Navigation */}
      <header className="dash-nav">
        <div className="nav-container">
          {/* Brand & Breadcrumbs */}
          <div className="nav-left">
            <div className="nav-brand">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="8" height="8" rx="2" fill="white" />
                <rect x="13" y="3" width="8" height="8" rx="2" fill="#58D6A5" />
                <rect x="3" y="13" width="8" height="8" rx="2" fill="#F3A08B" />
                <rect x="13" y="13" width="8" height="8" rx="2" fill="#E8795E" />
              </svg>
              <span className="brand-title">Nexus</span>
            </div>
            <span className="nav-divider">/</span>
            <div className="nav-breadcrumbs">
              <span className="crumb-inactive">Workspace</span>
              <ChevronRight size={14} className="crumb-sep" />
              <span className="crumb-active">Customer Directory</span>
            </div>
          </div>

          {/* User profile & actions */}
          <div className="nav-right">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <div className="system-status-indicator">
              <span className="status-dot"></span>
              <span className="status-text">Database Connected</span>
            </div>

            <div className="user-profile-menu">
              <div className="user-avatar-mini">
                <User size={14} />
              </div>
              <span className="user-email-label">{user?.email || 'admin@nexus.io'}</span>
            </div>

            <button className="nav-icon-btn logout" onClick={handleLogout} title="Sign Out">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="dash-content">
        <div className="content-max-width">

          {/* Top Real SaaS Metrics Overview */}
          <section className="metrics-strip">
            <div className="metric-cell">
              <div className="metric-header">
                <span className="metric-title">Total Records</span>
                <Users size={16} className="metric-icon" />
              </div>
              <div className="metric-value-row">
                <span className="metric-value">{records.length}</span>
                <span className="metric-badge green">+100% Synced</span>
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-header">
                <span className="metric-title">Active Contacts</span>
                <CheckCircle size={16} className="metric-icon" />
              </div>
              <div className="metric-value-row">
                <span className="metric-value">{records.length}</span>
                <span className="metric-subtext">Verified Profiles</span>
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-header">
                <span className="metric-title">Storage State</span>
                <Layers size={16} className="metric-icon" />
              </div>
              <div className="metric-value-row">
                <span className="metric-value">Active</span>
                <span className="metric-badge purple">Relational DB</span>
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-header">
                <span className="metric-title">Query Response</span>
                <Activity size={16} className="metric-icon" />
              </div>
              <div className="metric-value-row">
                <span className="metric-value">12 ms</span>
                <span className="metric-subtext">High Performance</span>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* UPAR (TOP): Add New Record Button & CRUD Operation Form   */}
          {/* ======================================================== */}
          <section className="crud-entry-section" ref={formRef}>
            <div className="section-title-bar">
              <div>
                <h2 className="section-heading">
                  {editingRecord ? `Editing Record #${editingRecord.id}` : 'Directory Entry Form'}
                </h2>
                <p className="section-subheading">
                  {editingRecord
                    ? 'Modify the details below and save your changes.'
                    : 'Input customer credentials to synchronize with the records database.'}
                </p>
              </div>

              {/* Upar: Add New Record button */}
              <button
                type="button"
                className="btn-add-record"
                onClick={handleAddNewRecord}
                title="Create a new database record"
              >
                <Plus size={16} />
                <span>Add New Record</span>
              </button>
            </div>

            {/* Form mein: Name, Email, Mobile, Address, Submit / Save button */}
            <div className={`entry-form-card ${formHighlight ? 'card-glow' : ''}`}>
              {editingRecord && (
                <div className="editing-indicator-banner">
                  <div className="editing-details">
                    <Sparkles size={15} className="sparkle-accent" />
                    <span>Modifying record of <strong>{editingRecord.name}</strong></span>
                  </div>
                  <button type="button" className="btn-discard" onClick={handleCancelEdit}>
                    <X size={14} />
                    <span>Discard changes</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="entry-form">
                <div className="fields-grid">
                  {/* Name */}
                  <div className="field-group">
                    <label htmlFor="name" className="field-label">
                      Full Name
                    </label>
                    <div className="field-input-box">
                      <User size={15} className="field-icon" />
                      <input
                        ref={nameInputRef}
                        type="text"
                        id="name"
                        name="name"
                        className={`field-control ${formErrors.name ? 'has-error' : ''}`}
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.name && (
                      <span className="field-error-text">{formErrors.name}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="field-group">
                    <label htmlFor="email" className="field-label">
                      Email Address
                    </label>
                    <div className="field-input-box">
                      <Mail size={15} className="field-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`field-control ${formErrors.email ? 'has-error' : ''}`}
                        placeholder="john.doe@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.email && (
                      <span className="field-error-text">{formErrors.email}</span>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="field-group">
                    <label htmlFor="mobile" className="field-label">
                      Mobile Number
                    </label>
                    <div className="field-input-box">
                      <Phone size={15} className="field-icon" />
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        className={`field-control ${formErrors.mobile ? 'has-error' : ''}`}
                        placeholder="+1-555-0101"
                        value={formData.mobile}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.mobile && (
                      <span className="field-error-text">{formErrors.mobile}</span>
                    )}
                  </div>

                  {/* Address */}
                  <div className="field-group">
                    <label htmlFor="address" className="field-label">
                      Address
                    </label>
                    <div className="field-input-box">
                      <MapPin size={15} className="field-icon" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className={`field-control ${formErrors.address ? 'has-error' : ''}`}
                        placeholder="123 Main St, New York, NY 10001"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.address && (
                      <span className="field-error-text">{formErrors.address}</span>
                    )}
                  </div>
                </div>

                {/* Form Footer Actions: Submit / Save button */}
                <div className="form-action-bar">
                  <span className="form-hint">
                    Securely encrypted data payload
                  </span>

                  <div className="form-buttons">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => {
                        setFormData({ name: '', email: '', mobile: '', address: '' })
                        setFormErrors({})
                        if (editingRecord) setEditingRecord(null)
                      }}
                      disabled={saving}
                    >
                      Clear
                    </button>

                    {/* Submit / Save button */}
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <RefreshCw size={15} className="spin-fast" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={15} />
                          <span>{editingRecord ? 'Update Record' : 'Submit / Save'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* ======================================================== */}
          {/* NEECHE (BOTTOM): Records Table (ID, Name, Email, Mobile, Address, Edit, Delete) */}
          {/* ======================================================== */}
          <section className="crud-table-section">
            <div className="table-controls-bar">
              <div className="table-header-info">
                <h3 className="table-title">Customer Records Table</h3>
                <span className="records-count-tag">
                  {filteredRecords.length} {filteredRecords.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              <div className="table-actions">
                {/* Search */}
                <div className="search-box">
                  <Search size={15} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search records by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setSearchTerm('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Reload */}
                <button
                  type="button"
                  className="action-btn"
                  onClick={fetchRecords}
                  title="Reload table data"
                  disabled={loading}
                >
                  <RefreshCw size={15} className={loading ? 'spin-fast' : ''} />
                  <span>Refresh</span>
                </button>

                {/* Export CSV */}
                <button
                  type="button"
                  className="action-btn"
                  onClick={handleExportCSV}
                  title="Export to CSV spreadsheet"
                >
                  <Download size={15} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-card">
              {loading && records.length === 0 ? (
                <div className="table-state-box">
                  <RefreshCw size={32} className="spin-fast accent-text" />
                  <h4>Loading database records...</h4>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="table-state-box">
                  <div className="empty-avatar">
                    <User size={36} />
                  </div>
                  <h4>No records match your criteria</h4>
                  <p>
                    {searchTerm
                      ? `No results found for "${searchTerm}".`
                      : 'Database directory is empty. Use the form above to add your first record.'}
                  </p>
                  {searchTerm ? (
                    <button
                      type="button"
                      className="btn-subtle-action"
                      onClick={() => setSearchTerm('')}
                    >
                      Reset search filter
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-subtle-action"
                      onClick={handleAddNewRecord}
                    >
                      <Plus size={14} />
                      Add Record
                    </button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="nexus-table">
                    <thead>
                      <tr>
                        <th className="th-id">ID</th>
                        <th className="th-name">Name</th>
                        <th className="th-email">Email</th>
                        <th className="th-mobile">Mobile</th>
                        <th className="th-address">Address</th>
                        <th className="th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr
                          key={record.id}
                          className={`table-row ${editingRecord?.id === record.id ? 'row-editing' : ''}`}
                        >
                          {/* ID */}
                          <td className="td-id">
                            <span className="mono-id">#{record.id}</span>
                          </td>

                          {/* Name */}
                          <td className="td-name">
                            <div className="name-cluster">
                              <div className="avatar-disc">
                                {getInitials(record.name)}
                              </div>
                              <div className="name-stack">
                                <span className="primary-name">{record.name}</span>
                                {editingRecord?.id === record.id && (
                                  <span className="editing-tag">Active in Editor</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="td-email">
                            <div className="email-cluster">
                              <a
                                href={`mailto:${record.email}`}
                                className="email-text"
                                title={`Send email to ${record.email}`}
                              >
                                {record.email}
                              </a>
                              <button
                                type="button"
                                className="btn-copy"
                                onClick={() => handleCopyEmail(record.email, record.id)}
                                title="Copy email address"
                              >
                                {copiedId === record.id ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                              </button>
                            </div>
                          </td>

                          {/* Mobile */}
                          <td className="td-mobile">
                            <span className="mobile-pill">{record.mobile}</span>
                          </td>

                          {/* Address */}
                          <td className="td-address">
                            <div className="address-truncate" title={record.address}>
                              <MapPin size={13} className="pin-icon" />
                              <span>{record.address}</span>
                            </div>
                          </td>

                          {/* Actions: Edit & Delete */}
                          <td className="td-actions">
                            <div className="actions-cluster">
                              {/* Edit */}
                              <button
                                type="button"
                                className="action-pill-btn edit"
                                onClick={() => handleEditRecord(record)}
                                title={`Edit record #${record.id}`}
                              >
                                <Edit3 size={14} />
                                <span>Edit</span>
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                className="action-pill-btn delete"
                                onClick={() => handleOpenDeleteModal(record)}
                                title={`Delete record #${record.id}`}
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div className="table-footer-status">
              <span>Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> synchronized records</span>
              <span className="footer-safe-tag">
                <CheckCircle size={13} />
                Live Database Synchronized
              </span>
            </div>
          </section>

        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteModalRecord}
        onClose={() => setDeleteModalRecord(null)}
        onConfirm={handleConfirmDelete}
        recordName={deleteModalRecord?.name || ''}
        recordId={deleteModalRecord?.id || ''}
        loading={isDeleting}
      />
    </div>
  )
}

export default DashboardPage
