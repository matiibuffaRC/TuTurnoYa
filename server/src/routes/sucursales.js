const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const { verificarToken } = require('../middlewares/authMiddleware')
const { autorizar } = require('../middlewares/autorizar')
const sucursalesController = require('../controllers/sucursales')

const validarSucursal = [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('direccion').trim().notEmpty().withMessage('La dirección es obligatoria'),
    body('telefono').trim().notEmpty().withMessage('El teléfono es obligatorio'),
    body('horarioApertura').trim().notEmpty().withMessage('El horario de apertura es obligatorio'),
    body('horarioCierre').trim().notEmpty().withMessage('El horario de cierre es obligatorio'),
]

// Públicas
router.get('/', sucursalesController.listarSucursales)
router.get('/:id', sucursalesController.obtenerSucursal)

// Solo SUPER_ADMIN
router.post('/', verificarToken, autorizar('SUPER_ADMIN'), validarSucursal, handleValidationErrors, sucursalesController.crearSucursal)

router.put(
    '/:id',
    verificarToken,
    autorizar('SUPER_ADMIN'),
    [
        body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
        body('direccion').optional().trim().notEmpty().withMessage('La dirección no puede estar vacía'),
        body('telefono').optional().trim().notEmpty().withMessage('El teléfono no puede estar vacío'),
        body('horarioApertura').optional().trim().notEmpty().withMessage('El horario de apertura no puede estar vacío'),
        body('horarioCierre').optional().trim().notEmpty().withMessage('El horario de cierre no puede estar vacío'),
    ],
    handleValidationErrors,
    sucursalesController.actualizarSucursal
)

router.delete('/:id', verificarToken, autorizar('SUPER_ADMIN'), sucursalesController.eliminarSucursal)

module.exports = router
