const router = require('express').Router()
const gigWorkerController = require('../controller/gigWorkerController')
const { checkToken } = require('../middleware')

router.get('/view/:status', checkToken, gigWorkerController.gigByStatus)

router.put('/:gigId/apply', gigWorkerController.applyOffer)

router.put('/:gigId/reject', gigWorkerController.rejectOffer)

module.exports = router