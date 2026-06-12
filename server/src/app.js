const express = require('express')
const cors = require('cors')

// Importar rutas
const sucursalesRoutes = require('./routes/sucursales')
const barberosRoutes = require('./routes/barberos')
const serviciosRoutes = require('./routes/servicios')
const turnosRoutes = require('./routes/turnos')
const clientesRoutes = require('./routes/clientes')

// Crear aplicación
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' })
})

// Rutas
app.use('/sucursales', sucursalesRoutes)
app.use('/barberos', barberosRoutes)
app.use('/servicios', serviciosRoutes)
app.use('/turnos', turnosRoutes)
app.use('/clientes', clientesRoutes)

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

module.exports = app
