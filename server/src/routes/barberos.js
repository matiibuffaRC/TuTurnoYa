const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const barberosController = require('../controllers/barberos')

// Validaciones reutilizables
const validarBarbero = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
  body('telefono').trim().notEmpty().withMessage('El teléfono es obligatorio'),
  body('sucursalId')
    .isInt({ min: 1 })
    .withMessage('El sucursalId debe ser un número válido'),
]

// GET /barberos - Listar
router.get('/', barberosController.listarBarberos)

// GET /barberos/:id - Obtener por ID
router.get('/:id', barberosController.obtenerBarbero)

// POST /barberos - Crear
router.post('/', validarBarbero, handleValidationErrors, barberosController.crearBarbero)

// PUT /barberos/:id - Actualizar
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
  barberosController.actualizarBarbero
)

// DELETE /barberos/:id - Eliminar (soft delete)
router.delete('/:id', barberosController.eliminarBarbero)

const { verificarToken } = require('../middlewares/authMiddleware')

// PATCH /barberos/:id/agenda - Abrir/cerrar agenda (requiere token)
router.patch('/:id/agenda', verificarToken, barberosController.toggleAgenda)

// PATCH /barberos/:id/horarios - Actualizar horarios habilitados (requiere token)
router.patch('/:id/horarios', verificarToken, barberosController.actualizarHorarios)

module.exports = router
