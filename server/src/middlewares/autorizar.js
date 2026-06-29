const autorizar = (...roles) => {
    return (req, res, next) => {
        if (!req.barbero) {
            return res.status(401).json({ error: 'No autenticado' })
        }

        if (!roles.includes(req.barbero.rol)) {
            return res.status(403).json({ error: 'No tenés permisos para realizar esta acción' })
        }

        next()
    }
}

module.exports = { autorizar }
