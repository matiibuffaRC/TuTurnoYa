import { useEffect, useState } from 'react'
import { getSucursales, getBarberos, getServicios, getDisponibles, crearTurno } from '../../api'

import PasoIndicador from './PasoIndicador'
import PasoSucursal from './PasoSucursal'
import PasoServicio from './PasoServicio'
import PasoFecha from './PasoFecha'
import PasoDatos from './PasoDatos'
import Confirmacion from './Confirmacion'

const FORM_INICIAL = {
  sucursalId: '', barberoId: '', fecha: '', hora: '',
  servicioId: '', nombre: '', apellido: '', email: '',
}

export default function ReservarTurno() {
  const [paso, setPaso] = useState(0)
  const [sucursales, setSucursales] = useState([])
  const [barberos, setBarberos] = useState([])
  const [servicios, setServicios] = useState([])
  const [horarios, setHorarios] = useState([])
  const [form, setForm] = useState(FORM_INICIAL)
  const [turnoConfirmado, setTurnoConfirmado] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { getSucursales().then(setSucursales) }, [])
  useEffect(() => { getServicios().then(setServicios) }, [])

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSucursal = async (id) => {
    set('sucursalId', id)
    set('barberoId', '')
    setBarberos(await getBarberos(id))
  }

  const handleBarbero = (id) => {
    set('barberoId', id)
    set('hora', '')
    set('fecha', '')
    setHorarios([])
  }

  const handleFecha = async (fecha) => {
    set('fecha', fecha)
    set('hora', '')
    if (form.barberoId && form.servicioId) {
      setHorarios(await getDisponibles(form.barberoId, fecha, form.servicioId))
    }
  }

  const handleServicio = () => {
    set('hora', '')
    set('fecha', '')
    setHorarios([])
  }

  const handleConfirmar = async () => {
    setError('')
    const res = await crearTurno({
      fecha: form.fecha, hora: form.hora,
      nombre: form.nombre, apellido: form.apellido, email: form.email,
      barberoId: Number(form.barberoId), servicioId: Number(form.servicioId),
    })
    if (res.error) { setError(res.error); return }
    setTurnoConfirmado(res)
  }

  const handleNuevoTurno = () => {
    setTurnoConfirmado(null)
    setForm(FORM_INICIAL)
    setPaso(0)
  }

  if (turnoConfirmado) {
    return <Confirmacion turno={turnoConfirmado} onNuevoTurno={handleNuevoTurno} />
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-[#f7f4ef] montserrat-alternates">
      <div className="max-w-xl mx-auto px-5 py-14 pt-6 pb-5">

        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700">Reserva online</p>
          <h1 className="text-3xl font-black text-[#1e2535] leading-tight">Reservar turno</h1>
          <p className="text-[#8a8070] text-xs">Seguí los pasos para confirmar tu reserva.</p>
        </div>

        <PasoIndicador pasoActual={paso} />

        <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-sm p-7">
          {paso === 0 && (
            <PasoSucursal
              sucursales={sucursales}
              barberos={barberos}
              form={form}
              onSucursal={handleSucursal}
              onBarbero={handleBarbero}
              onSiguiente={() => setPaso(1)}
            />
          )}
          {paso === 1 && (
            <PasoServicio
              servicios={servicios}
              form={form}
              onServicio={(id) => { set('servicioId', id); handleServicio() }}
              onAtras={() => setPaso(0)}
              onSiguiente={() => setPaso(2)}
            />
          )}
          {paso === 2 && (
            <PasoFecha
              form={form}
              horarios={horarios}
              onFecha={handleFecha}
              onHora={(h) => set('hora', h)}
              onAtras={() => setPaso(1)}
              onSiguiente={() => setPaso(3)}
            />
          )}
          {paso === 3 && (
            <PasoDatos
              form={form}
              error={error}
              onChange={set}
              onAtras={() => setPaso(2)}
              onConfirmar={handleConfirmar}
            />
          )}
        </div>

      </div>
    </div>
  )
}
