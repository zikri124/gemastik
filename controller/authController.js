require('dotenv').config()
const db = require('../database')
const bcrypt = require('bcryptjs')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY
const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
})

const registerUser = async (req, res, next) => {
    const name = req.body.name
    const gender = req.body.gender
    const birthday = req.body.birthday
    const address = req.body.address
    const phoneNum = req.body.phoneNum
    const email = req.body.email
    const isEmail = validator.isEmail(email)

    if (isEmail) {
        const [rows] = await db.query('select * from users where name = ? limit 1', [name])
        if (rows.length == 0) {
            const [rows2] = await db.query('select * from users where email = ? limit 1', [email])
            if (rows2.length == 0) {
                const [rows] = await db.query('select * from users where phoneNum = ? limit 1', [phoneNum])
                if (rows.length == 0) {
                    const password = req.body.password
                    const hashedPassword = await bcrypt.hash(password, 11)
                    
                    const payload = {
                        "name"      : name,
                        "gender"    : gender,
                        "birthday"  : birthday,
                        "address"   : address,
                        "email"     : email,
                        "phoneNum"  : phoneNum,
                        "hashedPassword"   : hashedPassword
                    }
                    const token = await jwt.sign(payload, JWT_KEY)           
                    
                    if(token){
                        nexmo.verify.request({
                            number: phoneNum,
                            brand: 'SKUY',
                            code_length: '4',
                            pin_expiry: '300',
                            lg: 'id-id'
                        }, (err, result) => {
                            if (err){
                                res.status(500)
                                res.json({
                                    "success" : false,
                                    "error" : err
                                })
                            } else {
                                res.json({
                                    "success" : true,
                                    "token" : token,
                                    "request_id" : result.request_id
                                })
                            }
                        })
                    }else{
                        const error = new Error("JWT Error, cant create token")
                        next(error) 
                    }                                       
                } else {
                    res.status(409)
                    const error = new Error("Phone number already registered")
                    next(error)
                }
            } else {
                res.status(409)
                const error = new Error("Email already registered")
                next(error)
            }
        } else {
            res.status(409)
            const error = new Error("Name already exist")
            next(error)
        }
    } else {
        res.status(409)
        const error = new Error("Invalid Email")
        next(error)
    }
}

const cancelVerifyReq = (req,res) => {
    const request_id = req.headers.req_id
    nexmo.verify.control({
        request_id: request_id,
        cmd: 'cancel'
    }, (err, result) => {
        if(err) {
            res.json({
                "success" : false,
                "error" : err
            })
        } else {
            res.json({
                "success" : true,
                "result" : result
            })
        }
    })
}

const verifyUser = (req,res,next) => {
    const code = req.body.code
    const req_id = req.headers.req_id
    const name = req.user.name
    const gender = req.user.gender
    const birthday = req.user.birthday
    const address = req.user.address
    const email = req.user.email
    const phoneNum = req.user.phoneNum
    const hashedPassword = req.user.password
    
    nexmo.verify.check({
        request_id: req_id,
        code: code
    }, async (err, result) => { 
        if(err && result.status != "0") {
            res.status(500)
            res.json({
                "success" : false,
                "error" : err,
                "result" : result
            })
        } else {
            db.query('insert into users(name, gender, birthday, address, email, phoneNum, hashedPassword) values(?,?,?,?,?,?,?)', [name, gender, birthday, address, email, phoneNum, hashedPassword])
            const [last] = await db.query('select Auto_increment from information_schema.TABLES where TABLE_NAME = "users" and TABLE_SCHEMA = "heroku_796e9e1e9d14eff"')
            if (last.length > 0){
                
                    const payload = {
                        "id_user" : last,
                        "name" : name,
                        "email" : email
                    }
                    const token = jwt.sign(payload, JWT_KEY)
                    if(token){
                        res.json({
                            "success" : true,
                            "token" : token,
                            "result" : result,
                            "payload" : payload
                        })
                    }else{
                        const error = new Error("JWT Error, cant create token")
                        next(error)
                    }
                
            } else {
                res.status(500)
                res.json({
                    "success" : false,
                    "error" : err,
                    "sam" : 'sampai sini'
                })
            }
        }
    }) 
}

const loginUser = async (req, res, next) =>{
    const email = req.body.email
    const [rows] = await db.query('select * from users where email = ?',
    [email])
    if(rows.length != 0){
        const user = rows[0]
        const password = req.body.password
        bcrypt.compare(password, user.password)
        .then(async()=>{
            const payload = {
                "id_user" : user.id,
                "email" : user.email
            }
            const token = await jwt.sign(payload, JWT_KEY)
            if(token){
                res.json({
                    "success" : true,
                    "token" : token
                })
            }else{
                const error = new Error("JWT Error, cant create token")
                next(error)
            }
        })
        .catch(()=>{
            const error = new Error("Incorrect password")
            next(error)
        })
    }else{
        const error = new Error("You seems not registered yet")
        next(error)
    }
}

const userController = {
    registerUser,
    verifyUser,
    loginUser,
    cancelVerifyReq
}

module.exports = userController