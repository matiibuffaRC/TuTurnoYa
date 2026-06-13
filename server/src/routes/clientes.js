const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const clientesController = require('../controllers/clientes')

// Validaciones reutilizables
const validarCliente = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('El email debe ser válido'),
]

// GET /clientes - Listar
router.get('/', clientesController.listarClientes)

// GET /clientes/email/:email - Obtener por email
router.get('/email/:email', clientesController.obtenerClientePorEmail)

// GET /clientes/:id - Obtener por ID
router.get('/:id', clientesController.obtenerCliente)

// POST /clientes - Crear
router.post('/', validarCliente, handleValidationErrors, clientesController.crearCliente)

// PUT /clientes/:id - Actualizar
router.put(
  '/:id',
  [
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('apellido').optional().trim().notEmpty().withMessage('El apellido no puede estar vacío'),
    body('email')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El email no puede estar vacío')
      .isEmail()
      .withMessage('El email debe ser válido'),
  ],
  handleValidationErrors,
  clientesController.actualizarCliente
)

// DELETE /clientes/:id - Eliminar
router.delete('/:id', clientesController.eliminarCliente)

module.exports = router
