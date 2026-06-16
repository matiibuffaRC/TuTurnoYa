const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const Row = ({ label, value }) => (
  <div className="flex justify-between items-start py-3 border-b border-[#f0ece4] last:border-0">
    <span className="text-xs font-bold tracking-widest uppercase text-[#8a8070]">{label}</span>
    <span className="text-sm font-semibold text-[#1e2535] text-right max-w-[55%]">{value}</span>
  </div>
)

export default function Confirmacion({ turno, onNuevoTurno }) {
  return (
    <div className="min-h-[calc(100dvh-80px)] bg-[#f7f4ef] montserrat-alternates flex items-center justify-center px-5 py-14">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#1e2535] flex items-center justify-center mx-auto mb-5 text-white">
            <IconCheck />
          </div>
          <h2 className="text-2xl font-black text-[#1e2535]">Turno confirmado</h2>
          <p className="text-[#8a8070] text-sm mt-2">
            Te esperamos el <strong className="text-[#1e2535]">{turno.fecha}</strong> a las <strong className="text-[#1e2535]">{turno.hora}</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e2d8] px-6 py-2 mb-6">
          <Row label="Barbero" value={`${turno.barbero.nombre} ${turno.barbero.apellido}`} />
          <Row label="Sucursal" value={turno.barbero.sucursal.nombre} />
          <Row label="Dirección" value={turno.barbero.sucursal.direccion} />
          <Row label="Servicio" value={turno.servicio.tipo} />
          <Row label="Duración" value={`${turno.servicio.duracion} min`} />
          <Row label="Precio" value={`$${turno.servicio.precio.toLocaleString('es-AR')}`} />
        </div>

        <button
          onClick={onNuevoTurno}
          className="w-full bg-[#1e2535] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#2d3748] transition-colors cursor-pointer"
        >
          Reservar otro turno
        </button>

      </div>
    </div>
  )
}
