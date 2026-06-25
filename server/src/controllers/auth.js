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

        // Obtenemos al barbero en la DB apartir de sus datos
        const barbero = await prisma.barbero.findUnique({
            where: { email },
            include: { sucursal: true },
        })

        if (!barbero || !barbero.activo) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const passwordValida = await bcrypt.compare(password, barbero.password)
            if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const token = jwt.sign(
            { 
                id: barbero.id, email: barbero.email 
            },
            JWT_SECRET,
            { 
                expiresIn: '8h' 
            }
        )

        const { password: _, ...barberoSinPassword } = barbero
        res.json({ token, barbero: barberoSinPassword })
        
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' })
    }
}

module.exports = { login }
