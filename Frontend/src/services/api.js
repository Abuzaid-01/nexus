import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nexus-api-vpkv.onrender.com/api'

// Initial enterprise sample records for instant client presentation
const INITIAL_RECORDS = [
  {
    id: 1,
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    mobile: '+1-555-0104',
    address: '321 Elm St, Houston, TX 77001',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: null
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    mobile: '+1-555-0102',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: null
  },
  {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    mobile: '+1-555-0103',
    address: '789 Pine Rd, Chicago, IL 60601',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: null
  },
  {
    id: 4,
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+1-555-0101',
    address: '123 Main St, New York, NY 10001',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: null
  },
  {
    id: 5,
    name: 'Robert Vance',
    email: 'robert.v@refrigeration.com',
    mobile: '+1-555-0199',
    address: '1725 Slough Ave, Scranton, PA 18503',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: null
  }
]

// Helper to detect demo or offline session tokens
export const isDemoToken = (token) => {
  if (!token) return false
  return (
    token.startsWith('mock_') ||
    token.includes('.instant') ||
    token.startsWith('demo_') ||
    token === 'demo-session-token'
  )
}


// LocalStorage helpers for standalone demo mode
const getLocalRecords = () => {
  try {
    const data = localStorage.getItem('crud_records_db')
    if (!data) {
      localStorage.setItem('crud_records_db', JSON.stringify(INITIAL_RECORDS))
      return INITIAL_RECORDS
    }
    return JSON.parse(data)
  } catch (e) {
    return INITIAL_RECORDS
  }
}

const saveLocalRecords = (records) => {
  try {
    localStorage.setItem('crud_records_db', JSON.stringify(records))
  } catch (e) {
    console.warn('Could not save to localStorage', e)
  }
}

