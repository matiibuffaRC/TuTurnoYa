import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [barbero, setBarbero] = useState(() => {
        const stored = sessionStorage.getItem('barbero')
        return stored ? JSON.parse(stored) : null
    })
    const [usuario, setUsuario] = useState(() => {
        const stored = sessionStorage.getItem('usuario')
        return stored ? JSON.parse(stored) : null
    })
    const [token, setToken] = useState(() => sessionStorage.getItem('token') || null)

    const login = (tokenData, barberoData, usuarioData) => {
        sessionStorage.setItem('token', tokenData)
        setToken(tokenData)
        
        if (barberoData) {
            sessionStorage.setItem('barbero', JSON.stringify(barberoData))
            setBarbero(barberoData)
        }
        if (usuarioData) {
            sessionStorage.setItem('usuario', JSON.stringify(usuarioData))
            setUsuario(usuarioData)
        }
    }

    const logout = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('barbero')
        sessionStorage.removeItem('usuario')
        setToken(null)
        setBarbero(null)
        setUsuario(null)
    }

    const actualizarBarbero = (barberoData) => {
        sessionStorage.setItem('barbero', JSON.stringify(barberoData))
        setBarbero(barberoData)
    }

    return (
        <AuthContext.Provider value={{ barbero, usuario, token, login, logout, actualizarBarbero }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
