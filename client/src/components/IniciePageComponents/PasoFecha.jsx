import { useState } from 'react'

// Necesitamos esta función para transformar los horarios y trabajarlos mejor
const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
}

const DIAS_LABORABLES = [2, 3, 4, 5, 6] // Mar a Sáb (Consideramos que no abren los lunes)

// Necesitamos obtener la hora
function hoyArgentina() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })
}

function esDiaLaborable(fecha) {
    return DIAS_LABORABLES.includes(new Date(fecha + 'T00:00:00').getDay())
}

export default function PasoFecha({ form, horarios, onFecha, onHora, onAtras, onSiguiente }) {
    const hoy = hoyArgentina()
    const ahoraArgentina = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit' })
    const ahoraMin = Number(ahoraArgentina.split(':')[0]) * 60 + Number(ahoraArgentina.split(':')[1])

    const [errorDia, setErrorDia] = useState('')

    // Filtramos los horarios de acuerdo a la fecha que el cliente elija 
    const horariosFiltrados = form.fecha === hoy
        ? horarios.filter(h => toMinutes(h) > ahoraMin) //Filtramos las horas que ya pasaron así no se reserva un horario que ya pasó
        : horarios

    function handleFecha(fecha) {
        if (!fecha) return
        if (!esDiaLaborable(fecha)) {
            setErrorDia('Solo podés reservar de martes a sábado.')
            onFecha('')
            onHora('')
            return
        }
        setErrorDia('')
        onFecha(fecha)
        onHora('')
    }

    return (
        <div className="space-y-5">
            <div>
                <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-1 md:mb-2">Fecha</p>

                <input type="date" min={hoy} value={form.fecha} onChange={e => handleFecha(e.target.value)} className="w-full border border-[#e8e2d8] bg-[#faf8f5] text-[#1e2535] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#1e2535] transition-colors cursor-pointer" />

                {errorDia && (
                    <p className="text-xs text-red-400 mt-2">{errorDia}</p>
                )}
            </div>

            {/* Filtramos los horarios por la fecha */}
            {form.fecha && horariosFiltrados.length > 0 && (
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-1 md:mb-2 md:mt-3">Horario disponible</p>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {horariosFiltrados.map((horario) => (
                            <button key={horario} onClick={() => onHora(horario)} className={`py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                form.hora === horario
                                    ? 'border-[#1e2535] bg-[#1e2535] text-white'
                                    : 'border-[#e8e2d8] bg-[#faf8f5] text-[#1e2535] hover:border-[#c8c0b0] hover:bg-white'
                                }`}>
                                {horario}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sin horarios para el día elegido */}
            {form.fecha && !errorDia && horariosFiltrados.length === 0 && (
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

            {/* Navegación */}
            <div className="flex gap-3 md:mx-15">
                <button onClick={onAtras} className="cursor-pointer flex-1 border border-[#e8e2d8] text-[#8a8070] py-2.5 md:py-3.5 rounded-full font-semibold text-sm hover:border-[#c8c0b0] hover:text-[#1e2535] transition-colors">
                    Atrás
                </button>
                <button disabled={!form.fecha || !form.hora} onClick={onSiguiente} className="cursor-pointer flex-1 bg-[#1e2535] text-white py-2.5 md:py-3.5 rounded-full font-semibold text-sm disabled:opacity-30 hover:bg-[#2d3748] transition-colors">
                    Continuar
                </button>
            </div>

        </div>
    )
}
