export default function PasoServicio({ servicios, form, onServicio, onAtras, onSiguiente }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Servicio</label>
        <div className="grid gap-3">
          {servicios.map((s) => (
            <button
              key={s.id}
              onClick={() => onServicio(String(s.id))}
              className={`flex justify-between items-center px-5 py-4 rounded-xl border-2 transition-colors ${form.servicioId === String(s.id) ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}
            >
              <div className="text-left">
                <span className="font-semibold text-slate-700 block">{s.tipo}</span>
                <span className="text-sm text-slate-400">{s.duracion} min</span>
              </div>
              <span className="font-bold text-slate-800">${s.precio.toLocaleString('es-AR')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onAtras} className="flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:border-slate-400 transition-colors">
          Atrás
        </button>
        <button
          disabled={!form.servicioId}
          onClick={onSiguiente}
          className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
