import { Link } from 'react-router-dom'

export default function UserSection({ barbero, usuario, onLogout }) {
    const sesionActiva = barbero || usuario
    const nombre = barbero ? barbero.nombre : usuario?.nombre

    if (sesionActiva) {
        return (
            <div className="flex items-center gap-5 pr-5">
                <div className="px-3 py-1 rounded-full bg-white/10 text-amber-400 text-sm font-semibold select-none">
                    {nombre}
                </div>

                <button onClick={onLogout} className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer" >
                    Salir
                </button>
            </div>
        )
    }

    return (
        <Link to="/admins-panel" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors" >
            Soy peluquero
        </Link>
    )
}