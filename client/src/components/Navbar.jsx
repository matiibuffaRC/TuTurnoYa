import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const link = (to, label) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        pathname === to
          ? 'bg-white text-slate-800'
          : 'text-white hover:bg-white/20'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-slate-800 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-white text-xl font-bold tracking-tight">
          ✂ TuTurnoYa
        </Link>
        <div className="flex gap-2">
          {link('/', 'Reservar turno')}
          {link('/servicios', 'Servicios')}
          {link('/mis-turnos', 'Mis turnos')}
        </div>
      </div>
    </nav>
  )
}
