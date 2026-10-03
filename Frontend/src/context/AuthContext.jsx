import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = (userData, authToken) => {
    // 1. Immediately persist to localStorage first so any route navigation checks succeed instantly
    localStorage.setItem('token', authToken)
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

    // 2. Update state
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
