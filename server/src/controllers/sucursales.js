const prisma = require('../config/database')

// Listar todas las sucursales
const listarSucursales = async (req, res) => {
  try {
    const sucursales = await prisma.sucursal.findMany({
      include: {
        barberos: true,
      },
    })
    res.json(sucursales)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar sucursales' })
  }
}

// Obtener una sucursal por ID
const obtenerSucursal = async (req, res) => {
  try {
    const { id } = req.params
    const sucursal = await prisma.sucursal.findUnique({
      where: { id: Number(id) },
      include: {
        barberos: true,
      },
    })
    if (!sucursal) {
      return res.status(404).json({ error: 'Sucursal no encontrada' })
    }
    res.json(sucursal)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sucursal' })
  }
}

// Crear sucursal
const crearSucursal = async (req, res) => {
  try {
    const { nombre, direccion, telefono, horarioApertura, horarioCierre } = req.body
    const sucursal = await prisma.sucursal.create({
      data: {
        nombre,
        direccion,
        telefono,
        horarioApertura,
        horarioCierre,
      },
    })
    res.status(201).json(sucursal)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear sucursal' })
  }
}

// Actualizar sucursal
const actualizarSucursal = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, direccion, telefono, horarioApertura, horarioCierre } = req.body

    const sucursal = await prisma.sucursal.findUnique({
      where: { id: Number(id) },
    })
    if (!sucursal) {
      return res.status(404).json({ error: 'Sucursal no encontrada' })
    }

    const sucursalActualizada = await prisma.sucursal.update({
      where: { id: Number(id) },
      data: {
        nombre: nombre || sucursal.nombre,
        direccion: direccion || sucursal.direccion,
        telefono: telefono || sucursal.telefono,
        horarioApertura: horarioApertura || sucursal.horarioApertura,
        horarioCierre: horarioCierre || sucursal.horarioCierre,
      },
    })
    res.json(sucursalActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar sucursal' })
  }
}

// Eliminar sucursal
const eliminarSucursal = async (req, res) => {
  try {
    const { id } = req.params
    const sucursal = await prisma.sucursal.findUnique({
      where: { id: Number(id) },
    })
    if (!sucursal) {
      return res.status(404).json({ error: 'Sucursal no encontrada' })
    }

    // Verificar si tiene barberos asociados
    const barberos = await prisma.barbero.findMany({
      where: { sucursalId: Number(id) },
    })
    if (barberos.length > 0) {
      return res
        .status(409)
        .json({ error: 'No se puede eliminar una sucursal con barberos asociados' })
    }

    await prisma.sucursal.delete({
      where: { id: Number(id) },
    })
    res.json({ mensaje: 'Sucursal eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar sucursal' })
  }
}

module.exports = {
  listarSucursales,
  obtenerSucursal,
  crearSucursal,
  actualizarSucursal,
  eliminarSucursal,
}
