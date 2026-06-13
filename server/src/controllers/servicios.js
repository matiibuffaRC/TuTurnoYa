const prisma = require('../config/database')

// Listar servicios
const listarServicios = async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany()
    res.json(servicios)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar servicios' })
  }
}

// Obtener servicio por ID
const obtenerServicio = async (req, res) => {
  try {
    const { id } = req.params
    const servicio = await prisma.servicio.findUnique({
      where: { id: Number(id) },
      include: {
        turnos: true,
      },
    })
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' })
    }
    res.json(servicio)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener servicio' })
  }
}

// Crear servicio
const crearServicio = async (req, res) => {
  try {
    const { tipo, precio, duracion } = req.body
    const servicio = await prisma.servicio.create({
      data: {
        tipo,
        precio: parseFloat(precio),
        duracion: parseInt(duracion),
      },
    })
    res.status(201).json(servicio)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear servicio' })
  }
}

// Actualizar servicio
const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params
    const { tipo, precio, duracion } = req.body

    const servicio = await prisma.servicio.findUnique({
      where: { id: Number(id) },
    })
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' })
    }

    const servicioActualizado = await prisma.servicio.update({
      where: { id: Number(id) },
      data: {
        tipo: tipo || servicio.tipo,
        precio: precio !== undefined ? parseFloat(precio) : servicio.precio,
        duracion: duracion !== undefined ? parseInt(duracion) : servicio.duracion,
      },
    })
    res.json(servicioActualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar servicio' })
  }
}

// Eliminar servicio
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params
    const servicio = await prisma.servicio.findUnique({
      where: { id: Number(id) },
    })
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' })
    }

    // Verificar si tiene turnos asociados
    const turnos = await prisma.turno.findMany({
      where: { servicioId: Number(id) },
    })
    if (turnos.length > 0) {
      return res
        .status(409)
        .json({ error: 'No se puede eliminar un servicio con turnos asociados' })
    }

    await prisma.servicio.delete({
      where: { id: Number(id) },
    })
    res.json({ mensaje: 'Servicio eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar servicio' })
  }
}

module.exports = {
  listarServicios,
  obtenerServicio,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
}
