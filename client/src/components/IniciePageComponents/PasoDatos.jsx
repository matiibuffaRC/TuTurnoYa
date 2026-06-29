const CAMPOS = [
    { label: 'Nombre', field: 'nombre', type: 'text', placeholder: 'Juan' },
    { label: 'Apellido', field: 'apellido', type: 'text', placeholder: 'Pérez' },
    { label: 'Email', field: 'email', type: 'email', placeholder: 'juan@email.com' },
]

const emailValido = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function PasoDatos({ form, error, onChange, onAtras, onConfirmar }) {
    const emailError = form.email && !emailValido(form.email)
    const completo = form.nombre.trim() && form.apellido.trim() && emailValido(form.email)

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {CAMPOS.map(({ label, field, type, placeholder }) => (
                <div key={field}>
                    <label className="block text-xs font-bold tracking-widest uppercase text-[#8a8070] mb-2">
                        {label}
                    </label>
                    <input type={type} placeholder={placeholder} value={form[field]} onChange={(e) => onChange(field, e.target.value)} className={`w-full border rounded-full px-5 py-3.5 text-sm text-[#1e2535] font-medium placeholder:text-[#c0b8a8] focus:outline-none transition-all ${field === 'email' && emailError ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-[#e8e2d8] bg-[#faf8f5] focus:border-[#1e2535] focus:bg-white' }`}/>
                    {field === 'email' && emailError && (
                        <p className="text-xs text-red-600 font-medium mt-1.5 ml-1">Ingresá un email válido</p>
                    )}
                </div>
                ))}
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
            )}

            <div className="flex gap-3 pt-1">
                <button onClick={onAtras} className="cursor-pointer flex-1 border border-[#e8e2d8] text-[#8a8070] py-3.5 rounded-full font-semibold text-sm hover:border-[#c8c0b0] hover:text-[#1e2535] transition-colors" >
                    Atrás
                </button>
                <button disabled={!completo} onClick={onConfirmar} className="cursor-pointer flex-1 bg-[#1e2535] text-white py-3.5 rounded-full font-semibold text-sm disabled:opacity-30 hover:bg-[#2d3748] transition-colors" >
                    Confirmar turno
                </button>
            </div>
        </div>
    )
}
