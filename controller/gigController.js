const db = require('../database')

const addGigs = async (req ,res ,next) => {
    const id = req.user.id
    const title = req.body.title
    const gigType = req.body.gigType
    const category = req.body.category
    const jobdesc = req.body.jobdesc
    const salary = req.body.salary
    const workTime = req.body.workTime
    const province = req.body.province
    const city = req.body.city
    const district = req.body.district
    const address1 = req.body.addressLine1
    const address2 = req.body.addressLine2
    const gigLoc = (province+","+city+","+district+","+address1+","+address2)
    //12 September 2020, 13.00
    db.query('insert into gigs(title, id_owner, gigType, category, jobDesc, salary, workTime, gigLoc, city) values(?,?,?,?,?,?,?)', [title, id, gigType, category, jobdesc, salary, workTime, gigLoc, city])
    .then(()=>{
        res.json({
            "success" :true,
            "message" : "Gig added"
        })
    })
    .catch((err)=>{
        res.status(501)
        res.json({
            "success" : false,
            "error" : err
        })
    })
}

const viewGig = async (req, res, next) => {
    const gigId = req.params.id
    const [row] = await db.query('select * from gigs where id = ?', [gigId])
    if (row.length >0) {
        res.json({
            "gig" : row[0]
        })
    } else {
        const error = new Error("Cant find the gig")
        next(error)
    }
}

const viewGigsbyAddress = async (req,res,next) => {
    const id = req.user.id
    const [user] = await db.query('select address from users where id = ?', [id])
    if (user.length>0) {
        const [row] = await db.query('select id, title, category, city from gigs where city = ?', [user[0].address])
        if(row.length>0){
            res.json({
                "gigs" : row
            })
        } else {
            const error = new Error("No gigs found")
            next(error)    
        }
    } else {
        res.status(404)
        const error = new Error("User not found")
        next(error)
    }
}

const viewGigsbyLatests = async (req,res,next) => {
    const id = req.user.id
    const [user] = await db.query('select address from users where id = ?', [id]) 
    if (user.length>0) {
        const [row] = await db.query('select id, title, category, city from gigs where city = ? order by createdAt desc', [user[0].address])
        if(row.length>0){
            res.json({
                "gigs" : row
            })
        } else {
            const error = new Error("No gigs found")
            next(error)    
        }
    } else {
        res.status(404)
        const error = new Error("User not found")
        next(error)
    }
}

const viewGigsbyCategory = async (req,res,next) => {
    const category = req.params.category
    const id = req.user.id
    const [user] = await db.query('select address from users where id = ?', [id])
    if (user.length>0) {
        const [row] = await db.query('select id, title, category, city from gigs where city = ? and category = ?', [user[0].address, category])
        if(row.length>0){
            res.json({
                "gigs" : row
            })
        } else {
            const error = new Error("No gigs found")
            next(error)    
        }
    } else {
        res.status(404)
        const error = new Error("User not found")
        next(error)
    }
}

const viewGigsbyType = async (req,res,next) => {
    const type = req.params.type
    const id = req.user.id
    const [user] = await db.query('select address from users where id = ?', [id])
    if (user.length>0) {
        const [row] = await db.query('select id, title, category, city from gigs where city = ? and gigType = ?', [user[0].address, type])
        if(row.length>0){
            res.json({
                "gigs" : row
            })
        } else {
            const error = new Error("No gigs found")
            next(error)    
        }
    } else {
        res.status(404)
        const error = new Error("User not found")
        next(error)
    }
}

const applyGig = async (req,res, next) => {
    const userId = req.user.id
    const idGigs = req.params.id
    const [applier] = await db.query('select applier,applierCount from gigs where id = ?', [idGigs])
    if (applier.length>0) {
        const Applier = applier[0]
        var count = Applier.applierCount
        var query = Applier.applier
        const list = query.split(",")        
        
        if (count == 0){
            query = (''+userId+'')
        } else {
            query = (query+","+userId)
            for (let i = 0; i < count; i++) {
                if (userId == list[i]){
                    res.json({
                        "success": false,
                        "message": "You have applied this Gig, wait for notification"
                    })
                    const error = new Error('You have applied this Gig, wait for notification')
                    next(error)
                }
            }
        }

        db.query('update gigs set applier = ?, applierCount=? where id = ?', [query, (count+1), idGigs])
            .then(() => {
                res.json({
                    "success": true,
                    "message": "Applied",
                    "result": query,
                    "count": (count+1)
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

const viewGigApplier = async(req,res,next) => {
    const gigId = req.params.id
    const [Applier] = await db.query('select applier from gigs where id = ? ', [gigId])   
    const queryT = ('select id, name from users where id IN ('+Applier[0].applier+')') 
    const [users] = await db.query(queryT)
    if (users.length>0){
        res.json({
            "result": users
        })
    } else {
        res.json({
            "result": "No applier found"
        })
    }
}

const deleteGig = (req, res, next) => {
    const id = req.id
    db.query('delete from gigs where id = ?', [id])
        .then(() => {
            res.json({
                "success": true
            })
        })
        .catch(() => {
            res.status(404)
            const error = new Error("Gig Not Found")
            next(error)
        })
}

const gigController = {
    addGigs,
    viewGig,
    viewGigsbyAddress,
    viewGigsbyLatests,
    viewGigsbyCategory,
    viewGigsbyType,
    applyGig,
    viewGigApplier,
    deleteGig
}

module.exports = gigController