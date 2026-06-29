import { useEffect, useState } from 'react'
import { getServicios } from '../../services/servicio.service'
import { getServiciosBarbero, setServiciosBarbero } from '../../services/barbero.service'
import { useAuth } from '../../context/AuthContext'

export default function PanelServicios({ barbero }) {
    const { token } = useAuth()
    const [todos, setTodos] = useState([])
    const [seleccionados, setSeleccionados] = useState(new Set())
    const [guardando, setGuardando] = useState(false)
    const [guardado, setGuardado] = useState(false)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargar = async () => {
            const [todosRes, propiosRes] = await Promise.all([
                getServicios(),
                getServiciosBarbero(barbero.id),
            ])
            setTodos(todosRes || [])
            setSeleccionados(new Set((propiosRes || []).map((s) => s.id)))
            setCargando(false)
        }
        cargar()
    }, [barbero.id])

    const toggle = (id) => {
        setSeleccionados((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
        setGuardado(false)
    }

    const guardar = async () => {
        setGuardando(true)
        const result = await setServiciosBarbero(barbero.id, [...seleccionados], token)
        if (result) setGuardado(true)
        setGuardando(false)
    }

    return (
        <div className="bg-white rounded-2xl border border-[#e8e2d8] mb-5">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0ece4]">
                <div>
                    <h2 className="text-sm font-black text-[#1e2535] uppercase tracking-wider">Mis Servicios</h2>
                    <p className="text-xs text-[#8a8070] mt-0.5">Seleccioná los servicios que ofrecés</p>
                </div>
                <span className="text-xs font-semibold text-[#8a8070]">
                    {seleccionados.size} de {todos.length} activos
                </span>
            </div>

            <div className="px-6 py-5">
                {cargando ? (
                    <p className="text-sm text-[#8a8070] text-center py-6">Cargando servicios...</p>
                ) : (
                    <div className="space-y-2 mb-5">
                        {todos.map((s) => {
                            const activo = seleccionados.has(s.id)
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => toggle(s.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                                        activo
                                            ? 'border-[#1e2535] bg-[#1e2535]'
                                            : 'border-[#e8e2d8] bg-[#faf8f5] hover:border-[#c8c0b0]'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                            activo ? 'border-white bg-white' : 'border-[#c8c0b0] bg-transparent'
                                        }`}>
                                            {activo && (
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1e2535" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-sm font-semibold ${activo ? 'text-white' : 'text-[#1e2535]'}`}>
                                                {s.tipo}
                                            </p>
                                            <p className={`text-xs mt-0.5 ${activo ? 'text-white/60' : 'text-[#8a8070]'}`}>
                                                {s.duracion} min
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-black ${activo ? 'text-amber-300' : 'text-[#1e2535]'}`}>
                                        ${s.precio.toLocaleString('es-AR')}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={guardar}
                        disabled={guardando || cargando}
                        className={`text-xs font-bold px-5 py-2.5 rounded-full transition-colors cursor-pointer disabled:opacity-40 ${
                            guardado
                                ? 'bg-green-600 text-white'
                                : 'bg-[#1e2535] hover:bg-[#2d3748] text-white'
                        }`}
                    >
                        {guardando ? 'Guardando...' : guardado ? 'Guardado ✓' : 'Guardar servicios'}
                    </button>
                </div>
            </div>
        </div>
    )
}
