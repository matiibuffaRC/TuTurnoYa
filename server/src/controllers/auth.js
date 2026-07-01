const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET

const login = async (req, res) => {
    try {
        // Traemos el email y la password desde la petición
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
        }

        // 1. Intentar buscar como barbero (con su usuario asociado)
        const barbero = await prisma.barbero.findUnique({
            where: { email },
            include: { sucursal: true, usuario: true },
        })

        if (barbero && barbero.activo && barbero.usuario) {
            const passwordValida = await bcrypt.compare(password, barbero.usuario.password)
            if (!passwordValida) {
                return res.status(401).json({ error: 'Credenciales inválidas' })
            }

            const token = jwt.sign(
                { id: barbero.id, email: barbero.email, rol: 'BARBERO' },
                JWT_SECRET,
                { expiresIn: '2h' }
            )

            // Eliminar datos sensibles antes de retornar
            delete barbero.usuario.password

            return res.json({ token, barbero })
        }

        // 2. Si no es barbero, intentar como Usuario admin/super_admin
        const usuario = await prisma.usuario.findUnique({
            where: { email },
        })

        if (!usuario || !['ADMIN', 'SUPER_ADMIN'].includes(usuario.rol)) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const passwordValida = await bcrypt.compare(password, usuario.password)
        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '2h' }
        )

        const { password: _, ...usuarioSinPassword } = usuario

        return res.json({
            token,
            usuario: usuarioSinPassword,
            rol: usuario.rol,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al iniciar sesión' })
    }
}

module.exports = { login }
