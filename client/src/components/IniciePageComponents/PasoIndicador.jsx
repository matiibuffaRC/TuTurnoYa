const PASOS = ['Sucursal', 'Servicio', 'Fecha y hora', 'Tus datos']

export default function PasoIndicador({ pasoActual }) {
    return (
        <div className="mb-8">
            <div className="flex items-center">
                {PASOS.map((label, indice) => (
                <div key={indice} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${ indice < pasoActual ? 'bg-amber-600 text-white' : indice === pasoActual ? 'bg-[#1e2535] text-white ring-4 ring-[#1e2535]/10' : 'bg-[#e8e2d8] text-[#a09880]' }`}>
                            {indice < pasoActual ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            ) : (indice + 1)
                            }
                        </div>
                        <span className={`hidden sm:block text-xs font-medium transition-colors duration-300 whitespace-nowrap ${
                            indice === pasoActual ? 'text-[#1e2535]' : 'text-[#a09880]'
                        }`}>
                            {label}
                        </span>
                    </div>
                    {indice < PASOS.length - 1 && (
                    <div className="flex-1 mx-2 sm:mb-4">
                        <div className="h-px bg-[#e8e2d8] relative">
                            <div
                                className="absolute top-0 left-0 h-full bg-amber-600 transition-all duration-500"
                                style={{ width: indice < pasoActual ? '100%' : '0%' }}
                            />
                        </div>
                    </div>
                    )}
                </div>
                ))}
            </div>
        </div>
    )
}