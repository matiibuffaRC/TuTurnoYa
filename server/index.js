const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// ── Obtenemos las sucursales 
app.get('/sucursales', async (req, res) => {
  const sucursales = await prisma.sucursal.findMany()
  res.json(sucursales)
})

// ── Obtenemos a los barberos 
app.get('/barberos', async (req, res) => {
  const { sucursalId } = req.query
  const where = { activo: true }
  if (sucursalId) where.sucursalId = Number(sucursalId)
  const barberos = await prisma.barbero.findMany({ where })
  res.json(barberos)
})

// ── Obtenemos los servicios 
app.get('/servicios', async (req, res) => {
  const servicios = await prisma.servicio.findMany()
  res.json(servicios)
})

// ── Turnos disponibles 
const HORARIOS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '16:00', '16:30', '17:00', '17:30', '18:00', 
  '18:30', '19:00', '19:30', '20:00', '20:30'
]

// Pasamos como parametro el id del babero para obtener sus turnos
// y buscamos los que no están ocupados
app.get('/turnos/disponibles', async (req, res) => {
  const { barberoId, fecha } = req.query
  if (!barberoId || !fecha) {
    return res.status(400).json({ error: 'Faltan parámetros barberoId y fecha' })
  }
  const ocupados = await prisma.turno.findMany({
    where: { barberoId: Number(barberoId), fecha, estado: 'activo' },
    select: { hora: true },
  })
  const horasOcupadas = ocupados.map((t) => t.hora)
  const disponibles = HORARIOS.filter((h) => !horasOcupadas.includes(h))
  res.json(disponibles)
})

// ── Buscamos los turnos por email 
app.get('/turnos', async (req, res) => {
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
})

// ── Creamos un turno 
app.post('/turnos', async (req, res) => {
  const { fecha, hora, nombre, apellido, email, barberoId, servicioId } = req.body

  if (!fecha || !hora || !nombre || !apellido || !email || !barberoId || !servicioId) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' })
  }

  const conflicto = await prisma.turno.findFirst({
    where: { barberoId: Number(barberoId), fecha, hora, estado: 'activo' },
  })
  if (conflicto) return res.status(409).json({ error: 'Ese horario ya está reservado' })

  // Buscar o crear cliente
  let cliente = await prisma.cliente.findUnique({ where: { email } })
  if (!cliente) {
    cliente = await prisma.cliente.create({ data: { nombre, apellido, email } })
  }

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
})

// ── Cancelar turno 
app.delete('/turnos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const turno = await prisma.turno.findUnique({ where: { id } })
  if (!turno) return res.status(404).json({ error: 'Turno no encontrado' })
  await prisma.turno.update({ where: { id }, data: { estado: 'cancelado' } })
  res.json({ mensaje: 'Turno cancelado correctamente' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
