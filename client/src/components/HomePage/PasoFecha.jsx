export default function PasoFecha({ form, horarios, onFecha, onHora, onAtras, onSiguiente }) {
  const hoy = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-3">Fecha</p>
        <input
          type="date"
          min={hoy}
          value={form.fecha}
          onChange={(e) => onFecha(e.target.value)}
          className="w-full border border-[#e8e2d8] bg-[#faf8f5] rounded-xl px-5 py-3.5 text-sm text-[#1e2535] font-medium cursor-pointer focus:outline-none focus:border-[#1e2535] focus:bg-white transition-all"
        />
      </div>

      {form.fecha && horarios.length > 0 && (
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-3">Horario disponible</p>
          <div className="grid grid-cols-4 gap-2">
            {horarios.map((h) => (
              <button
                key={h}
                onClick={() => onHora(h)}
                className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  form.hora === h
                    ? 'border-[#1e2535] bg-[#1e2535] text-white'
                    : 'border-[#e8e2d8] bg-[#faf8f5] text-[#1e2535] hover:border-[#c8c0b0] hover:bg-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {form.fecha && horarios.length === 0 && (
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
          className="cursor-pointer flex-1 border border-[#e8e2d8] text-[#8a8070] py-3.5 rounded-xl font-semibold text-sm hover:border-[#c8c0b0] hover:text-[#1e2535] transition-colors"
        >
          Atrás
        </button>
        <button
          disabled={!form.fecha || !form.hora}
          onClick={onSiguiente}
          className="cursor-pointer flex-1 bg-[#1e2535] text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-30 hover:bg-[#2d3748] transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
