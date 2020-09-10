require('dotenv').config()
const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.JWT_KEY

module.exports = {
    checkToken: async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1]
            if (token) {
                try {
                    const payload = await jwt.verify(token, JWT_KEY)
                    if (payload) {
                        req.user = payload
                        next()
                    } else {
                        res.status(403)
                        const err = new Error("Wrong Token")
                        next(err)
                    }
                } catch (err) {
                    res.status(500)
                    next(err)
                }
            }
        } else {
            res.status(403)
            const err = new Error("Login First")
            next(err)
        }
    }
}