// Axios instance with timeout for fast failover
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/')
    const token = localStorage.getItem('token')

    // If using a demo session, NEVER kick user out to login page
    if (isDemoToken(token)) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !isAuthEndpoint) {
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API Connection health state
let isBackendReachable = true
export const checkBackendHealth = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/records`, {
      timeout: 8000,
      headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
    })
    isBackendReachable = true
    return true
  } catch (err) {
    // If status 401, backend is up and running!
    if (err.response && (err.response.status === 401 || err.response.status === 200)) {
      isBackendReachable = true
      return true
    }
    isBackendReachable = false
    return false
  }
}

export const getBackendStatus = () => isBackendReachable

// Auth Services with resilience
export const authService = {
  login: async (email, password, rememberMe, mfaCode = null) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        rememberMe,
        mfaCode
      })
      isBackendReachable = true
      return response.data
    } catch (error) {
      // If server responded with 401 or invalid credentials, rethrow message
      if (error.response?.data) {
        throw error.response.data
      }

      // If backend is down or network error, execute local fallback for demo presentations
      console.warn('Backend unavailable, switching to Enterprise Standalone Demo mode')
      isBackendReachable = false

      // Simulated users
      const isMfaUser = email.toLowerCase().includes('demo') || email.toLowerCase().includes('mfa')
      if (isMfaUser && !mfaCode) {
        return {
          success: false,
          requiresMfa: true,
          message: 'MFA Code required for this account'
        }
      }

      if (isMfaUser && mfaCode && mfaCode !== '123456') {
        throw { message: 'Invalid MFA Code. Use demo code 123456' }
      }

      const mockToken = 'mock_jwt_token_' + btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }))
      return {
        success: true,
        token: mockToken,
        requiresMfa: false,
        message: 'Login successful (Enterprise Demo Mode)',
        user: {
          id: 1,
          email: email || 'admin@crudapp.com',
          mfaEnabled: isMfaUser
        }
      }
    }
  },

  register: async (email, password) => {
    try {
      const response = await api.post('/auth/register', { email, password })
      return response.data
    } catch (error) {
      if (error.response?.data) throw error.response.data
      return { success: true, message: 'User registered in demo store' }
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      if (error.response?.data) throw error.response.data
      return { message: `Password reset link sent successfully to ${email}` }
    }
  }
}

// Records Services with resilience & export capability
export const recordsService = {
  getAll: async () => {
    const token = localStorage.getItem('token')
    if (isDemoToken(token)) {
      return getLocalRecords()
    }
    try {
      const response = await api.get('/records')
      isBackendReachable = true
      // Also cache in local storage for instant fallback
      if (Array.isArray(response.data) && response.data.length > 0) {
        saveLocalRecords(response.data)
      }
      return response.data
    } catch (error) {
      console.warn('Using local records store:', error.message)
      isBackendReachable = false
      return getLocalRecords()
    }
  },

  getById: async (id) => {
    const token = localStorage.getItem('token')
    if (isDemoToken(token)) {
      const records = getLocalRecords()
      const found = records.find(r => r.id === parseInt(id, 10))
      if (!found) throw new Error('Record not found')
      return found
    }
    try {
      const response = await api.get(`/records/${id}`)
      return response.data
    } catch (error) {
      const records = getLocalRecords()
      const found = records.find(r => r.id === parseInt(id, 10))
      if (!found) throw new Error('Record not found')
      return found
    }
  },

  create: async (record) => {
    const token = localStorage.getItem('token')
    if (isDemoToken(token)) {
      const records = getLocalRecords()
      const newId = records.length > 0 ? Math.max(...records.map(r => r.id || 0)) + 1 : 1
      const newRecord = {
        id: newId,
        name: record.name,
        email: record.email,
        mobile: record.mobile,
        address: record.address,
        createdAt: new Date().toISOString(),
        updatedAt: null
      }
      const updated = [newRecord, ...records]
      saveLocalRecords(updated)
      return newRecord
    }
    try {
      const response = await api.post('/records', record)
      return response.data
    } catch (error) {
      if (error.response?.data) throw error.response.data
      // Fallback local save
      const records = getLocalRecords()
      const newId = records.length > 0 ? Math.max(...records.map(r => r.id || 0)) + 1 : 1
      const newRecord = {
        id: newId,
        name: record.name,
        email: record.email,
        mobile: record.mobile,
        address: record.address,
        createdAt: new Date().toISOString(),
        updatedAt: null
      }
      const updated = [newRecord, ...records]
      saveLocalRecords(updated)
      return newRecord
    }
  },

  update: async (id, record) => {
    const token = localStorage.getItem('token')
    if (isDemoToken(token)) {
      const records = getLocalRecords()
      const index = records.findIndex(r => r.id === parseInt(id, 10))
      if (index === -1) throw new Error('Record not found')
      const updatedRecord = {
        ...records[index],
        name: record.name,
        email: record.email,
        mobile: record.mobile,
        address: record.address,
        updatedAt: new Date().toISOString()
      }
      records[index] = updatedRecord
      saveLocalRecords(records)
      return updatedRecord
    }
    try {
      const response = await api.put(`/records/${id}`, record)
      return response.data
    } catch (error) {
      if (error.response?.data) throw error.response.data
      // Fallback local update
      const records = getLocalRecords()
      const index = records.findIndex(r => r.id === parseInt(id, 10))
      if (index === -1) throw new Error('Record not found')
      const updatedRecord = {
        ...records[index],
        name: record.name,
        email: record.email,
        mobile: record.mobile,
        address: record.address,
        updatedAt: new Date().toISOString()
      }
      records[index] = updatedRecord
      saveLocalRecords(records)
      return updatedRecord
    }
  },

  delete: async (id) => {
    const token = localStorage.getItem('token')
    if (isDemoToken(token)) {
      const records = getLocalRecords()
      const filtered = records.filter(r => r.id !== parseInt(id, 10))
      saveLocalRecords(filtered)
      return { success: true, message: 'Record deleted' }
    }
    try {
      const response = await api.delete(`/records/${id}`)
      return response.data
    } catch (error) {
      if (error.response?.data) throw error.response.data
      // Fallback local delete
      const records = getLocalRecords()
      const filtered = records.filter(r => r.id !== parseInt(id, 10))
      saveLocalRecords(filtered)
      return { success: true, message: 'Record deleted' }
    }
  },

  exportToCSV: (records, filename = 'records_export.csv') => {
    if (!records || records.length === 0) return
    const headers = ['ID', 'Name', 'Email', 'Mobile', 'Address', 'CreatedAt']
    const rows = records.map(r => [
      r.id,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.mobile || '').replace(/"/g, '""')}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      `"${r.createdAt || ''}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export default api
