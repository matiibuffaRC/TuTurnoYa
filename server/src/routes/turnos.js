const express = require('express')
const { body, query } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const { verificarToken } = require('../middlewares/authMiddleware')
const turnosController = require('../controllers/turnos')

const validarTurno = [
    body('fecha')
        .trim()
        .notEmpty()
        .withMessage('La fecha es obligatoria')
        .isISO8601()
        .withMessage('La fecha debe estar en formato ISO8601'),
    body('hora')
        .trim()
        .notEmpty()
        .withMessage('La hora es obligatoria')
        .matches(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('La hora debe estar en formato HH:mm'),
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El email es obligatorio')
        .isEmail()
        .withMessage('El email debe ser válido'),
    body('barberoId')
        .isInt({ min: 1 })
        .withMessage('El barberoId debe ser un número válido'),
    body('servicioId')
        .isInt({ min: 1 })
        .withMessage('El servicioId debe ser un número válido'),
]

// Pública — el cliente consulta sus turnos por email
router.get(
    '/',
    query('email')
        .trim()
        .notEmpty()
        .withMessage('El email es obligatorio')
        .isEmail()
        .withMessage('El email debe ser válido'),
    handleValidationErrors,
    turnosController.listarTurnos
)

// Pública — el cliente consulta disponibilidad
router.get(
    '/disponibles',
    query('barberoId')
        .isInt({ min: 1 })
        .withMessage('El barberoId debe ser un número válido'),
    query('fecha')
        .trim()
        .notEmpty()
        .withMessage('La fecha es obligatoria')
        .isISO8601()
        .withMessage('La fecha debe estar en formato ISO8601'),
    handleValidationErrors,
    turnosController.listarTurnosDisponibles
)

// Protegida — solo el barbero autenticado ve su agenda
router.get('/barbero/:id', verificarToken, turnosController.listarTurnosBarbero)

// Pública — el cliente obtiene un turno por ID (para ver su confirmación)
router.get('/:id', turnosController.obtenerTurno)

// Pública — el cliente reserva su turno desde la web
router.post('/', validarTurno, handleValidationErrors, turnosController.crearTurno)

// Pública — el cliente cancela su propio turno (soft delete)
router.delete('/:id', turnosController.eliminarTurno)

// Protegida — solo staff puede modificar datos de un turno
router.put(
    '/:id',
    verificarToken,
    [
        body('fecha')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('La fecha no puede estar vacía')
            .isISO8601()
            .withMessage('La fecha debe estar en formato ISO8601'),
        body('hora')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('La hora no puede estar vacía')
            .matches(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
            .withMessage('La hora debe estar en formato HH:mm'),
        body('barberoId')
            .optional()
            .isInt({ min: 1 })
            .withMessage('El barberoId debe ser un número válido'),
        body('servicioId')
            .optional()
            .isInt({ min: 1 })
            .withMessage('El servicioId debe ser un número válido'),
        body('estado')
            .optional()
            .isIn(['activo', 'cancelado', 'completado'])
            .withMessage('El estado debe ser válido'),
    ],
    handleValidationErrors,
    turnosController.actualizarTurno
)

module.exports = router
