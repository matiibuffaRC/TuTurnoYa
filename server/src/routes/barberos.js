const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const { verificarToken } = require('../middlewares/authMiddleware')

// Importación desestructurada (coincide exactamente con lo exportado en el controlador)
const {
    listarBarberos,
    obtenerBarbero,
    crearBarbero,
    actualizarBarbero,
    eliminarBarbero,
    toggleAgenda,
    actualizarHorarios
} = require('../controllers/barberos')

// Middleware de validación para la creación (POST)
const validarBarbero = [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
    body('telefono').trim().notEmpty().withMessage('El teléfono es obligatorio'),
    body('sucursalId')
        .isInt({ min: 1 })
        .withMessage('El sucursalId debe ser un número válido'),
]

// GET /barberos - Mostrar todos los barberos
router.get('/', listarBarberos)

// GET /barberos/:id - Buscar un barbero por su ID
router.get('/:id', obtenerBarbero)

// POST /barberos - Crear un barbero con validaciones
router.post('/', validarBarbero, handleValidationErrors, crearBarbero)

// PUT /barberos/:id - Actualizar datos de un barbero
router.put(
    '/:id',
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

// DELETE /barberos/:id - Eliminar al barbero seleccionado
router.delete('/:id', eliminarBarbero)

// PATCH /barberos/:id/agenda - Abrir/cerrar agenda (Requiere Token JWT)
router.patch('/:id/agenda', verificarToken, toggleAgenda)

// PATCH /barberos/:id/horarios - Actualizar horarios habilitados (Requiere Token JWT)
router.patch('/:id/horarios', verificarToken, actualizarHorarios)

module.exports = router
