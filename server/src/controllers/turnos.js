const prisma = require('../config/database')

const HORARIOS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
]

// Listar turnos por email del cliente
const listarTurnos = async (req, res) => {
  try {
    const { email } = req.query
    if (!email) {
      return res.status(400).json({ error: 'Falta el parámetro email' })
    }

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
  } catch (error) {
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
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' })
    }
    res.json(turno)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener turno' })
  }
}

// Listar turnos disponibles para un barbero en una fecha
const listarTurnosDisponibles = async (req, res) => {
  try {
    const { barberoId, fecha } = req.query
    if (!barberoId || !fecha) {
      return res.status(400).json({ error: 'Faltan parámetros barberoId y fecha' })
    }

    const ocupados = await prisma.turno.findMany({
      where: {
        barberoId: Number(barberoId),
        fecha,
        estado: 'activo',
      },
      select: { hora: true },
    })
    const horasOcupadas = ocupados.map((t) => t.hora)
    const disponibles = HORARIOS.filter((h) => !horasOcupadas.includes(h))
    res.json(disponibles)
  } catch (error) {
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

    // Verificar que la hora es válida
    if (!HORARIOS.includes(hora)) {
      return res.status(400).json({ error: 'Hora no válida' })
    }

    // Verificar que el barbero existe
    const barbero = await prisma.barbero.findUnique({
      where: { id: Number(barberoId) },
    })
    if (!barbero) {
      return res.status(404).json({ error: 'Barbero no encontrado' })
    }

    // Verificar que el servicio existe
    const servicio = await prisma.servicio.findUnique({
      where: { id: Number(servicioId) },
    })
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' })
    }

    // Verificar que el horario no está ocupado
    const conflicto = await prisma.turno.findFirst({
      where: {
        barberoId: Number(barberoId),
        fecha,
        hora,
        estado: 'activo',
      },
    })
    if (conflicto) {
      return res.status(409).json({ error: 'Ese horario ya está reservado' })
    }

    // Buscar o crear cliente
    let cliente = await prisma.cliente.findUnique({
      where: { email },
    })
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nombre,
          apellido,
          email,
        },
      })
    }

    // Crear turno
    const turno = await prisma.turno.create({
      data: {
        fecha,
        hora,
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
  } catch (error) {
    res.status(500).json({ error: 'Error al crear turno' })
  }
}

// Actualizar turno
const actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params
    const { fecha, hora, barberoId, servicioId, estado } = req.body

    const turno = await prisma.turno.findUnique({
      where: { id: Number(id) },
    })
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' })
    }

    // Si se cambia hora, fecha o barbero, verificar disponibilidad
    if (fecha || hora || barberoId) {
      const newFecha = fecha || turno.fecha
      const newHora = hora || turno.hora
      const newBarberoId = barberoId ? Number(barberoId) : turno.barberoId

      // Verificar que la hora es válida
      if (hora && !HORARIOS.includes(hora)) {
        return res.status(400).json({ error: 'Hora no válida' })
      }

      const conflicto = await prisma.turno.findFirst({
        where: {
          id: { not: Number(id) },
          barberoId: newBarberoId,
          fecha: newFecha,
          hora: newHora,
          estado: 'activo',
        },
      })
      if (conflicto) {
        return res.status(409).json({ error: 'Ese horario ya está reservado' })
      }
    }

    // Si cambia servicioId, verificar que existe
    if (servicioId) {
      const servicio = await prisma.servicio.findUnique({
        where: { id: Number(servicioId) },
      })
      if (!servicio) {
        return res.status(404).json({ error: 'Servicio no encontrado' })
      }
    }

    // Si cambia barberoId, verificar que existe
    if (barberoId) {
      const barbero = await prisma.barbero.findUnique({
        where: { id: Number(barberoId) },
      })
      if (!barbero) {
        return res.status(404).json({ error: 'Barbero no encontrado' })
      }
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
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar turno' })
  }
}

// Eliminar/cancelar turno
const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params
    const turno = await prisma.turno.findUnique({
      where: { id: Number(id) },
    })
    if (!turno) {
      return res.status(404).json({ error: 'Turno no encontrado' })
    }

    const turnoActualizado = await prisma.turno.update({
      where: { id: Number(id) },
      data: { estado: 'cancelado' },
    })
    res.json({ mensaje: 'Turno cancelado correctamente', turno: turnoActualizado })
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar turno' })
  }
}

module.exports = {
  listarTurnos,
  obtenerTurno,
  listarTurnosDisponibles,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
}
