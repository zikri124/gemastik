const router = require('express').Router()
const userController = require('../controller/userController')
const { checkToken } = require('../middleware')

router.get('/search', userController.findUser)

router.get('/worker/:workerId', userController.viewWorker)

router.get('/view/:id', userController.viewUser)

router.put('/update', checkToken, userController.updateUserData)

module.exports = router