const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const sucursalesController = require('../controllers/sucursales')

// Validaciones reutilizables
const validarSucursal = [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('direccion').trim().notEmpty().withMessage('La dirección es obligatoria'),
    body('telefono').trim().notEmpty().withMessage('El teléfono es obligatorio'),
    body('horarioApertura').trim().notEmpty().withMessage('El horario de apertura es obligatorio'),
    body('horarioCierre').trim().notEmpty().withMessage('El horario de cierre es obligatorio'),
]

// GET /sucursales - Listar todas
router.get('/', sucursalesController.listarSucursales)

// GET /sucursales/:id - Obtener por ID
router.get('/:id', sucursalesController.obtenerSucursal)

// POST /sucursales - Crear
router.post('/', validarSucursal, handleValidationErrors, sucursalesController.crearSucursal)

// PUT /sucursales/:id - Actualizar
router.put(
    '/:id',
    [
        body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
        body('direccion')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('La dirección no puede estar vacía'),
        body('telefono')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El teléfono no puede estar vacío'),
        body('horarioApertura')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El horario de apertura no puede estar vacío'),
        body('horarioCierre')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('El horario de cierre no puede estar vacío'),
    ],
    handleValidationErrors,
    sucursalesController.actualizarSucursal
)

// DELETE /sucursales/:id - Eliminar
router.delete('/:id', sucursalesController.eliminarSucursal)

module.exports = router
