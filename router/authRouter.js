const router = require('express').Router()
const authController = require('../controller/authController')
const { checkToken } = require('../middleware')

router.post('/register', authController.registerUser)
router.post('/verify',  checkToken, authController.verifyUser) 
router.post('/login', authController.loginUser)
router.post('/cancel', authController.cancelVerifyReq)

router.post('/register1', authController.registerBackup)

module.exports = router