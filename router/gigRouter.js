const router = require('express').Router()
const gigController = require('../controller/gigController')
const { checkToken } = require('../middleware')

router.get('/', checkToken, gigController.viewGigsbyAddress)
router.get('/latest', checkToken, gigController.viewGigsbyLatests)
router.get('/category/:category', gigController.viewGigsbyCategory)
router.get('/type', gigController.viewGigsbyType) //online or onsite
router.get('/:id', gigController.viewGig)
router.get('/:id/applier', gigController.viewGigApplier)
router.post('/addGig', checkToken, gigController.addGigs)
router.put('/:id/apply', checkToken, gigController.applyGig)

module.exports = router