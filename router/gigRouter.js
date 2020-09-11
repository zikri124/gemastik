const router = require('express').Router()
const gigController = require('../controller/gigController')
const { checkToken } = require('../middleware')

//router.post('/newGig', checkToken, gigController.addGigs)

router.get('/findWorker/:gigId', gigController.findWorker)

router.post('/makeOffer', gigController.makeOffer)

router.get('/:gigId', gigController.viewAnyGig)

router.get('/view/:status', checkToken, gigController.gigByStatus)

router.put('/:status/:gigId', checkToken, gigController.gigSetStatus, gigController.deleteGig)


router.get('/newGig', checkToken, gigController.addGigs, gigController.findWorker)

module.exports = router