const prisma = require('../config/database')

// HORARIOS generados dinámicamente según cada barbero

const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    return h * 60 + m
}

// Verificamos que un nuevo turno (Ejemplo una tintura) no se superponga con otro turno
const overlaps = (startA, durA, startB, durB) =>
    startA < startB + durB && startA + durA > startB

// Genera slots cada 30 min entre la entrada y salida del barbero
const generarSlotsBarbero = (barbero) => {
    const slots = []
    let cur = toMinutes(barbero.horarioEntrada)
    const end = toMinutes(barbero.horarioSalida)
    while (cur < end) {
        const h = String(Math.floor(cur / 60)).padStart(2, '0')
        const m = String(cur % 60).padStart(2, '0')
        slots.push(`${h}:${m}`)
        cur += 30
    }
    return slots
}

const esDiaLaborable = (fechaISO) => {
    const dia = new Date(fechaISO + 'T00:00:00').getDay()
    return dia !== 0 && dia !== 1 // 0 = domingo, 1 = lunes
}

const hoyArgentina = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })
const horaActualMinutos = () => {
    const now = new Date()
    const partes = now.toLocaleTimeString('en-GB', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit' })
    return toMinutes(partes)
}

// Listar turnos por email del cliente
const listarTurnos = async (req, res) => {
    try {
        const { email } = req.query
        if (!email) return res.status(400).json({ error: 'Falta el parámetro email' })

        const turnos = await prisma.turno.findMany({
            where: { cliente: { email }, estado: 'activo' },
            include: {
                cliente: true,
                barbero: { include: { sucursal: true } },
                servicio: true,
            },
            orderBy: [{ fecha: 'asc' }, { hora: 'asc' }],
        })
        res.json(turnos)
    } catch {
        res.status(500).json({ error: 'Error al listar turnos' })
    }
}

// Obtener turno por ID
const obtenerTurno = async (req, res) => {
    try {
        const { id } = req.params
        const turno = await prisma.turno.findUnique({
            where: { id: Number(id) },
            include: {
                cliente: true,
                barbero: { include: { sucursal: true } },
                servicio: true,
            },
        })
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' })
        res.json(turno)
    } catch {
        res.status(500).json({ error: 'Error al obtener turno' })
    }
}

// Listar turnos disponibles para un barbero en una fecha, considerando duración del servicio
const listarTurnosDisponibles = async (req, res) => {
    try {
        const { barberoId, fecha, servicioId } = req.query
        if (!barberoId || !fecha) {
            return res.status(400).json({ error: 'Faltan parámetros barberoId y fecha' })
        }

        if (!esDiaLaborable(fecha)) {
            return res.json([])
        }

        // Duración del servicio que el cliente quiere reservar
        let duracionNueva = 30
        if (servicioId) {
            const servicio = await prisma.servicio.findUnique({ where: { id: Number(servicioId) } })
            if (servicio) duracionNueva = servicio.duracion
        }

        const barbero = await prisma.barbero.findUnique({
            where: { id: Number(barberoId) },
            include: { sucursal: true },
        })
        if (!barbero) return res.status(404).json({ error: 'Barbero no encontrado' })

        const startMin = toMinutes(barbero.horarioEntrada)
        const endMin = toMinutes(barbero.horarioSalida)

        const dynamicHorarios = []
        // Generar intervalos cada 30 minutos dentro del horario del barbero
        for (let m = startMin; m < endMin; m += 30) {
            const h = Math.floor(m / 60).toString().padStart(2, '0')
            const mn = (m % 60).toString().padStart(2, '0')
            dynamicHorarios.push(`${h}:${mn}`)
        }

        // Obtener turnos activos del barbero ese día con la duración de cada servicio
        const turnosOcupados = await prisma.turno.findMany({
            where: { barberoId: Number(barberoId), fecha, estado: 'activo' },
            include: { servicio: true },
        })

        const esHoy = fecha === hoyArgentina()
        const ahoraMin = esHoy ? horaActualMinutos() : -1

        const disponibles = dynamicHorarios.filter((slot) => {
            const slotMin = toMinutes(slot)
            // Si es hoy, filtrar horarios ya pasados
            if (esHoy && slotMin <= ahoraMin) return false
            // Validar que haya tiempo suficiente para terminar el servicio antes de la salida
            if (slotMin + duracionNueva > endMin) return false

            return !turnosOcupados.some((t) =>
                overlaps(slotMin, duracionNueva, toMinutes(t.hora), t.servicio.duracion)
            )
        })

        res.json(disponibles)
    } catch {
        res.status(500).json({ error: 'Error al listar turnos disponibles' })
    }
}

// Crear turno
const crearTurno = async (req, res) => {
    try {
        const { fecha, hora, nombre, apellido, email, barberoId, servicioId } = req.body

        if (!fecha || !hora || !nombre || !apellido || !email || !barberoId || !servicioId) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' })
        }

        const hoy = hoyArgentina()
        if (fecha < hoy) {
            return res.status(400).json({ error: 'No se pueden reservar turnos en fechas pasadas' })
        }
        if (!esDiaLaborable(fecha)) {
            return res.status(400).json({ error: 'No se atiende los domingos ni los lunes' })
        }
        if (fecha === hoy && toMinutes(hora) <= horaActualMinutos()) {
            return res.status(400).json({ error: 'No se pueden reservar turnos en horarios ya transcurridos' })
        }

        const barbero = await prisma.barbero.findUnique({ where: { id: Number(barberoId) } })
        if (!barbero) return res.status(404).json({ error: 'Barbero no encontrado' })
        if (!barbero.agendaAbierta) {
            return res.status(409).json({ error: 'Este peluquero tiene la agenda cerrada y no acepta nuevas reservas por el momento.' })
        }

        const requestedMin = toMinutes(hora)
        const startMin = toMinutes(barbero.horarioEntrada)
        const endMin = toMinutes(barbero.horarioSalida)
        if (requestedMin < startMin || requestedMin >= endMin) {
            return res.status(400).json({ error: 'Hora no válida: fuera del horario del barbero' })
        }

        const servicio = await prisma.servicio.findUnique({ where: { id: Number(servicioId) } })
        if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' })

        // Verificar solapamiento considerando duraciones
        const turnosExistentes = await prisma.turno.findMany({
            where: { barberoId: Number(barberoId), fecha, estado: 'activo' },
            include: { servicio: true },
        })

        const nuevoStart = toMinutes(hora)
        const conflicto = turnosExistentes.some((t) =>
            overlaps(nuevoStart, servicio.duracion, toMinutes(t.hora), t.servicio.duracion)
        )
        if (conflicto) return res.status(409).json({ error: 'Ese horario se superpone con un turno existente' })

        let cliente = await prisma.cliente.findUnique({ where: { email } })
        if (!cliente) {
            cliente = await prisma.cliente.create({ data: { nombre, apellido, email } })
        }

        const turno = await prisma.turno.create({
            data: {
                fecha, hora,
                clienteId: cliente.id,
                barberoId: Number(barberoId),
                servicioId: Number(servicioId),
            },
            include: {
                cliente: true,
                barbero: { include: { sucursal: true } },
                servicio: true,
            },
        })
        res.status(201).json(turno)
    } catch {
        res.status(500).json({ error: 'Error al crear turno' })
    }
}

