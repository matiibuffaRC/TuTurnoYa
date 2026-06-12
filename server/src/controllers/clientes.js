const prisma = require('../config/database')

// Listar clientes
const listarClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        turnos: true,
      },
    })
    res.json(clientes)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar clientes' })
  }
}

// Obtener cliente por ID
const obtenerCliente = async (req, res) => {
  try {
    const { id } = req.params
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: {
        turnos: {
          include: {
            barbero: { include: { sucursal: true } },
            servicio: true,
          },
        },
      },
    })
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }
    res.json(cliente)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente' })
  }
}

// Obtener cliente por email
const obtenerClientePorEmail = async (req, res) => {
  try {
    const { email } = req.params
    const cliente = await prisma.cliente.findUnique({
      where: { email },
      include: {
        turnos: {
          include: {
            barbero: { include: { sucursal: true } },
            servicio: true,
          },
        },
      },
    })
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }
    res.json(cliente)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente' })
  }
}

// Crear cliente
const crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body

    // Verificar que el email no existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { email },
    })
    if (clienteExistente) {
      return res.status(409).json({ error: 'El email ya está registrado' })
    }

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        apellido,
        email,
      },
    })
    res.status(201).json(cliente)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente' })
  }
}

// Actualizar cliente
const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, email } = req.body

    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
    })
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    // Si cambia email, verificar que no existe
    if (email && email !== cliente.email) {
      const clienteExistente = await prisma.cliente.findUnique({
        where: { email },
      })
      if (clienteExistente) {
        return res.status(409).json({ error: 'El email ya está registrado' })
      }
    }

    const clienteActualizado = await prisma.cliente.update({
      where: { id: Number(id) },
      data: {
        nombre: nombre || cliente.nombre,
        apellido: apellido || cliente.apellido,
        email: email || cliente.email,
      },
    })
    res.json(clienteActualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente' })
  }
}

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
    })
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    // Verificar si tiene turnos activos
    const turnos = await prisma.turno.findMany({
      where: { clienteId: Number(id), estado: 'activo' },
    })
    if (turnos.length > 0) {
      return res.status(409).json({
        error: 'No se puede eliminar un cliente con turnos activos. Cancele los turnos primero.',
      })
    }

    await prisma.cliente.delete({
      where: { id: Number(id) },
    })
    res.json({ mensaje: 'Cliente eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' })
  }
}

module.exports = {
  listarClientes,
  obtenerCliente,
  obtenerClientePorEmail,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
}
