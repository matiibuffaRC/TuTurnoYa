import { Link, useLocation } from 'react-router-dom'
import { useNavbar } from './useNavbar'
import NavLinks from './NavLinks'
import UserSection from './UserSection'
import HamburgerButton from './HamburgerButton'
import MobileDrawer from './MobileDrawer'

export default function Navbar() {
    const { pathname } = useLocation()

    const { barbero, usuario, links, drawerAbierto, cerrarSesion, cerrarDrawer, toggleDrawer, } = useNavbar()

    return (
        <>
            <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/5 montserrat-alternates">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to={barbero || usuario ? '/dashboard' : '/'} className="text-white text-xl font-bold tracking-tight transition-opacity duration-300 hover:opacity-80" >
                        TuTurnoYa
                    </Link>

                    <div className="hidden md:flex items-center gap-3">
                        <NavLinks links={links} pathname={pathname} />
                        <UserSection barbero={barbero} usuario={usuario} onLogout={cerrarSesion} />
                    </div>

                    <HamburgerButton abierto={drawerAbierto} onClick={toggleDrawer} />
                </div>
            </nav>

            <MobileDrawer abierto={drawerAbierto} links={links} pathname={pathname} barbero={barbero} usuario={usuario} onClose={cerrarDrawer} onLogout={cerrarSesion} />
        </>
    )
}