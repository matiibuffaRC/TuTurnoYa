import { useState } from 'react'
import { InputField } from '../components/AdminsPanel/InputField'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminsPanel = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Credenciales inválidas'); setIsLoading(false); return }
      login(data.token, data.barbero)
      navigate('/dashboard')
    } catch {
      setError('No se pudo conectar con el servidor')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#f7f4ef] p-4 md:p-10 montserrat-alternates">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#e8e2d8] shadow-[0_20px_60px_-10px_rgba(30,37,53,0.10)] overflow-hidden grid md:grid-cols-12 min-h-[560px]">

        {/* Izquierda */}
        <div className="hidden md:flex md:col-span-6 bg-[#1e2535] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(180,130,50,0.12)_0%,_transparent_55%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(180,130,50,0.07)_0%,_transparent_55%)] pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded-full">
              Portal barberos
            </span>
          </div>

          <div className="relative z-10 space-y-6 my-auto">
            <h3 className="text-3xl font-black leading-tight text-white">
              Peluqueria
              <span className="block text-amber-400">Tu Turno Ya.</span>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Gestioná tu agenda, mirá tus turnos del día y abrí o cerrá tus reservas cuando quieras.
            </p>

            <div className="space-y-2 pt-2">
              {[
                { num: '+14', label: 'Barberos usando TuTurnoYa' },
                { num: '+3', label: 'Años gestionando' },
              ].map(({ num, label }) => (
                <div key={label} className="flex items-center gap-4 bg-white/4 border border-white/10 rounded-2xl px-4 py-3 hover:border-white/20 transition-colors">
                  <span className="text-lg font-black text-amber-400">{num}</span>
                  <p className="text-xs text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/30 relative z-10">
            © {new Date().getFullYear()} TuTurnoYa
          </p>
        </div>

        {/* Derecha */}
        <div className="col-span-12 md:col-span-6 p-8 sm:p-12 md:p-14 flex flex-col justify-center">

          <div className="block md:hidden text-center mb-8">
            <h2 className="text-4xl font-black text-[#1e2535] tracking-tight">TuTurnoYa</h2>
            <p className="text-sm text-[#8a8070] mt-1 font-medium uppercase tracking-widest">Portal Peluqueros</p>
          </div>

          <div className="hidden md:block mb-8">
            <h2 className="text-4xl font-black text-[#1e2535] tracking-tight">Bienvenido</h2>
            <p className="text-sm text-[#8a8070] mt-2">Ingresá tus credenciales para acceder a tu agenda.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <p className="text-xs text-red-700 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <InputField
                label="Correo electrónico"
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="juan@peluqueria.com"
              />
              <InputField
                label="Contraseña"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#1e2535] hover:bg-[#2d3748] text-white font-semibold text-sm py-3.5 px-4 rounded-xl transition-colors duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Ingresando...
                </span>
              ) : (
                'Ingresar al panel'
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default AdminsPanel
