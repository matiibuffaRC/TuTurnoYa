import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toggleAgenda } from '../api'
import { useAuth } from '../context/AuthContext'
import PanelHorarios from '../components/Dashboard/PanelHorarios'

const hoy = new Date().toISOString().split('T')[0]

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)

const IconUnlock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a9 9 0 0114 7.46"/>
  </svg>
)

export default function Dashboard() {
  const navigate = useNavigate()
  const { barbero, token, actualizarBarbero, logout } = useAuth()
  const [turnos, setTurnos] = useState([])
  const [fecha, setFecha] = useState(hoy)
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    if (!token || !barbero) { navigate('/admins-panel'); return }
    fetchTurnos(barbero.id, hoy, token)
  }, [navigate, token, barbero])

  const fetchTurnos = async (barberoId, f, tok) => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3001/turnos/barbero/${barberoId}?fecha=${f}`,
        { headers: { Authorization: `Bearer ${tok}` } }
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
    fetchTurnos(barbero.id, f, token)
  }

  const handleToggleAgenda = async () => {
    setToggling(true)
    const updated = await toggleAgenda(barbero.id, token)
    if (!updated.error) {
      actualizarBarbero({ ...barbero, agendaAbierta: updated.agendaAbierta })
    }
    setToggling(false)
  }

  const cerrarSesion = () => {
    logout()
    navigate('/admins-panel')
  }

  if (!barbero) return null

  const turnosActivos = turnos.filter(t => t.estado === 'activo')
  const agendaAbierta = barbero.agendaAbierta !== false

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f7f4ef] montserrat-alternates p-5 md:p-10">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700 mb-1">Panel del barbero</p>
            <h1 className="text-2xl font-black text-[#1e2535]">Hola, {barbero.nombre}</h1>
            <p className="text-sm text-[#8a8070] mt-0.5">{barbero.sucursal?.nombre} · {barbero.email}</p>
          </div>
          <button
            onClick={cerrarSesion}
            className="text-xs font-semibold text-[#8a8070] border border-[#e8e2d8] hover:border-[#c8c0b0] hover:text-[#1e2535] px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Salir
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Sucursal', value: barbero.sucursal?.nombre || '—' },
            { label: 'Dirección', value: barbero.sucursal?.direccion || '—' },
            { label: 'Horario', value: `${barbero.sucursal?.horarioApertura} – ${barbero.sucursal?.horarioCierre}` },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-[#e8e2d8] px-5 py-4">
              <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-1">{item.label}</p>
              <p className="text-sm font-bold text-[#1e2535]">{item.value}</p>
            </div>
          ))}
        </div>

        {barbero.sucursal && (
          <PanelHorarios barbero={barbero} onActualizar={actualizarBarbero} />
        )}

        <div className={`mb-5 rounded-full border px-5 py-4 flex items-center justify-between gap-4 ${
          agendaAbierta ? 'bg-white border-[#e8e2d8]' : 'bg-[#1e2535] border-[#1e2535]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              agendaAbierta ? 'bg-green-50 text-green-700' : 'bg-white/10 text-amber-400'
            }`}>
              {agendaAbierta ? <IconUnlock /> : <IconLock />}
            </div>
            <div>
              <p className={`text-sm font-bold ${agendaAbierta ? 'text-[#1e2535]' : 'text-white'}`}>
                {agendaAbierta ? 'Agenda abierta' : 'Agenda cerrada'}
              </p>
              <p className={`text-xs mt-0.5 ${agendaAbierta ? 'text-[#8a8070]' : 'text-white/60'}`}>
                {agendaAbierta
                  ? 'Los clientes pueden reservar turnos contigo.'
                  : 'No se aceptan nuevas reservas.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleAgenda}
            disabled={toggling}
            className={`text-xs font-bold px-4 py-2.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap ${
              agendaAbierta
                ? 'bg-[#1e2535] text-white hover:bg-[#2d3748]'
                : 'bg-white text-[#1e2535] hover:bg-[#f7f4ef]'
            }`}
          >
            {toggling ? '...' : agendaAbierta ? 'Cerrar agenda' : 'Abrir agenda'}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e2d8]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ece4]">
            <h2 className="text-sm font-black text-[#1e2535] uppercase tracking-wider">Agenda</h2>
            <input
              type="date"
              value={fecha}
              onChange={(e) => handleFecha(e.target.value)}
              className="border border-[#e8e2d8] bg-[#faf8f5] rounded-xl px-3 py-2 text-xs font-semibold text-[#1e2535] focus:outline-none focus:border-[#1e2535] transition-all cursor-pointer"
            />
          </div>

          {loading && (
            <div className="py-16 text-center text-sm text-[#8a8070]">Cargando turnos...</div>
          )}

          {!loading && turnosActivos.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-[#f0ece4] flex items-center justify-center mx-auto mb-4 text-[#a09880]">
                <IconCalendar />
              </div>
              <p className="text-sm font-semibold text-[#1e2535]">Sin turnos para este día</p>
              <p className="text-xs text-[#8a8070] mt-1">Seleccioná otra fecha para ver tu agenda.</p>
            </div>
          )}

          {!loading && turnosActivos.length > 0 && (
            <div className="divide-y divide-[#f0ece4]">
              {turnosActivos
                .sort((a, b) => a.hora.localeCompare(b.hora))
                .map((t) => (
                  <div key={t.id} className="flex items-center gap-5 px-6 py-4 hover:bg-[#faf8f5] transition-colors">
                    <div className="w-14 shrink-0">
                      <p className="text-base font-black text-[#1e2535]">{t.hora}</p>
                    </div>
                    <div className="w-px h-10 bg-[#e8e2d8] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1e2535] truncate">
                        {t.cliente.nombre} {t.cliente.apellido}
                      </p>
                      <p className="text-xs text-[#8a8070] mt-0.5">{t.servicio.tipo} · {t.servicio.duracion} min</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-sm text-[#1e2535]">${t.servicio.precio.toLocaleString('es-AR')}</p>
                      <span className="text-xs text-green-700 font-semibold bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
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
