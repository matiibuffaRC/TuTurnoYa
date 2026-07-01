import { Link } from 'react-router-dom'
import NavLinks from './NavLinks'

export default function MobileDrawer({ abierto, links, pathname, barbero, usuario, onClose, onLogout }) {
    const sesionActiva = barbero || usuario
    const nombreCompleto = barbero
        ? `${barbero.nombre} ${barbero.apellido}`
        : usuario?.nombre

    return (
        <>
            <div onClick={onClose} className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${ abierto ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none' }`} />

            <aside className={`montserrat-alternates fixed top-0 left-0 z-50 h-full w-72 bg-slate-900 border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out md:hidden ${ abierto ? 'translate-x-0' : '-translate-x-full' }`}>
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                    <span className="text-white text-lg font-semibold select-none">TuTurnoYa</span>
                    <button onClick={onClose} aria-label="Cerrar menú" className="cursor-pointer p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all">
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <nav className="flex flex-col gap-2 p-4">
                    <NavLinks links={links} pathname={pathname} onLinkClick={onClose} />

                    <div className="border-t border-white/10 mt-2 pt-2">
                        {sesionActiva ? (
                            <>
                                <p className="px-4 py-2 text-xs text-amber-400 font-semibold ">
                                    {nombreCompleto}
                                </p>
                                <button onClick={() => { onLogout(); onClose() }} className="w-full text-left px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <Link to="/admins-panel" onClick={onClose} className="block px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all">
                                Soy peluquero
                            </Link>
                        )}
                    </div>
                </nav>
            </aside>
        </>
    )
}
