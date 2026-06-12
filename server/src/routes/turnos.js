const express = require('express')
const { body, query } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const turnosController = require('../controllers/turnos')

// Validaciones reutilizables
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

// GET /turnos - Listar por email
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

// GET /turnos/disponibles - Listar disponibles
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

// GET /turnos/:id - Obtener por ID
router.get('/:id', turnosController.obtenerTurno)

// POST /turnos - Crear
router.post('/', validarTurno, handleValidationErrors, turnosController.crearTurno)

// PUT /turnos/:id - Actualizar
router.put(
  '/:id',
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

// DELETE /turnos/:id - Eliminar/Cancelar
router.delete('/:id', turnosController.eliminarTurno)

module.exports = router
