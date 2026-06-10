import { useState } from 'react'
import { getTurnosPorEmail, cancelarTurno } from '../api'

export default function MisTurnos() {
  const [email, setEmail] = useState('')
  const [turnos, setTurnos] = useState([])
  const [buscado, setBuscado] = useState(false)
  const [loading, setLoading] = useState(false)

  const buscar = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = await getTurnosPorEmail(email)
    setTurnos(data)
    setBuscado(true)
    setLoading(false)
  }

  const cancelar = async (id) => {
    if (!confirm('¿Cancelar este turno?')) return
    await cancelarTurno(id)
    setTurnos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Mis turnos</h1>
      <p className="text-slate-500 mb-8">Ingresá tu email para ver y gestionar tus turnos.</p>

      <form onSubmit={buscar} className="flex gap-3 mb-8">
        <input type="email" required placeholder="tu@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400" />
        <button type="submit"
          className="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors">
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {buscado && turnos.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-lg">No tenés turnos activos.</p>
        </div>
      )}

      <div className="grid gap-4">
        {turnos.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-800">{t.fecha} — {t.hora}</p>
                <p className="text-slate-600"><span className="font-medium">Barbero:</span> {t.barbero.nombre} {t.barbero.apellido}</p>
                <p className="text-slate-600"><span className="font-medium">Sucursal:</span> {t.barbero.sucursal.nombre}</p>
                <p className="text-slate-600"><span className="font-medium">Dirección:</span> {t.barbero.sucursal.direccion}</p>
                <p className="text-slate-600">
                  <span className="font-medium">Servicio:</span> {t.servicio.tipo} — ${t.servicio.precio.toLocaleString('es-AR')} ({t.servicio.duracion} min)
                </p>
              </div>
              <button onClick={() => cancelar(t.id)}
                className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
