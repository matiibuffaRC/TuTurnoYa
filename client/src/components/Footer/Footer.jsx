import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1e2535] text-white montserrat-alternates">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(180,130,50,0.08)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(180,130,50,0.05)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-12">

          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-4">TuTurnoYa</p>
            <h3 className="text-2xl font-black tracking-tight leading-tight">
              Gestioná tu salón
              <span className="block text-amber-400">sin complicaciones</span>
            </h3>
            <p className="text-white/50 text-sm mt-4 leading-relaxed">
              Plataforma diseñada para peluquerías y barberías que quieren optimizar reservas, clientes y horarios.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-5">Navegación</p>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Reservar turno' },
                { to: '/servicios', label: 'Servicios' },
                { to: '/mis-turnos', label: 'Mis turnos' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/60 hover:text-white transition-colors font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-5">En números</p>
            <div className="space-y-3">
              {[
                { value: '+14', label: 'Peluquerías activas' },
                { value: '+3', label: 'Años en el mercado' },
              ].map(({ value, label }) => (
                <div key={label} className="border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-colors">
                  <p className="text-xl font-black text-white">{value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="h-px bg-white/10 my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-white/40">
            © {new Date().getFullYear()} TuTurnoYa. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            {['Términos', 'Privacidad', 'Contacto'].map((label) => (
              <a key={label} href="#" className="text-white/40 hover:text-white/80 transition-colors font-medium">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
