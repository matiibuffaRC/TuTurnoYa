const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const serviciosController = require('../controllers/servicios')

// Validaciones reutilizables
const validarServicio = [
    body('tipo').trim().notEmpty().withMessage('El tipo de servicio es obligatorio'),
    body('precio')
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido mayor o igual a 0'),
    body('duracion')
        .isInt({ min: 1 })
        .withMessage('La duración debe ser un número entero mayor a 0'),
]

// GET /servicios - Listar
router.get('/', serviciosController.listarServicios)

// GET /servicios/:id - Obtener por ID
router.get('/:id', serviciosController.obtenerServicio)

// POST /servicios - Crear
router.post('/', validarServicio, handleValidationErrors, serviciosController.crearServicio)

// PUT /servicios/:id - Actualizar
router.put(
    '/:id',
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

// DELETE /servicios/:id - Eliminar
router.delete('/:id', serviciosController.eliminarServicio)

module.exports = router
