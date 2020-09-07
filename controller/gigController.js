const db = require('../database')

const addGigs = async (req ,res ,next) => {
    const id = req.user.id
    const category = req.body.category
    const jobdesc = req.body.jobdesc
    const salary = req.body.salary
    const workTime = req.body.workTime
    const gigLoc = req.body.gigLoc
    
    db.query('insert into gigs(id_owner, category, jobDesc, salary, workTime, gigLoc) values(?,?,?,?,?,?)', [id, category, jobdesc, salary, workTime, gigLoc])
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
    const [row] = await ('select * from gigs where id = ?', [gigId])
    if (row.length >0) {
        res.json({
            "gig" : row[0]
        })
    } else {
        const error = new Error("Internal server error")
        next(error)
    }
}

const viewGigsbyAddress = async (req,res,next) => {
    const [user] = await('select address from users where id = ?', [user.id])
    if (user.length>0) {
        const [row] = await ('select * from gigs where address = ?', [user[0]])
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
    const [row] = await ('select * from gigs order by createdAt desc')
    if(row.length>0){
        res.json({
            "gigs" : row
        })
    } else {
        const error = new Error("No gigs found")
        next(error)    
    }
}

const viewGigsbyCategory = async (req,res,next) => {
    const category = req.params.category
    const [row] = await ('select * from gigs where category = ?', [category])
    if(row.length>0){
        res.json({
            "gigs" : row
        })
    } else {
        const error = new Error("No gigs found")
        next(error)    
    }
}

const viewGigsbyType = async (req,res,next) => {
    const type = req.body.type
    const [row] = await ('select * from gigs where gigType = ?', [type])
    if(row.length>0){
        res.json({
            "gigs" : row
        })
    } else {
        const error = new Error("No gigs found")
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