const app = require('./app')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
    // console.log('📚 Endpoints disponibles:')
    // console.log('   GET  /health - Estado del servidor')
    // console.log('   GET  /sucursales - Listar sucursales')
    // console.log('   POST /sucursales - Crear sucursal')
    // console.log('   GET  /barberos - Listar barberos')
    // console.log('   POST /barberos - Crear barbero')
    // console.log('   GET  /servicios - Listar servicios')
    // console.log('   POST /servicios - Crear servicio')
    // console.log('   GET  /clientes - Listar clientes')
    // console.log('   POST /clientes - Crear cliente')
    // console.log('   GET  /turnos - Listar turnos por email')
    // console.log('   POST /turnos - Crear turno')
})
