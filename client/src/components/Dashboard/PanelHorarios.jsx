import { useState } from 'react'
import { updateHorarios } from '../../api'

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const generarSlots = (apertura, cierre) => {
  const slots = []
  let cur = toMinutes(apertura)
  const end = toMinutes(cierre)
  while (cur < end) {
    const h = String(Math.floor(cur / 60)).padStart(2, '0')
    const m = String(cur % 60).padStart(2, '0')
    slots.push(`${h}:${m}`)
    cur += 30
  }
  return slots
}

export default function PanelHorarios({ barbero, onActualizar }) {
  const sucursal = barbero.sucursal
  const todosSlots = generarSlots(sucursal.horarioApertura, sucursal.horarioCierre)
  const iniciales = barbero.horariosHabilitados
    ? JSON.parse(barbero.horariosHabilitados)
    : todosSlots

  const [seleccionados, setSeleccionados] = useState(new Set(iniciales))
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  const toggle = (slot) => {
    setSeleccionados(prev => {
      const next = new Set(prev)
      next.has(slot) ? next.delete(slot) : next.add(slot)
      return next
    })
    setGuardado(false)
  }

  const seleccionarTodos = () => {
    setSeleccionados(new Set(todosSlots))
    setGuardado(false)
  }

  const limpiarTodos = () => {
    setSeleccionados(new Set())
    setGuardado(false)
  }

  const guardar = async () => {
    setGuardando(true)
    const token = localStorage.getItem('token')
    const horarios = todosSlots.filter(s => seleccionados.has(s))
    const updated = await updateHorarios(barbero.id, horarios, token)
    if (!updated.error) {
      const newBarbero = { ...barbero, horariosHabilitados: JSON.stringify(horarios) }
      localStorage.setItem('barbero', JSON.stringify(newBarbero))
      onActualizar(newBarbero)
      setGuardado(true)
    }
    setGuardando(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d8] mb-5">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ece4]">
        <div>
          <h2 className="text-sm font-black text-[#1e2535] uppercase tracking-wider">Mis horarios de trabajo</h2>
          <p className="text-xs text-[#8a8070] mt-0.5">
            Horario de la sucursal: {sucursal.horarioApertura} – {sucursal.horarioCierre}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={seleccionarTodos} className="text-xs text-[#8a8070] hover:text-[#1e2535] transition-colors cursor-pointer">
            Todos
          </button>
          <span className="text-[#e8e2d8]">·</span>
          <button onClick={limpiarTodos} className="text-xs text-[#8a8070] hover:text-[#1e2535] transition-colors cursor-pointer">
            Ninguno
          </button>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-5">
          {todosSlots.map((slot) => {
            const activo = seleccionados.has(slot)
            return (
              <button
                key={slot}
                onClick={() => toggle(slot)}
                className={`py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activo
                    ? 'bg-[#1e2535] border-[#1e2535] text-white'
                    : 'bg-[#faf8f5] border-[#e8e2d8] text-[#a09880] hover:border-[#c8c0b0]'
                }`}
              >
                {slot}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-[#8a8070]">
            {seleccionados.size} de {todosSlots.length} horarios habilitados
          </p>
          <button
            onClick={guardar}
            disabled={guardando || seleccionados.size === 0}
            className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-40 ${
              guardado
                ? 'bg-green-600 text-white'
                : 'bg-[#1e2535] hover:bg-[#2d3748] text-white'
            }`}
          >
            {guardando ? 'Guardando...' : guardado ? 'Guardado' : 'Guardar horarios'}
          </button>
        </div>
      </div>
    </div>
  )
}
