const express = require('express')
const router = require('express').Router()
//const userRouter = require('./userRouter')

router.get('/', (req, res) => {
    res.send('Hai!!')
})

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