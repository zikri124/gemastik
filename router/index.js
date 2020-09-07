const express = require('express')
const router = require('express').Router()
const authRouter = require('./authRouter')
const userRouter = require('./userRouter')
const gigRouter = require('./gigRouter')
const { upload } = require('../middleware/')


//router
router.get('/ping', (req, res) => {
    res.send('Server Online')
})

//auth route
router.use('/auth', authRouter)
//user route
router.use('/user', userRouter)
//gig route
router.use('/gig', gigRouter)
//get the profile image
router.use('/profile', express.static('images/profile'))
router.use('/identityCard', express.static('images/identity'))

//route multer test
/*router.post('/addPicture', upload.single('pitcure'), function(req, res) {
    res.send("File rceived")
})*/

////////////////////////////////////////////////////

router.use(notFound)
router.use(errorHandler)

function notFound(req, res, next) {
    res.status(404)
    const err = new Error("Page not found")
    next(err)
}

function errorHandler(req, res, next) {
    res.status(res.statusCode || 500)
    const message = err.message || "Internal server error"
    res.json({
        "message" : message
    })
}

module.exports = router