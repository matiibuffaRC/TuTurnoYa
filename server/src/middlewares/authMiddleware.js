const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'tuturnoya_secret'

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' })
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET)
        req.barbero = payload
        next()
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' })
    }
}

module.exports = { verificarToken }
