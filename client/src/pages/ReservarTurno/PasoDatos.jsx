const CAMPOS = [
  { label: 'Nombre', field: 'nombre', type: 'text', placeholder: 'Juan' },
  { label: 'Apellido', field: 'apellido', type: 'text', placeholder: 'Pérez' },
  { label: 'Email', field: 'email', type: 'email', placeholder: 'juan@email.com' },
]

export default function PasoDatos({ form, error, onChange, onAtras, onConfirmar }) {
  const completo = form.nombre && form.apellido && form.email

  return (
    <div className="space-y-4">
      {CAMPOS.map(({ label, field, type, placeholder }) => (
        <div key={field}>
          <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
          <input
            type={type}
            placeholder={placeholder}
            value={form[field]}
            onChange={(e) => onChange(field, e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-800"
          />
        </div>
      ))}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button onClick={onAtras} className="flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:border-slate-400 transition-colors">
          Atrás
        </button>
        <button
          disabled={!completo}
          onClick={onConfirmar}
          className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors"
        >
          Confirmar turno
        </button>
      </div>
    </div>
  )
}
