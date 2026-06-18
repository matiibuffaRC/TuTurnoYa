const prisma = require('../config/database')

// Listar barberos
const listarBarberos = async (req, res) => {
  try {
    const { sucursalId, activo } = req.query
    const where = {}

    if (sucursalId) {
      where.sucursalId = Number(sucursalId)
    }
    if (activo !== undefined) {
      where.activo = activo === 'true'
    } else {
      where.activo = true // Por defecto, mostrar solo activos
    }

    const barberos = await prisma.barbero.findMany({
      where,
      include: {
        sucursal: true,
      },
    })
    res.json(barberos)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar barberos' })
  }
}

// Obtener barbero por ID
const obtenerBarbero = async (req, res) => {
  try {
    const { id } = req.params
    const barbero = await prisma.barbero.findUnique({
      where: { id: Number(id) },
      include: {
        sucursal: true,
        turnos: true,
      },
    })
    if (!barbero) {
      return res.status(404).json({ error: 'Barbero no encontrado' })
    }
    res.json(barbero)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener barbero' })
  }
}

// Crear barbero
const crearBarbero = async (req, res) => {
  try {
    const { nombre, apellido, telefono, sucursalId, horaInicio, horaFin } = req.body

    // Verificar que la sucursal existe
    const sucursal = await prisma.sucursal.findUnique({
      where: { id: Number(sucursalId) },
    })
    if (!sucursal) {
      return res.status(404).json({ error: 'Sucursal no encontrada' })
    }

    const hInicio = horaInicio || '09:00'
    const hFin = horaFin || '18:00'

    // Validar que horaInicio < horaFin
    if (hInicio >= hFin) {
      return res.status(400).json({ error: 'La hora de inicio debe ser anterior a la hora de fin' })
    }

    // Validar que horaFin no sea posterior al cierre de la peluquería
    if (hFin > sucursal.horarioCierre) {
      return res.status(400).json({ 
        error: `El horario de fin no puede ser posterior al cierre de la peluquería (${sucursal.horarioCierre})` 
      })
    }

    const barbero = await prisma.barbero.create({
      data: {
        nombre,
        apellido,
        telefono,
        sucursalId: Number(sucursalId),
        activo: true,
        horaInicio: hInicio,
        horaFin: hFin,
      },
      include: {
        sucursal: true,
      },
    })
    res.status(201).json(barbero)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear barbero' })
  }
}

// Actualizar barbero
const actualizarBarbero = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, telefono, sucursalId, activo, horaInicio, horaFin } = req.body

    const barbero = await prisma.barbero.findUnique({
      where: { id: Number(id) },
      include: { sucursal: true }
    })
    if (!barbero) {
      return res.status(404).json({ error: 'Barbero no encontrado' })
    }

    let sucursal = barbero.sucursal

    // Si cambia sucursalId, verificar que existe
    if (sucursalId) {
      sucursal = await prisma.sucursal.findUnique({
        where: { id: Number(sucursalId) },
      })
      if (!sucursal) {
        return res.status(404).json({ error: 'Sucursal no encontrada' })
      }
    }

    const newHoraInicio = horaInicio || barbero.horaInicio
    const newHoraFin = horaFin || barbero.horaFin

    // Validar que horaInicio < horaFin
    if (newHoraInicio >= newHoraFin) {
      return res.status(400).json({ error: 'La hora de inicio debe ser anterior a la hora de fin' })
    }

    // Validar que horaFin no sea posterior al cierre de la peluquería
    if (newHoraFin > sucursal.horarioCierre) {
      return res.status(400).json({ 
        error: `El horario de fin no puede ser posterior al cierre de la peluquería (${sucursal.horarioCierre})` 
      })
    }

    const barberoActualizado = await prisma.barbero.update({
      where: { id: Number(id) },
      data: {
        nombre: nombre || barbero.nombre,
        apellido: apellido || barbero.apellido,
        telefono: telefono || barbero.telefono,
        sucursalId: sucursalId ? Number(sucursalId) : barbero.sucursalId,
        activo: activo !== undefined ? activo : barbero.activo,
        horaInicio: newHoraInicio,
        horaFin: newHoraFin,
      },
      include: {
        sucursal: true,
      },
    })
    res.json(barberoActualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar barbero' })
  }
}

// Eliminar barbero (soft delete - marcar como inactivo)
const eliminarBarbero = async (req, res) => {
  try {
    const { id } = req.params
    const barbero = await prisma.barbero.findUnique({
      where: { id: Number(id) },
    })
    if (!barbero) {
      return res.status(404).json({ error: 'Barbero no encontrado' })
    }

    const barberoActualizado = await prisma.barbero.update({
      where: { id: Number(id) },
      data: { activo: false },
    })
    res.json({ mensaje: 'Barbero eliminado correctamente', barbero: barberoActualizado })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar barbero' })
  }
}

// Toggle agenda abierta/cerrada
const toggleAgenda = async (req, res) => {
  try {
    const { id } = req.params
    const barbero = await prisma.barbero.findUnique({ where: { id: Number(id) } })
    if (!barbero) return res.status(404).json({ error: 'Barbero no encontrado' })

    const barberoActualizado = await prisma.barbero.update({
      where: { id: Number(id) },
      data: { agendaAbierta: !barbero.agendaAbierta },
      include: { sucursal: true },
    })
    const { password: _, ...sinPassword } = barberoActualizado
    res.json(sinPassword)
  } catch {
    res.status(500).json({ error: 'Error al cambiar estado de la agenda' })
  }
}

// Actualizar solo los horarios del barbero
const actualizarHorarios = async (req, res) => {
  try {
    const { id } = req.params
    const { horaInicio, horaFin } = req.body

    if (!horaInicio || !horaFin) {
      return res.status(400).json({ error: 'horaInicio y horaFin son obligatorios' })
    }

    // Validar que horaInicio < horaFin
    if (horaInicio >= horaFin) {
      return res.status(400).json({ error: 'La hora de inicio debe ser anterior a la hora de fin' })
    }

    const barbero = await prisma.barbero.findUnique({ 
      where: { id: Number(id) },
      include: { sucursal: true }
    })
    if (!barbero) {
      return res.status(404).json({ error: 'Barbero no encontrado' })
    }

    // Validar que horaFin no sea posterior al cierre de la peluquería
    if (horaFin > barbero.sucursal.horarioCierre) {
      return res.status(400).json({ 
        error: `El horario de fin no puede ser posterior al cierre de la peluquería (${barbero.sucursal.horarioCierre})` 
      })
    }

    const barberoActualizado = await prisma.barbero.update({
      where: { id: Number(id) },
      data: {
        horaInicio,
        horaFin,
      },
      include: { sucursal: true },
    })
    const { password: _, ...sinPassword } = barberoActualizado
    res.json(sinPassword)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar horarios' })
  }
}

module.exports = {
  listarBarberos,
  obtenerBarbero,
  crearBarbero,
  actualizarBarbero,
  eliminarBarbero,
  toggleAgenda,
  actualizarHorarios,
}
