const express = require('express')
const router = express.Router()
const { login } = require('../controllers/auth')

// Peticiones POST a la URL /auth/login las redirigimos al controller correspondiente
router.post('/login', login)

module.exports = router
