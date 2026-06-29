import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [barbero, setBarbero] = useState(() => {
        const stored = localStorage.getItem('barbero')
        return stored ? JSON.parse(stored) : null
    })
    const [usuario, setUsuario] = useState(() => {
        const stored = localStorage.getItem('usuario')
        return stored ? JSON.parse(stored) : null
    })
    const [token, setToken] = useState(() => localStorage.getItem('token') || null)

    const login = (tokenData, barberoData, usuarioData) => {
        // Limpiar sesión anterior antes de setear la nueva
        localStorage.removeItem('barbero')
        localStorage.removeItem('usuario')
        setBarbero(null)
        setUsuario(null)

        localStorage.setItem('token', tokenData)
        setToken(tokenData)

        if (barberoData) {
            localStorage.setItem('barbero', JSON.stringify(barberoData))
            setBarbero(barberoData)
        }
        if (usuarioData) {
            localStorage.setItem('usuario', JSON.stringify(usuarioData))
            setUsuario(usuarioData)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('barbero')
        localStorage.removeItem('usuario')
        setToken(null)
        setBarbero(null)
        setUsuario(null)
    }

    const actualizarBarbero = (barberoData) => {
        localStorage.setItem('barbero', JSON.stringify(barberoData))
        setBarbero(barberoData)
    }

    return (
        <AuthContext.Provider value={{ barbero, usuario, token, login, logout, actualizarBarbero }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
