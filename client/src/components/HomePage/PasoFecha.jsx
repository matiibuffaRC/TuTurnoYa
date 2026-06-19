import { useState, useEffect } from 'react'

const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
}

const DIAS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const DIAS_LABORABLES = [2, 3, 4, 5, 6]

function getFecha(base, delta) {
    const d = new Date(base + 'T00:00:00')
    d.setDate(d.getDate() + delta)
    return {
        iso: d.toLocaleDateString('en-CA'),
        dia: DIAS_ES[d.getDay()],
        num: d.getDate(),
        mes: MESES_ES[d.getMonth()],
        laborable: DIAS_LABORABLES.includes(d.getDay()),
        pasado: delta < 0,
    }
}

export default function PasoFecha({ form, horarios, onFecha, onHora, onAtras, onSiguiente }) {
    const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })
    const ahora = new Date()
    const ahoraMin = ahora.getHours() * 60 + ahora.getMinutes()

    // offset 0 = hoy en la primera posición
    const [offset, setOffset] = useState(0)

    const diasVisibles = [0, 1, 2, 3].map(i => getFecha(hoy, offset + i))

    const horariosFiltrados = form.fecha === hoy
        ? horarios.filter(h => toMinutes(h) > ahoraMin)
        : horarios

    const handleFecha = (iso, pasado) => {
        if (pasado) return
        onFecha(iso)
        if (form.hora) onHora('')
    }

    return (
        <div className="space-y-7">
            <div>
                <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-3">Fecha</p>

                <div className="flex items-center gap-2">
                {/* Flecha izquierda */}
                    <button onClick={() => setOffset(o => o - 1)} aria-label="Días anteriores" className="shrink-0 w-9 h-9 rounded-xl border border-[#e8e2d8] bg-[#faf8f5] flex items-center justify-center text-[#8a8070] hover:border-[#c8c0b0] hover:text-[#1e2535] hover:bg-white transition-all cursor-pointer">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    {/* Grilla de 4 días */}
                    <div className="flex-1 grid grid-cols-4 gap-2 lg:px-10">
                        {diasVisibles.map(({ iso, dia, num, mes, laborable, pasado }) => {
                        const esHoy = iso === hoy
                        const seleccionada = form.fecha === iso
                        return (
                            <button
                                key={iso}
                                onClick={() => handleFecha(iso, pasado)}
                                disabled={pasado}
                                aria-label={`${esHoy ? 'Hoy' : dia} ${num} de ${mes}${pasado ? ' (fecha pasada)' : ''}${laborable && !pasado ? ' · día laborable' : ''}`}
                                className={`flex flex-col items-center justify-center py-2.5  rounded-xl border text-sm transition-all duration-200
                                    ${pasado
                                    ? 'border-[#e8e2d8] bg-[#faf8f5] opacity-35 cursor-not-allowed'
                                    : seleccionada
                                        ? 'border-[#1e2535] bg-[#1e2535] cursor-pointer'
                                        : 'border-[#e8e2d8] bg-[#faf8f5] hover:border-[#c8c0b0] hover:bg-white cursor-pointer'
                                    }`}
                                >
                                <span className={`text-[10px] font-bold tracking-wider uppercase leading-none mb-1 ${seleccionada ? 'text-[#7a8499]' : 'text-[#a09880]'}`}>
                                    {esHoy ? 'Hoy' : dia}
                                </span>
                                <span className={`text-base font-bold leading-none ${seleccionada ? 'text-white' : 'text-[#1e2535]'}`}>
                                    {num}
                                </span>
                                <span className={`text-[10px] mt-1 leading-none ${seleccionada ? 'text-[#7a8499]' : 'text-[#a09880]'}`}>
                                    {mes}
                                </span>
                                {laborable && !pasado && (
                                    <span
                                    aria-hidden="true"
                                    className={`w-1.5 h-1.5 rounded-full mt-1.5 ${seleccionada ? 'bg-[#6ee7a0]' : 'bg-[#4ade80]'}`}
                                    />
                                )}
                            </button>
                        )
                        })}
                    </div>

                    {/* Flecha derecha */}
                    <button
                        onClick={() => setOffset(o => o + 1)}
                        aria-label="Días siguientes"
                        className="shrink-0 w-9 h-9 rounded-xl border border-[#e8e2d8] bg-[#faf8f5] flex items-center justify-center text-[#8a8070] hover:border-[#c8c0b0] hover:text-[#1e2535] hover:bg-white transition-all cursor-pointer"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                {/* Leyenda */}
                <div className="flex items-center gap-1.5 mt-2.5 ml-11">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" aria-hidden="true" />
                    <span className="text-[10px] text-[#a09880] font-medium">Día laborable</span>
                </div>
            </div>

            {form.fecha && horariosFiltrados.length > 0 && (
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-3">Horario disponible</p>
                    <div className="grid grid-cols-4 gap-2">
                        {horariosFiltrados.map((h) => (
                        <button key={h} onClick={() => onHora(h)} className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            form.hora === h
                                ? 'border-[#1e2535] bg-[#1e2535] text-white'
                                : 'border-[#e8e2d8] bg-[#faf8f5] text-[#1e2535] hover:border-[#c8c0b0] hover:bg-white'
                            }`}>
                            {h}
                        </button>
                        ))}
                    </div>
                </div>
            )}

            {form.fecha && horariosFiltrados.length === 0 && (
                <div className="py-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#f0ece4] flex items-center justify-center mx-auto mb-3">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a09880" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </div>
                    <p className="text-sm text-[#8a8070] font-medium">Sin horarios disponibles para este día</p>
                    <p className="text-xs text-[#a09880] mt-1">Probá con otra fecha</p>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={onAtras}
                    className="cursor-pointer flex-1 border border-[#e8e2d8] text-[#8a8070] py-3.5 rounded-xl font-semibold text-sm hover:border-[#c8c0b0] hover:text-[#1e25    35] transition-colors">
                    Atrás
                </button>
                <button
                    disabled={!form.fecha || !form.hora}
                    onClick={onSiguiente    }
                    className="cursor-pointer flex-1 bg-[#1e2535] text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-30 hover:bg-[#2d3748] transition-colors">
                    Continuar
                </button>
            </div>
        </div>
    )
}