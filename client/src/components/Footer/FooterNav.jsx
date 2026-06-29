import { Link } from 'react-router-dom'

const NAV_LINKS = [
    { to: '/', label: 'Reservar turno' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/mis-turnos', label: 'Mis turnos' },
]

export default function FooterNav() {
    return (
        <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-5">
                Navegación
            </p>
            <ul className="space-y-3">
                {NAV_LINKS.map(({ to, label }) => (
                    <li key={to}>
                        <Link to={to} className="text-sm text-white/60 hover:text-white transition-colors font-medium" >
                            {label}
                        </Link>
                    </li>
                    ))
                }
            </ul>
        </div>
    )
}