// Actualizar turno
const actualizarTurno = async (req, res) => {
    try {
        const { id } = req.params
        const { fecha, hora, barberoId, servicioId, estado } = req.body

        const turno = await prisma.turno.findUnique({ where: { id: Number(id) } })
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' })

        if (fecha || hora || barberoId) {
            const newFecha = fecha || turno.fecha
            const newHora = hora || turno.hora
            const newBarberoId = barberoId ? Number(barberoId) : turno.barberoId

            if (hora) {
                const barberoData = await prisma.barbero.findUnique({ where: { id: newBarberoId } })
                if (barberoData) {
                    const reqMin = toMinutes(hora)
                    if (reqMin < toMinutes(barberoData.horarioEntrada) || reqMin >= toMinutes(barberoData.horarioSalida)) {
                        return res.status(400).json({ error: 'Hora no válida: fuera del horario del barbero' })
                    }
                }
            }

            const newServicioId = servicioId ? Number(servicioId) : turno.servicioId
            const newServicio = await prisma.servicio.findUnique({ where: { id: newServicioId } })

            const turnosExistentes = await prisma.turno.findMany({
                where: { barberoId: newBarberoId, fecha: newFecha, estado: 'activo', id: { not: Number(id) } },
                include: { servicio: true },
            })

            const nuevoStart = toMinutes(newHora)
            const conflicto = turnosExistentes.some((t) =>
                overlaps(nuevoStart, newServicio.duracion, toMinutes(t.hora), t.servicio.duracion)
            )
            if (conflicto) return res.status(409).json({ error: 'Ese horario se superpone con un turno existente' })
        }

        if (servicioId) {
            const servicio = await prisma.servicio.findUnique({ where: { id: Number(servicioId) } })
            if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' })
        }

        if (barberoId) {
            const barbero = await prisma.barbero.findUnique({ where: { id: Number(barberoId) } })
            if (!barbero) return res.status(404).json({ error: 'Barbero no encontrado' })
        }

        const turnoActualizado = await prisma.turno.update({
            where: { id: Number(id) },
            data: {
                fecha: fecha || turno.fecha,
                hora: hora || turno.hora,
                barberoId: barberoId ? Number(barberoId) : turno.barberoId,
                servicioId: servicioId ? Number(servicioId) : turno.servicioId,
                estado: estado || turno.estado,
            },
            include: {
                cliente: true,
                barbero: { include: { sucursal: true } },
                servicio: true,
            },
        })
        res.json(turnoActualizado)
    } catch {
        res.status(500).json({ error: 'Error al actualizar turno' })
    }
}

// Eliminar/cancelar turno (soft delete)
const eliminarTurno = async (req, res) => {
    try {
        const { id } = req.params
        const turno = await prisma.turno.findUnique({ where: { id: Number(id) } })
        if (!turno) return res.status(404).json({ error: 'Turno no encontrado' })

        const turnoActualizado = await prisma.turno.update({
            where: { id: Number(id) },
            data: { estado: 'cancelado' },
        })
        res.json({ mensaje: 'Turno cancelado correctamente', turno: turnoActualizado })
    } catch {
        res.status(500).json({ error: 'Error al cancelar turno' })
    }
}

// Listar turnos de un barbero por fecha
const listarTurnosBarbero = async (req, res) => {
    try {
        const { id } = req.params
        const { fecha } = req.query
        const where = { barberoId: Number(id) }
        if (fecha) where.fecha = fecha

        const turnos = await prisma.turno.findMany({
            where,
            include: { cliente: true, servicio: true },
            orderBy: { hora: 'asc' },
        })
        res.json(turnos)
    } catch {
        res.status(500).json({ error: 'Error al listar turnos del barbero' })
    }
}

module.exports = {
    listarTurnos,
    obtenerTurno,
    listarTurnosDisponibles,
    crearTurno,
    actualizarTurno,
    eliminarTurno,
    listarTurnosBarbero,
}
