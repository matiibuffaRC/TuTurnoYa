export default function PasoSucursal({ sucursales, barberos, form, onSucursal, onBarbero, onSiguiente }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Sucursal</label>
        <div className="grid gap-3">
          {sucursales.map((s) => (
            <button
              key={s.id}
              onClick={() => onSucursal(String(s.id))}
              className={`text-left px-5 py-4 rounded-xl border-2 transition-colors cursor-pointer ${form.sucursalId === String(s.id) ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}
            >
              <p className="font-semibold text-slate-800">{s.nombre}</p>
              <p className="text-sm text-slate-500">{s.direccion} · {s.horarioApertura} a {s.horarioCierre}</p>
            </button>
          ))}
        </div>
      </div>

      {barberos.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Barbero</label>
          <div className="grid grid-cols-2 gap-3">
            {barberos.map((b) => (
              <button
                key={b.id}
                onClick={() => onBarbero(String(b.id))}
                className={`px-4 py-3 cursor-pointer rounded-xl border-2 transition-colors text-center ${form.barberoId === String(b.id) ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}
              >
                <span className="text-2xl block mb-1">💈</span>
                <span className="font-medium text-slate-700">{b.nombre} {b.apellido}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        disabled={!form.sucursalId || !form.barberoId}
        onClick={onSiguiente}
        className="w-full bg-slate-800  text-white py-3 rounded-full font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors cursor-pointer"
      >
        Continuar
      </button>
    </div>
  )
}
