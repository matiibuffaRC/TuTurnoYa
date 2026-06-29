const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const { handleValidationErrors } = require('../middlewares/validators')
const { verificarToken } = require('../middlewares/authMiddleware')
const clientesController = require('../controllers/clientes')

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

// Protegidas — solo staff autenticado puede ver/gestionar clientes
router.get('/', verificarToken, clientesController.listarClientes)
router.get('/email/:email', verificarToken, clientesController.obtenerClientePorEmail)
router.get('/:id', verificarToken, clientesController.obtenerCliente)

router.post('/', verificarToken, validarCliente, handleValidationErrors, clientesController.crearCliente)

router.put(
    '/:id',
    verificarToken,
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

router.delete('/:id', verificarToken, clientesController.eliminarCliente)

module.exports = router
