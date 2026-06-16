import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const hoy = new Date().toISOString().split('T')[0]

export default function Dashboard() {
  const navigate = useNavigate()
  const [barbero, setBarbero] = useState(null)
  const [turnos, setTurnos] = useState([])
  const [fecha, setFecha] = useState(hoy)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const data = localStorage.getItem('barbero')
    if (!token || !data) { navigate('/admins-panel'); return }
    const b = JSON.parse(data)
    setBarbero(b)
    fetchTurnos(b.id, hoy, token)
  }, [navigate])

  const fetchTurnos = async (barberoId, fecha, token) => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3001/turnos/barbero/${barberoId}?fecha=${fecha}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setTurnos(Array.isArray(data) ? data : [])
    } catch {
      setTurnos([])
    }
    setLoading(false)
  }

  const handleFecha = (f) => {
    setFecha(f)
    fetchTurnos(barbero.id, f, localStorage.getItem('token'))
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('barbero')
    navigate('/admins-panel')
  }

  if (!barbero) return null

  const turnosActivos = turnos.filter(t => t.estado === 'activo')

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Hola, {barbero.nombre} 👋
            </h1>
            <p className="text-slate-500 mt-1">{barbero.sucursal?.nombre} · {barbero.email}</p>
          </div>
          <button onClick={cerrarSesion} className="text-sm text-slate-500 hover:text-red-500 border border-slate-200 hover:border-red-300 px-4 py-2 rounded-lg transition-colors cursor-pointer">
            Cerrar sesión
          </button>
        </div>

        {/* Info sucursal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Sucursal', value: barbero.sucursal?.nombre || '—', icon: '📍' },
            { label: 'Dirección', value: barbero.sucursal?.direccion || '—', icon: '🗺' },
            { label: 'Horario', value: `${barbero.sucursal?.horarioApertura} a ${barbero.sucursal?.horarioCierre}`, icon: '🕐' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5">
              <p className="text-2xl mb-2">{item.icon}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{item.label}</p>
              <p className="text-slate-800 font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Agenda */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Agenda</h2>
            <input
              type="date"
              value={fecha}
              onChange={(e) => handleFecha(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-slate-400"
            />
          </div>

          {loading && (
            <p className="text-center text-slate-400 py-8">Cargando turnos...</p>
          )}

          {!loading && turnosActivos.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">📅</p>
              <p className="font-semibold">No tenés turnos para este día.</p>
            </div>
          )}

          {!loading && turnosActivos.length > 0 && (
            <div className="space-y-3">
              {turnosActivos
                .sort((a, b) => a.hora.localeCompare(b.hora))
                .map((t) => (
                  <div key={t.id} className="flex items-center gap-4 px-4 py-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="w-16 text-center">
                      <p className="text-lg font-black text-slate-800">{t.hora}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        {t.cliente.nombre} {t.cliente.apellido}
                      </p>
                      <p className="text-sm text-slate-500">{t.servicio.tipo} · {t.servicio.duracion} min</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">${t.servicio.precio.toLocaleString('es-AR')}</p>
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                        Confirmado
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
