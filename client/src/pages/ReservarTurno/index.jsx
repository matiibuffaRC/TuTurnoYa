import { useEffect, useState } from 'react'
import { getSucursales, getBarberos, getServicios, getDisponibles, crearTurno } from '../../api'
import PasoIndicador from './PasoIndicador'
import PasoSucursal from './PasoSucursal'
import PasoFecha from './PasoFecha'
import PasoServicio from './PasoServicio'
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

  const handleBarbero = async (id) => {
    set('barberoId', id)
    set('hora', '')
    if (form.fecha) setHorarios(await getDisponibles(id, form.fecha))
  }

  const handleFecha = async (fecha) => {
    set('fecha', fecha)
    set('hora', '')
    if (form.barberoId) setHorarios(await getDisponibles(form.barberoId, fecha))
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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Reservar turno</h1>
      <p className="text-slate-500 mb-8">Seguí los pasos para reservar tu turno.</p>

      <PasoIndicador pasoActual={paso} />

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
        <PasoFecha
          form={form}
          horarios={horarios}
          onFecha={handleFecha}
          onHora={(h) => set('hora', h)}
          onAtras={() => setPaso(0)}
          onSiguiente={() => setPaso(2)}
        />
      )}
      {paso === 2 && (
        <PasoServicio
          servicios={servicios}
          form={form}
          onServicio={(id) => set('servicioId', id)}
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
  )
}
