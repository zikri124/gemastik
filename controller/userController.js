/*
const db = require('../database');

const registerUser = async (req, res, next) => {
    const name = req.body.name
    const sex = req.body.sex
    const birthday = req.body.birthday
    const address = req.body.address
    const email = req.body.email
    const phoneNum = req.body.phoneNum

    const [rows] = await db.query('select * from users where name = ? limit 1', [name])
    if (rows.length == 0) {
        const isEmail = validator.isEmail(email)
        if (isEmail) {
            const [rows2] = await db.query('select * from users where email = ? limit 1', [email])
            if (rows2.length == 0) {
                const [rows] = await db.query('select * from users where phoneNum = ? limit 1', [phoneNum])
                if (rows.length == 0) {
                    const password = req.body.password
                    const hashedPassword = await bcrypt.hash(password, 11)

                    db.query('insert into users(name, sex, birthday, address, email, phoneNum, password) values(?,?,?,?,?,?,?)', [name, sex, birthday, address, email, phoneNum, hashedPassword])
                    .then(()=>{
                        res.json({
                            "success" : true,
                            "message" : "Register success"
                        })
                    })
                    .catch((err)=> {
                        res.status(500)
                        res.json({
                            "success" : false,
                            "error" : err
                        })
                    })
                } else {
                    res.status(409)
                }
                
            }
        }
    }
}
*/