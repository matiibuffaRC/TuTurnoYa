import { useEffect, useState } from 'react'
import { getSucursales } from '../services/sucursal.service'
import { getBarberos } from '../services/barbero.service'
import { getServicios } from '../services/servicio.service'
import { getDisponibles, crearTurno } from '../services/turno.service'


// Importamos los componentes desde las vistas de los usuarios
import PasoIndicador from '../components/IniciePageComponents/PasoIndicador'
import PasoSucursal from '../components/IniciePageComponents/PasoSucursal'
import PasoServicio from '../components/IniciePageComponents/PasoServicio'
import PasoFecha from '../components/IniciePageComponents/PasoFecha'
import PasoDatos from '../components/IniciePageComponents/PasoDatos'
import Confirmacion from '../components/IniciePageComponents/Confirmacion'

const FORM_INICIAL = {
    sucursalId: '',
    barberoId: '',
    fecha: '',
    hora: '',
    servicioId: '',
    nombre: '',
    apellido: '',
    email: '',
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

    // Una vez que montamos la vista hacemos una petición al servidor para obtener las sucursales
    useEffect(() => {
        const cargarDatos = async () => {
            const [sucursales, servicios] = await Promise.all([
                getSucursales(),
                getServicios(),
            ]);

            setSucursales(sucursales);
            setServicios(servicios);
        };
        // Llamá la función sino nunca la ejecutamos xd
        cargarDatos();
    }, []);
    
    const actualizarCampo = (field, value) => {
        setForm((formAnterior) => ({
            ...formAnterior,
            [field]: value,
        }))
    }

    const handleSucursal = async (id) => {
        actualizarCampo('sucursalId', id)
        actualizarCampo('barberoId', '')
        setBarberos(await getBarberos(id))
    }

    const handleBarbero = (id) => {
        actualizarCampo('barberoId', id)
        actualizarCampo('hora', '')
        actualizarCampo('fecha', '')
        setHorarios([])
    }

    const handleFecha = async (fecha) => {
        actualizarCampo('fecha', fecha)
        actualizarCampo('hora', '')

        if (form.barberoId && form.servicioId) {
            setHorarios(await getDisponibles(form.barberoId, fecha, form.servicioId))
        }
    }

    const handleServicio = () => {
        actualizarCampo('hora', '')
        actualizarCampo('fecha', '')
        setHorarios([])
    }

    const handleConfirmar = async () => {
        setError('')

        const res = await crearTurno({
            fecha: form.fecha,
            hora: form.hora,
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            barberoId: Number(form.barberoId),
            servicioId: Number(form.servicioId),
        })

        if (res.error) {
            setError(res.error)
            return
        }

        setTurnoConfirmado(res)
    }

    const handleNuevoTurno = () => {
        setTurnoConfirmado(null)
        setForm(FORM_INICIAL)
        setPaso(0)
    }

    if (turnoConfirmado) {
        return (
            <Confirmacion turno={turnoConfirmado} onNuevoTurno={handleNuevoTurno} />
        )
    }

    return (
        <div className="min-h-[calc(100dvh-80px)] bg-[#f7f4ef] montserrat-alternates">
            <div className="max-w-xl mx-auto px-5 py-14 pt-6 pb-5">
                <div className="mb-8">
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-700">
                        Reserva online
                    </p>
                    <h1 className="text-3xl font-black text-[#1e2535] leading-tight">
                        Reservar turno
                    </h1>
                    <p className="text-[#8a8070] text-xs">
                        Seguí los pasos para confirmar tu reserva.
                    </p>
                </div>

                <PasoIndicador pasoActual={paso} />

                <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-sm p-7">
                    {paso === 0 && (<PasoSucursal sucursales={sucursales} barberos={barberos} form={form} onSucursal={handleSucursal} onBarbero={handleBarbero} onSiguiente={() => setPaso(1)} /> )}
                    {paso === 1 && (<PasoServicio servicios={servicios} form={form} onServicio={(id) => { actualizarCampo('servicioId', id); handleServicio() }} onAtras={() => setPaso(0)} onSiguiente={() => setPaso(2)} />)}
                    {paso === 2 && (<PasoFecha form={form} horarios={horarios} onFecha={handleFecha} onHora={(hora) => actualizarCampo('hora', hora)} onAtras={() => setPaso(1)} onSiguiente={() => setPaso(3)} /> )}
                    {paso === 3 && (<PasoDatos form={form} error={error} onChange={actualizarCampo} onAtras={() => setPaso(2)} onConfirmar={handleConfirmar} />)}
                </div>
            </div>
        </div>
    )
}