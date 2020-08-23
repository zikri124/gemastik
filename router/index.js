const express = require('express')
const router = require('express').Router()
//const userRouter = require('./userRouter')
const multer = require('multer')
const path = require('path')

//storage engine

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/profile/')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() +
        path.extname(file.originalname))
    }
})

//init upload
const upload = multer({storage : storage})

router.get('/', (req, res) => {
    res.send('Hai!!')
})
router.get('/get', (req, res) => {
    res.send('get')
})

//route multer
router.post('/addPicture', upload.single('pitcure'), function(req, res) {
    res.send("File rceived")
})

////////////////////////////////////////////////////

//router.use('/user', userRouter)

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