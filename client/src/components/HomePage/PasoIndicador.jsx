const PASOS = ['Sucursal y barbero', 'Fecha y horario', 'Servicio', 'Tus datos']

export default function PasoIndicador({ pasoActual }) {
  return (
    <div className="flex justify-center items-center gap-2 mb-10">
      {PASOS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              i <= pasoActual
                ? 'bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {i + 1}
          </div>

          {i < PASOS.length - 1 && (
            <div
              className={`w-12 h-1 rounded ${
                i < pasoActual ? 'bg-slate-800' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}