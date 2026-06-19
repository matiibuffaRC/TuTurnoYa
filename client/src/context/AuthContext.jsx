import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [barbero, setBarbero] = useState(() => {
    const stored = localStorage.getItem('barbero')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const login = (tokenData, barberoData) => {
    localStorage.setItem('token', tokenData)
    localStorage.setItem('barbero', JSON.stringify(barberoData))
    setToken(tokenData)
    setBarbero(barberoData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('barbero')
    setToken(null)
    setBarbero(null)
  }

  const actualizarBarbero = (barberoData) => {
    localStorage.setItem('barbero', JSON.stringify(barberoData))
    setBarbero(barberoData)
  }

  return (
    <AuthContext.Provider value={{ barbero, token, login, logout, actualizarBarbero }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
