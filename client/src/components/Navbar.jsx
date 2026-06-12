import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LINKS = [
    { to: '/', label: 'Reservar turno' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/mis-turnos', label: 'Mis turnos' },
]

export default function Navbar() {
    const { pathname } = useLocation()

    const [abierto, setAbierto] = useState(false)

    const toggleMenu = () => setAbierto((prev) => !prev)
    const cerrarMenu = () => setAbierto(false)

    useEffect(() => {
        document.body.style.overflow = abierto ? 'hidden' : ''

        return () => {
            document.body.style.overflow = ''
        }
    }, [abierto])

    return (
        <>
            <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="text-white text-xl font-bold tracking-tight transition-opacity duration-300 hover:opacity-80">
                        TuTurnoYa
                    </Link>

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {LINKS.map(({ to, label }) => (
                            <Link key={to} to={to} className={`group relative py-1 text-sm font-medium transition-colors duration-300 ${ pathname === to ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                                {label}
                                <span className={`absolute left-0 right-0 bottom-0 h-px bg-white/90 transition-all duration-300 ${ pathname === to ? 'opacity-100' : 'opacity-0 group-hover:opacity-100' }`}/>
                            </Link>
                        ))}
                    </div>

                    {/* Botón hamburguesa */}
                    <button onClick={toggleMenu} aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={abierto} className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors">
                        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${ abierto ? 'translate-y-1 rotate-45' : '-translate-y-1' }`}/>
                        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${ abierto ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100' }`}/>
                        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${ abierto ? '-translate-y-1 -rotate-45' : 'translate-y-1' }`}/>
                    </button>
                </div>
            </nav>

            {/* Overlay */}
            <div
                onClick={cerrarMenu}
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                    abierto
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Drawer desde la izquierda */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 bg-slate-900 border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
                    abierto
                        ? 'translate-x-0'
                        : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                    <span className="text-white text-lg font-semibold">
                        TuTurnoYa
                    </span>

                    <button onClick={cerrarMenu} aria-label="Cerrar menú" className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all" >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" >
                            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Links drawer */}
                <nav className="flex flex-col gap-2 p-4">
                    {LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={cerrarMenu}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                pathname === to
                                    ? 'bg-white/10 text-white border border-white/10'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    )
}