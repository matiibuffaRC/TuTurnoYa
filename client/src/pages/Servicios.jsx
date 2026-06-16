import { useEffect, useState } from 'react'
import { getServicios } from '../api'

export default function Servicios() {
  const [servicios, setServicios] = useState([])

  useEffect(() => {
    getServicios().then(setServicios)
  }, [])

  return (
    <div className="flex flex-col justify-start min-h-[calc(100dvh-100px)] max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Nuestros servicios</h1>
      <p className="text-slate-500 mb-8">Todos los precios incluyen el trabajo del barbero.</p>

      <div className="grid gap-4">
        {servicios.map((s) => (
          <div key={s.id} className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✂</span>
              <div>
                <p className="font-semibold text-slate-700 text-lg">{s.tipo}</p>
                <p className="text-sm text-slate-400">{s.duracion} min</p>
              </div>
            </div>
            <span className="text-xl font-bold text-slate-800">${s.precio.toLocaleString('es-AR')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
