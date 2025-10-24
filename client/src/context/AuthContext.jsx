import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // initialize from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  // keep localStorage and axios default header in sync
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      // attach to axios default headers so all requests automatically include it
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const logout = () => setToken(null)

  // convenience headers object for fetch calls that expect headers passed explicitly
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  return (
    <AuthContext.Provider value={{ token, setToken, logout, authHeaders }}>
      {children}
    </AuthContext.Provider>
  )
}
