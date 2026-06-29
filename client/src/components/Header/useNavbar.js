import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LINKS_CLIENTE, LINKS_PELUQUERO, LINKS_ADMIN } from './navConfig'

export function useNavbar() {
    const navigate = useNavigate()
    const { barbero, usuario, logout } = useAuth()
    const [drawerAbierto, setDrawerAbierto] = useState(false)

    let links
    if (barbero) {
        links = LINKS_PELUQUERO
    } else if (usuario) {
        links = LINKS_ADMIN
    } else {
        links = LINKS_CLIENTE
    }

    const cerrarSesion = () => {
        logout()
        navigate('/')
    }

    const abrirDrawer = () => setDrawerAbierto(true)
    const cerrarDrawer = () => setDrawerAbierto(false)
    const toggleDrawer = () => setDrawerAbierto((prev) => !prev)

    return { barbero, usuario, links, drawerAbierto, cerrarSesion, abrirDrawer, cerrarDrawer, toggleDrawer }
}
