const router = require('express').Router()
const historyController = require('../controller/historyController')
const gigController = require('../controller/gigController')

router.post('/complete', historyController.GigtoHistory, gigController.deleteGig)

module.exports = router