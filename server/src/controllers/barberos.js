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
    const { nombre, apellido, telefono, sucursalId } = req.body

    // Verificar que la sucursal existe
    const sucursal = await prisma.sucursal.findUnique({
      where: { id: Number(sucursalId) },
    })
    if (!sucursal) {
      return res.status(404).json({ error: 'Sucursal no encontrada' })
    }

    const barbero = await prisma.barbero.create({
      data: {
        nombre,
        apellido,
        telefono,
        sucursalId: Number(sucursalId),
        activo: true,
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
    const { nombre, apellido, telefono, sucursalId, activo } = req.body

    const barbero = await prisma.barbero.findUnique({
      where: { id: Number(id) },
    })
    if (!barbero) {
      return res.status(404).json({ error: 'Barbero no encontrado' })
    }

    // Si cambia sucursalId, verificar que existe
    if (sucursalId) {
      const sucursal = await prisma.sucursal.findUnique({
        where: { id: Number(sucursalId) },
      })
      if (!sucursal) {
        return res.status(404).json({ error: 'Sucursal no encontrada' })
      }
    }

    const barberoActualizado = await prisma.barbero.update({
      where: { id: Number(id) },
      data: {
        nombre: nombre || barbero.nombre,
        apellido: apellido || barbero.apellido,
        telefono: telefono || barbero.telefono,
        sucursalId: sucursalId ? Number(sucursalId) : barbero.sucursalId,
        activo: activo !== undefined ? activo : barbero.activo,
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

module.exports = {
  listarBarberos,
  obtenerBarbero,
  crearBarbero,
  actualizarBarbero,
  eliminarBarbero,
  toggleAgenda,
}
