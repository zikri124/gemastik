const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const router = require('./router')

const server = app.listen(port, () => {
    console.log('Server Online, Listening to port', server.address().port)
})

app.use(express.json())

app.use('/', router)