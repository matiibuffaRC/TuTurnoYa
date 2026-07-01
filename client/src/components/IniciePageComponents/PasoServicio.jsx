const IconClock = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
)

const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
)

export default function PasoServicio({ servicios, form, onServicio, onAtras, onSiguiente }) {
    return (
        <div className="space-y-7">
            <div>
                <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-1">Servicio</p>
                <div className="space-y-2">
                {servicios.map((servicio) => {
                    const seleccionado = form.servicioId === String(servicio.id)
                    return (
                        <button key={servicio.id} onClick={() => onServicio(String(servicio.id))} className={`w-full flex items-center justify-between px-4 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${ seleccionado ? 'border-[#1e2535] bg-[#1e2535]' : 'border-[#e8e2d8] bg-[#faf8f5] hover:border-[#c8c0b0] hover:bg-white' }`} >
                            <div className="text-left">
                                <p className={`font-semibold text-sm ${seleccionado ? 'text-white' : 'text-[#1e2535]'}`}>
                                    {servicio.tipo}
                                </p>
                                <p className={`text-xs mt-0.5 flex items-center gap-0.5 ${seleccionado ? 'text-white/60' : 'text-[#8a8070]'}`}>
                                    <IconClock /> {servicio.duracion} min
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-base font-black ${seleccionado ? 'text-amber-300' : 'text-[#1e2535]'}`}>
                                    ${servicio.precio.toLocaleString('es-AR')}
                                </span>
                                {seleccionado && (
                                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                                        <IconCheck />
                                    </span>
                                )}
                            </div>
                        </button>
                    )
                })}
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={onAtras} className="cursor-pointer flex-1 border border-[#e8e2d8] text-[#8a8070] py-3.5 rounded-full font-semibold text-sm hover:border-[#c8c0b0] hover:text-[#1e2535] transition-colors" >
                    Atrás
                </button>
                <button disabled={!form.servicioId} onClick={onSiguiente} className="cursor-pointer flex-1 bg-[#1e2535] text-white py-3.5 rounded-full font-semibold text-sm disabled:opacity-30 hover:bg-[#2d3748] transition-colors" >
                    Continuar
                </button>
            </div>
        </div>
    )
}
