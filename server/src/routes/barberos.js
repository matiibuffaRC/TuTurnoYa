const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const { verificarToken } = require('../middlewares/authMiddleware')
const { autorizar } = require('../middlewares/autorizar')
const {
    listarBarberos,
    obtenerBarbero,
    crearBarbero,
    actualizarBarbero,
    eliminarBarbero,
    toggleAgenda,
    actualizarHorarios
} = require('../controllers/barberos')

const validarBarbero = [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
    body('telefono').trim().notEmpty().withMessage('El teléfono es obligatorio'),
    body('sucursalId')
        .isInt({ min: 1 })
        .withMessage('El sucursalId debe ser un número válido'),
]

// Públicas
router.get('/', listarBarberos)
router.get('/:id', obtenerBarbero)

// Solo SUPER_ADMIN
router.post('/', verificarToken, autorizar('SUPER_ADMIN'), validarBarbero, handleValidationErrors, crearBarbero)

router.put(
    '/:id',
    verificarToken,
    autorizar('SUPER_ADMIN'),
    [
        body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
        body('apellido').optional().trim().notEmpty().withMessage('El apellido no puede estar vacío'),
        body('telefono').optional().trim().notEmpty().withMessage('El teléfono no puede estar vacío'),
        body('sucursalId')
            .optional()
            .isInt({ min: 1 })
            .withMessage('El sucursalId debe ser un número válido'),
        body('activo').optional().isBoolean().withMessage('El estado debe ser booleano'),
    ],
    handleValidationErrors,
    actualizarBarbero
)

router.delete('/:id', verificarToken, autorizar('SUPER_ADMIN'), eliminarBarbero)

// BARBERO autenticado (su propia agenda/horarios)
router.patch('/:id/agenda', verificarToken, toggleAgenda)
router.patch('/:id/horarios', verificarToken, actualizarHorarios)

module.exports = router
