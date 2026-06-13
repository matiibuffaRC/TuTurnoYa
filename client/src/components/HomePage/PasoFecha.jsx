export default function PasoFecha({ form, horarios, onFecha, onHora, onAtras, onSiguiente }) {
  const hoy = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha</label>
        <input
          type="date"
          min={hoy}
          value={form.fecha}
          onChange={(e) => onFecha(e.target.value)}
          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 cursor-pointer focus:outline-none focus:border-slate-800"
        />
      </div>

      {horarios.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Horario disponible</label>
          <div className="grid grid-cols-3 gap-2">
            {horarios.map((h) => (
              <button
                key={h}
                onClick={() => onHora(h)}
                className={`py-2 rounded-lg border-2 font-medium transition-colors cursor-pointer ${form.hora === h ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-200 hover:border-slate-400 text-slate-700'}`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {form.fecha && horarios.length === 0 && (
        <p className="text-center text-slate-400 py-4">No hay horarios disponibles para ese día.</p>
      )}

      <div className="flex gap-3">
        <button onClick={onAtras} className="cursor-pointer flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-full font-semibold hover:border-slate-400 transition-colors">
          Atrás
        </button>
        <button
          disabled={!form.fecha || !form.hora}
          onClick={onSiguiente}
          className="cursor-pointer flex-1 bg-slate-800 text-white py-3 rounded-full font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors"
        > 
          Continuar
        </button>
      </div>
    </div>
  )
}
