const express = require('express')
const router = require('express').Router()
const authRouter = require('./authRouter')
const { upload } = require('../middleware/')


//router
router.get('/ping', (req, res) => {
    res.send('Server Online')
})

//user route
router.use('/auth', authRouter)
//route multer test
router.post('/addPicture', upload.single('pitcure'), function(req, res) {
    res.send("File rceived")
})

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