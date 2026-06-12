export default function Confirmacion({ turno, onNuevoTurno }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Turno confirmado!</h2>
      <p className="text-slate-600 mb-6">
        Te esperamos el <strong>{turno.fecha}</strong> a las <strong>{turno.hora}</strong>.
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-5 text-left mb-6 space-y-1">
        <p><span className="font-medium">Barbero:</span> {turno.barbero.nombre} {turno.barbero.apellido}</p>
        <p><span className="font-medium">Sucursal:</span> {turno.barbero.sucursal.nombre}</p>
        <p><span className="font-medium">Dirección:</span> {turno.barbero.sucursal.direccion}</p>
        <p><span className="font-medium">Servicio:</span> {turno.servicio.tipo}</p>
        <p><span className="font-medium">Precio:</span> ${turno.servicio.precio.toLocaleString('es-AR')}</p>
        <p><span className="font-medium">Duración:</span> {turno.servicio.duracion} min</p>
      </div>

      <button
        onClick={onNuevoTurno}
        className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
      >
        Reservar otro turno
      </button>
    </div>
  )
}
