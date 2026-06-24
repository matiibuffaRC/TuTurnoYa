import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LINKS_CLIENTE = [
    { to: '/', label: 'Reservar turno' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/mis-turnos', label: 'Mis turnos' },
]

const LINKS_PELUQUERO = [
    { to: '/dashboard', label: 'Mi agenda' },
]

export default function Navbar() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { barbero, logout } = useAuth()
    const [abierto, setAbierto] = useState(false)

    const links = barbero ? LINKS_PELUQUERO : LINKS_CLIENTE

    const cerrarSesion = () => {
        logout()
        navigate('/')
    }

    const toggleMenu = () => setAbierto((prev) => !prev)
    const cerrarMenu = () => setAbierto(false)

    return (
        <>
            <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/5 montserrat-alternates">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to={barbero ? '/dashboard' : '/'} className="text-white text-xl font-bold tracking-tight transition-opacity duration-300 hover:opacity-80">
                        TuTurnoYa
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map(({ to, label }) => (
                            <Link key={to} to={to} className={`group relative py-1 text-sm font-medium transition-colors duration-300 ${ pathname === to ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                                {label}
                                <span className={`absolute left-0 right-0 bottom-0 h-px bg-white/90 transition-all duration-300 ${ pathname === to ? 'opacity-100' : 'opacity-0 group-hover:opacity-100' }`}/>
                            </Link>
                        ))}

                        {barbero ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-amber-400 font-semibold">{barbero.nombre}</span>
                                <button onClick={cerrarSesion} className="text-xs text-white/50 hover:text-white/90 transition-colors cursor-pointer">
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link to="/admins-panel" className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full font-medium transition-colors">
                                Soy peluquero
                            </Link>
                        )}
                    </div>

                    {/* Botón hamburguesa */}
                    <button onClick={toggleMenu} aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={abierto} className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg cursor-pointer transition-colors">
                        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${ abierto ? 'translate-y-0.5 rotate-45' : '-translate-y-1' }`}/>
                        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${ abierto ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100' }`}/>
                        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${ abierto ? '-translate-y-0.5 -rotate-45' : 'translate-y-1' }`}/>
                    </button>
                </div>
            </nav>

            {/* Overlay */}
            <div onClick={cerrarMenu} className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${ abierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none' }`} />

            {/* Drawer */}
            <aside className={`montserrat-alternates fixed top-0 left-0 z-50 h-full w-72 bg-slate-900 border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out md:hidden ${ abierto ? 'translate-x-0' : '-translate-x-full' }`}>
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                    <span className="text-white text-lg font-semibold select-none">TuTurnoYa</span>
                    <button onClick={cerrarMenu} aria-label="Cerrar menú" className="cursor-pointer p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all">
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <nav className="flex flex-col gap-2 p-4">
                    {links.map(({ to, label }) => (
                        <Link key={to} to={to} onClick={cerrarMenu}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${ pathname === to ? 'bg-white/10 text-white border border-white/10' : 'text-white/70 hover:text-white hover:bg-white/5' }`}>
                            {label}
                        </Link>
                    ))}
                    <div className="border-t border-white/10 mt-2 pt-2">
                        {barbero ? (
                            <>
                                <p className="px-4 py-2 text-xs text-amber-400 font-semibold">{barbero.nombre} {barbero.apellido}</p>
                                <button onClick={() => { cerrarSesion(); cerrarMenu() }} className="w-full text-left px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <Link to="/admins-panel" onClick={cerrarMenu} className="block px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all">
                                Soy peluquero
                            </Link>
                        )}
                    </div>
                </nav>
            </aside>
        </>
    )
}
