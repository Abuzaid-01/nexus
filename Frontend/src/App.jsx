import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const hasAuth = isAuthenticated || !!localStorage.getItem('token')
  return hasAuth ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const hasAuth = isAuthenticated || !!localStorage.getItem('token')
  return !hasAuth ? children : <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
