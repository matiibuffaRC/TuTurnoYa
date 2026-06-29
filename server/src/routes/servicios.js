const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const { verificarToken } = require('../middlewares/authMiddleware')
const { autorizar } = require('../middlewares/autorizar')
const serviciosController = require('../controllers/servicios')

const validarServicio = [
    body('tipo').trim().notEmpty().withMessage('El tipo de servicio es obligatorio'),
    body('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido mayor o igual a 0'),
    body('duracion')
        .isInt({ min: 1 })
        .withMessage('La duración debe ser un número entero mayor a 0'),
]

// Públicas
router.get('/', serviciosController.listarServicios)
router.get('/:id', serviciosController.obtenerServicio)

// BARBERO, ADMIN o SUPER_ADMIN
router.post('/', verificarToken, autorizar('BARBERO', 'ADMIN', 'SUPER_ADMIN'), validarServicio, handleValidationErrors, serviciosController.crearServicio)

router.put(
    '/:id',
    verificarToken,
    autorizar('BARBERO', 'ADMIN', 'SUPER_ADMIN'),
    [
        body('tipo').optional().trim().notEmpty().withMessage('El tipo de servicio no puede estar vacío'),
        body('precio')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('El precio debe ser un número válido mayor o igual a 0'),
        body('duracion')
            .optional()
            .isInt({ min: 1 })
            .withMessage('La duración debe ser un número entero mayor a 0'),
    ],
    handleValidationErrors,
    serviciosController.actualizarServicio
)

router.delete('/:id', verificarToken, autorizar('BARBERO', 'ADMIN', 'SUPER_ADMIN'), serviciosController.eliminarServicio)

module.exports = router
