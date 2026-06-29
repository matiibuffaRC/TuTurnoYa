import { Link } from 'react-router-dom'

export default function UserSection({ barbero, usuario, onLogout }) {
    const sesionActiva = barbero || usuario
    const nombre = barbero ? barbero.nombre : usuario?.nombre

    if (sesionActiva) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-amber-400 font-semibold">{nombre}</span>
                <button onClick={onLogout} className="text-xs text-white/50 hover:text-white/90 transition-colors cursor-pointer">
                    Salir
                </button>
            </div>
        )
    }

    return (
        <Link to="/admins-panel" className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full font-medium transition-colors">
            Soy peluquero
        </Link>
    )
}
