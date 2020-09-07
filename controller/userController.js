require('dotenv').config()
const db = require('../database')

const viewUser = async (req, res, next) => {
    const id = req.params.id_user
    const [rows] = await db.query('select name, photoProfile from users where id = ?', [id])
    if (rows.length > 0) {
        res.json({
            "id" : id,
            "user" : rows[0]
        })
    } else {
        res.status(501)
        const error = new Error("Internal server error")
        next(error)
    }
}

const findUser = async (req, res, next) => {
    const name = req.body.name
    var user = ('select id, name, photoProfile from users where name like "'+name+'%"')
    const [found] = await db.query(user)
    if(found.length > 0){
        res.json({
            "found" : found
        })
    } else {
        res.json({
            "message" : ("No Results Found for \""+name+"\"")
        })
    }
}

const updateUserData = (req, res, next) => {
    const userId = req.user.id
    const newName = req.body.name
    const newAdress = req.body.address
    db.query('update users set name = ?, address = ? where id = ?', [newName, newAdress, userId])
        .then(() => {
            res.json({
                "success": true,
                "message": "Change name success"
            })
        })
        .catch(() => {
            res.status(404)
            const error = new Error("User Not Found")
            next(error)
        })
}

const addBookmark = async (req,res,next) => {
    const userId = req.user.id
    const userIdMarked = req.params.id
    const [marked] = await db.query('select bookmark from users where id = ?', [userId])
    if (marked.length>0) {
        const Marked = marked[0]
        var query = Marked
        
        if (query.length == 0){
            query = (''+userIdMarked+'')
        } else {
            query = (query+","+userIdMarked)
            const list = query.split(",")
            for (let i = 0; i < count; i++) {
                if (userId == list[i]){
                    res.json({
                        "success": false,
                        "message": "User has been marked"
                    })
                    const error = new Error('User has been marked')
                    next(error)
                }
            }
        }

        db.query('update users set bookmark = ? where id = ?', [query, userId])
            .then(() => {
                res.json({
                    "success": true,
                    "message": "Marked",
                    "result": query
                })
            }).catch(() => {
                res.json({
                    "success": false
                })
            })
    } else {
        res.status(501)
        const error = new Error('Internal server error')
        next(error)
    }
}

const userController = {
    viewUser,
    findUser,
    updateUserData,
    addBookmark
}

module.exports = userController