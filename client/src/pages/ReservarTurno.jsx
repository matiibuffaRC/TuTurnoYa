import { useEffect, useState } from 'react'
import { getSucursales, getBarberos, getServicios, getDisponibles, crearTurno } from '../api'

const PASOS = ['Sucursal y barbero', 'Fecha y horario', 'Servicio', 'Tus datos']

export default function ReservarTurno () {
    const [paso, setPaso] = useState(0)
    const [sucursales, setSucursales] = useState([])
    const [barberos, setBarberos] = useState([])
    const [servicios, setServicios] = useState([])
    const [horarios, setHorarios] = useState([])
    const [form, setForm] = useState({
        sucursalId: '', barberoId: '', fecha: '', hora: '',
        servicioId: '', nombre: '', apellido: '', email: '',
    })
    const [turnoConfirmado, setTurnoConfirmado] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => { getSucursales().then(setSucursales) }, [])
    useEffect(() => { getServicios().then(setServicios) }, [])

    const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

    const seleccionarSucursal = async (id) => {
        set('sucursalId', id)
        set('barberoId', '')
        const data = await getBarberos(id)
        setBarberos(data)
    }

    const seleccionarBarbero = async (id) => {
        set('barberoId', id)
        set('hora', '')
        if (form.fecha) {
        const data = await getDisponibles(id, form.fecha)
        setHorarios(data)
        }
    }

    const seleccionarFecha = async (fecha) => {
        set('fecha', fecha)
        set('hora', '')
        if (form.barberoId) {
        const data = await getDisponibles(form.barberoId, fecha)
        setHorarios(data)
        }
    }

    const confirmar = async () => {
        setError('')
        const res = await crearTurno({
        fecha: form.fecha, hora: form.hora,
        nombre: form.nombre, apellido: form.apellido, email: form.email,
        barberoId: Number(form.barberoId), servicioId: Number(form.servicioId),
        })
        if (res.error) { setError(res.error); return }
        setTurnoConfirmado(res)
    }

    const resetear = () => {
        setTurnoConfirmado(null)
        setForm({ sucursalId:'', barberoId:'', fecha:'', hora:'', servicioId:'', nombre:'', apellido:'', email:'' })
        setPaso(0)
    }

    const hoy = new Date().toISOString().split('T')[0]

    if (turnoConfirmado) {
        return (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Turno confirmado!</h2>
            <p className="text-slate-600 mb-6">
            Te esperamos el <strong>{turnoConfirmado.fecha}</strong> a las <strong>{turnoConfirmado.hora}</strong>.
            </p>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-5 text-left mb-6 space-y-1">
            <p><span className="font-medium">Barbero:</span> {turnoConfirmado.barbero.nombre} {turnoConfirmado.barbero.apellido}</p>
            <p><span className="font-medium">Sucursal:</span> {turnoConfirmado.barbero.sucursal.nombre}</p>
            <p><span className="font-medium">Dirección:</span> {turnoConfirmado.barbero.sucursal.direccion}</p>
            <p><span className="font-medium">Servicio:</span> {turnoConfirmado.servicio.tipo}</p>
            <p><span className="font-medium">Precio:</span> ${turnoConfirmado.servicio.precio.toLocaleString('es-AR')}</p>
            <p><span className="font-medium">Duración:</span> {turnoConfirmado.servicio.duracion} min</p>
            </div>
            <button onClick={resetear} className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            Reservar otro turno
            </button>
        </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 montserrat-alternates">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Reservar turno</h1>
            <p className="text-slate-500 mb-8">Seguí los pasos para reservar tu turno.</p>

        {/* Indicador de pasos */}
        <div className="flex items-center gap-2 mb-10">
            {PASOS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i <= paso ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {i + 1}
                </div>
                {i < PASOS.length - 1 && <div className={`flex-1 h-1 rounded ${i < paso ? 'bg-slate-800' : 'bg-slate-200'}`} />}
            </div>
            ))}
        </div>

        {/* Paso 0: Sucursal y barbero */}
        {paso === 0 && (
            <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sucursal</label>
                <div className="grid gap-3">
                {sucursales.map((s) => (
                    <button key={s.id} onClick={() => seleccionarSucursal(String(s.id))}
                    className={`text-left px-5 py-4 rounded-xl border-2 transition-colors ${form.sucursalId === String(s.id) ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}>
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
                    <button key={b.id} onClick={() => seleccionarBarbero(String(b.id))}
                        className={`px-4 py-3 rounded-xl border-2 transition-colors text-center ${form.barberoId === String(b.id) ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}>
                        <span className="text-2xl block mb-1">💈</span>
                        <span className="font-medium text-slate-700">{b.nombre} {b.apellido}</span>
                    </button>
                    ))}
                </div>
                </div>
            )}

            <button disabled={!form.sucursalId || !form.barberoId} onClick={() => setPaso(1)}
                className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors">
                Continuar
            </button>
            </div>
        )}

        {/* Paso 1: Fecha y horario */}
        {paso === 1 && (
            <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha</label>
                <input type="date" min={hoy} value={form.fecha} onChange={(e) => seleccionarFecha(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-800" />
            </div>

            {horarios.length > 0 && (
                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Horario disponible</label>
                <div className="grid grid-cols-3 gap-2">
                    {horarios.map((h) => (
                    <button key={h} onClick={() => set('hora', h)}
                        className={`py-2 rounded-lg border-2 font-medium transition-colors ${form.hora === h ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-200 hover:border-slate-400 text-slate-700'}`}>
                        {h}
                    </button>
                    ))}
                </div>
                </div>
            )}

            {form.fecha && horarios.length === 0 && (
                <p className="text-center text-slate-400 py-4">No hay horarios disponibles para ese día.</p>
            )}

            <div className="flex gap-3">
                <button onClick={() => setPaso(0)} className="flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:border-slate-400 transition-colors">Atrás</button>
                <button disabled={!form.fecha || !form.hora} onClick={() => setPaso(2)}
                className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors">
                Continuar
                </button>
            </div>
            </div>
        )}

        {/* Paso 2: Servicio */}
        {paso === 2 && (
            <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Servicio</label>
                <div className="grid gap-3">
                {servicios.map((s) => (
                    <button key={s.id} onClick={() => set('servicioId', String(s.id))}
                    className={`flex justify-between items-center px-5 py-4 rounded-xl border-2 transition-colors ${form.servicioId === String(s.id) ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}>
                    <div className="text-left">
                        <span className="font-semibold text-slate-700 block">{s.tipo}</span>
                        <span className="text-sm text-slate-400">{s.duracion} min</span>
                    </div>
                    <span className="font-bold text-slate-800">${s.precio.toLocaleString('es-AR')}</span>
                    </button>
                ))}
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={() => setPaso(1)} className="flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:border-slate-400 transition-colors">Atrás</button>
                <button disabled={!form.servicioId} onClick={() => setPaso(3)}
                className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors">
                Continuar
                </button>
            </div>
            </div>
        )}

        {/* Paso 3: Datos personales */}
        {paso === 3 && (
            <div className="space-y-4">
            {[
                { label: 'Nombre', field: 'nombre', type: 'text', placeholder: 'Juan' },
                { label: 'Apellido', field: 'apellido', type: 'text', placeholder: 'Pérez' },
                { label: 'Email', field: 'email', type: 'email', placeholder: 'juan@email.com' },
            ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
                <input type={type} placeholder={placeholder} value={form[field]}
                    onChange={(e) => set(field, e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-800" />
                </div>
            ))}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button onClick={() => setPaso(2)} className="flex-1 border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:border-slate-400 transition-colors">Atrás</button>
                <button disabled={!form.nombre || !form.apellido || !form.email} onClick={confirmar}
                className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-semibold disabled:opacity-40 hover:bg-slate-700 transition-colors">
                Confirmar turno
                </button>
            </div>
            </div>
        )}
        </div>
    )
}
