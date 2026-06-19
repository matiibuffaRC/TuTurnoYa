import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [barbero, setBarbero] = useState(() => {
    const stored = sessionStorage.getItem('barbero')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || null)

  const login = (tokenData, barberoData) => {
    sessionStorage.setItem('token', tokenData)
    sessionStorage.setItem('barbero', JSON.stringify(barberoData))
    setToken(tokenData)
    setBarbero(barberoData)
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('barbero')
    setToken(null)
    setBarbero(null)
  }

  const actualizarBarbero = (barberoData) => {
    sessionStorage.setItem('barbero', JSON.stringify(barberoData))
    setBarbero(barberoData)
  }

  return (
    <AuthContext.Provider value={{ barbero, token, login, logout, actualizarBarbero }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
