const IconPin = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
)

const IconScissors = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3"/>
        <circle cx="6" cy="18" r="3"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88"/>
        <line x1="14.47" y1="14.48" x2="20" y2="20"/>
        <line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
)

const IconLock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
)

export default function PasoSucursal({ sucursales, barberos, form, onSucursal, onBarbero, onSiguiente }) {
    // Almacenamos la selección del barbero para evitar recalcularlo

    const barberoSeleccionado = barberos.find(
        (barbero) => String(barbero.id) === form.barberoId
    );

    const agendaCerrada =
        barberoSeleccionado && !barberoSeleccionado.agendaAbierta

    return (
        <div className="space-y-7">
            <div>
                <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-1">
                    Sucursal
                </p>

                <div className="space-y-2">
                {sucursales.map((sucursal) => (
                    <button key={sucursal.id} onClick={() => onSucursal(String(sucursal.id))} className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${ form.sucursalId === String(sucursal.id) ? "border-[#1e2535] bg-[#1e2535] text-white" : "border-[#e8e2d8] bg-[#faf8f5] hover:border-[#c8c0b0] hover:bg-white" }`} >
                        <p className={`font-semibold text-sm ${ form.sucursalId === String(sucursal.id) ? "text-white" : "text-[#1e2535]" }`}>
                            {sucursal.nombre}
                        </p>

                        <p className={`text-xs mt-1 flex items-center gap-1 ${ form.sucursalId === String(sucursal.id) ? "text-white/70" : "text-[#8a8070]" }`} >
                            <IconPin />
                            {sucursal.direccion} · {sucursal.horarioApertura}–{sucursal.horarioCierre}
                        </p>
                    </button>
                ))}
                </div>
            </div>

            {barberos.length > 0 && (
                <div>
                    <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-1">
                        Barbero
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        {barberos.map((b) => {
                        const cerrada = !b.agendaAbierta
                        const seleccionado = form.barberoId === String(b.id)

                        return (
                            <button key={b.id} onClick={() => !cerrada && onBarbero(String(b.id))} disabled={cerrada} className={`px-4 py-4 rounded-2xl border transition-all duration-200 relative ${ cerrada ? "border-[#e8e2d8] bg-[#f5f3ef] opacity-60 cursor-not-allowed" : seleccionado ? "border-[#1e2535] bg-[#1e2535] cursor-pointer" : "border-[#e8e2d8] bg-[#faf8f5] hover:border-[#c8c0b0] hover:bg-white cursor-pointer" }`} >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ cerrada ? "bg-[#e8e2d8] text-[#a09880]" : seleccionado ? "bg-white/20 text-white" : "bg-[#1e2535]/8 text-[#1e2535]" }`} >
                                        {cerrada ? <IconLock /> : <IconScissors />}
                                    </div>

                                    <div className="flex flex-col items-start">
                                        <p className={`font-semibold text-sm text-left ${ seleccionado ? "text-white" : "text-[#1e2535]" }`} >
                                            {b.nombre} {b.apellido}
                                        </p>
                                    {cerrada && (
                                        <p className="text-xs text-red-500 font-medium">
                                            Agenda cerrada
                                        </p>
                                    )}
                                    </div>
                                </div>
                            </button>
                        )
                        })}
                    </div>
                </div>
            )}

            {agendaCerrada && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700 font-medium">
                    Este barbero no acepta reservas en este momento. Elegí otro para
                    continuar.
                </div>
            )}

            <button disabled={!form.sucursalId || !form.barberoId || agendaCerrada} onClick={onSiguiente} className="w-full bg-[#1e2535] text-white py-3.5 rounded-full font-semibold text-sm disabled:opacity-30 hover:bg-[#2d3748] transition-colors cursor-pointer">
                Continuar
            </button>
        </div>
    )
}