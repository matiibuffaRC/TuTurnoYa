import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#262E41] text-white">
            {/* Efectos de fondo */}
            <div className="absolute -top-20 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
                <div className="grid md:grid-cols-3 gap-10">

                    {/* Marca */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-amber-300 uppercase mb-4">
                            ✂ TuTurnoYa
                        </div>

                        <h3 className="text-3xl font-black tracking-tight">
                            Gestioná tu salón
                            <span className="block text-amber-400">
                                sin complicaciones
                            </span>
                        </h3>

                        <p className="text-slate-300 text-sm mt-4 max-w-sm">
                            Plataforma diseñada para peluquerías y barberías que
                            quieren optimizar reservas, clientes y horarios.
                        </p>
                    </div>

                    {/* Navegación */}
                    <div>
                        <h4 className="font-bold uppercase tracking-wider text-sm mb-4 text-amber-300">
                            Navegación
                        </h4>

                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-slate-300 hover:text-white transition-colors"
                                >
                                    Reservar turno
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/servicios"
                                    className="text-slate-300 hover:text-white transition-colors"
                                >
                                    Servicios
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/mis-turnos"
                                    className="text-slate-300 hover:text-white transition-colors"
                                >
                                    Mis turnos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Estadísticas */}
                    <div className="space-y-3">
                        <h4 className="font-bold uppercase tracking-wider text-sm text-amber-300">
                            TuTurnoYa
                        </h4>

                        <div className="p-3 hover:translate-x-1 transition-transform border border-white/10 rounded-2xl">
                            <p className="text-xs text-slate-400">
                                Peluquerías trabajando con nosotros
                            </p>
                            <p className="text-xl font-black">
                                +14
                            </p>
                        </div>

                        <div className="p-3 hover:translate-x-1 transition-transform border border-white/10 rounded-2xl">
                            <p className="text-xs text-slate-400">
                                Años acompañando negocios
                            </p>
                            <p className="text-xl font-black">
                                +3
                            </p>
                        </div>
                    </div>
                </div>

                {/* Separador */}
                <div className="h-px bg-white/10 my-8"></div>

                {/* Footer inferior */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                    <p className="text-slate-400">
                        © {new Date().getFullYear()} TuTurnoYa. Todos los derechos reservados.
                    </p>

                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            Términos
                        </a>

                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            Privacidad
                        </a>

                        <a
                            href="#"
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            Contacto
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}