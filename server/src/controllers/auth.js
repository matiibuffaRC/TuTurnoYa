const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET || 'tuturnoya_secret'

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
    }

    // Buscar el barbero por su email, cargando la sucursal y la cuenta de usuario asociada
    const barbero = await prisma.barbero.findUnique({
      where: { email },
      include: { sucursal: true, usuario: true },
    })

    if (!barbero || !barbero.activo || !barbero.usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // Verificar la contraseña contra el hash almacenado en el modelo Usuario
    const passwordValida = await bcrypt.compare(password, barbero.usuario.password)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
      { id: barbero.id, email: barbero.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    // Eliminar datos sensibles antes de retornar la respuesta al frontend
    delete barbero.usuario.password

    res.json({ token, barbero })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

module.exports = { login }
