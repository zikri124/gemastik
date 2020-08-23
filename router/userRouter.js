const router = require('express').Router()
const userController = require('../controller/userController')
//const { checkToken } = require('../middleware/')

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

module.exports = router