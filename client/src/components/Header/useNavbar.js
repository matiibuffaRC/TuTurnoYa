import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LINKS_CLIENTE, LINKS_PELUQUERO } from './navConfig'

export function useNavbar() {
    const navigate = useNavigate()
    const { barbero, logout } = useAuth()
    const [drawerAbierto, setDrawerAbierto] = useState(false)

    // Validamos si está registrado un barbero (En el SesionStorage) para ver que links mostramos
    const links = barbero ? LINKS_PELUQUERO : LINKS_CLIENTE

    const cerrarSesion = () => {
        logout()
        navigate('/')
    }

    const abrirDrawer = () => setDrawerAbierto(true)
    const cerrarDrawer = () => setDrawerAbierto(false)
    const toggleDrawer = () => setDrawerAbierto((prev) => !prev)

    return { barbero, links, drawerAbierto, cerrarSesion, abrirDrawer, cerrarDrawer, toggleDrawer }
}
