const router = require('express').Router()
const historyController = require('../controller/historyController')
const gigController = require('../controller/gigController')
const { checkToken } = require('../middleware')

router.post('/complete/:gigId', checkToken, historyController.GigtoHistory, gigController.deleteGig)

module.exports = router