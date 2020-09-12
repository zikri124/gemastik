const db = require('../database')

const addGigs = async (req ,res ,next) => {
    const id = req.user.id
    const title = req.body.title
    const gigType = req.body.gigType
    const category = req.body.category
    const jobdesc = req.body.jobdesc
    const duration = req.body.duration
    const workTime = req.body.workTime
    const note = req.body.note
    const city = req.body.city
    const gigLoc = req.body.address

    ///gig time!!!

    const [last] = await db.query('select Auto_increment from information_schema.TABLES where TABLE_NAME = "gigs" and TABLE_SCHEMA = "heroku_796e9e1e9d14eff"')
    
    if (last.length > 0){
        db.query("insert into gigs(title, ownerId, gigStatus, title, gigType, category, jobDesc, duration, workTime, note, gigLoc, city) values(?,?,?,?,?,?,?,?,?,?,?,?)", [title, id, 'send', gigType, title, category, jobdesc, duration, workTime, note, gigLoc, city])
        .then(()=>{
            req.gigId = last[0].Auto_increment
            next()
            /*res.json({
                "success" :true,
                "gigId" : last[0].Auto_increment
            })*/
        })
        .catch((err)=>{
            res.status(501)
            res.json({
                "success" : false,
                "error" : err
            })
        })
    } else {
        const error = new Error("Internal server error")
        next(error)
    }
}

const findWorker = async (req, res, next) => {
    const gigId = req.gigId
    //const gigId = req.params.gigid
    const [gigData] = await db.query('select city,workDate, workTime,category from gigs where id=?', [gigId])
    if (gigData.length>0){
        //wroktime
        const [worker] = await db.query('select users.id, users.name, workers.category, workers.salary, workers.avgRate from users inner join workers on users.id = workers.id_user where users.city=? and workers.status=?',[gigData[0].city, '1'])
        if (worker.length>0){
            res.json({
                "workers": worker,
                "gigId": gigId
            })
        } else {
            res.status(200)
            res.json({
                "success" : true,
                "message" : "Can't find any worker at the work Time"
            })
        }
    } else {
        res.status(501)
        const error = new Error("Internal server error")
        next(error)
    }
}

const makeOffer = async (req, res, next) => {
    const gigId = req.params.gigId
    const workerId = req.params.workerId
    
    db.query('update gigs set worker = ?, status = ? where id = ?', [workerId, 'On confirmation', gigId])
            .then(() => {
                res.json({
                    "success": true,
                    "message": "Gig offer has been created"
                })
            }).catch(() => {
                res.json({
                    "success": false
                })
            })        
}

const viewAnyGig = async (req, res, next) => {
    const gigId = req.params.id
    const [row] = await db.query('select gigs.id, gigs.ownerId, gigs.title, gigs.status, gigs.workerId, gigs.category, gigs.jobDesc, gigs.salary, gigs.duration, gigs.workTime, gigs.gigLoc, gigs.city, gigs.createdAt, users.name from gigs inner join users on gigs.ownerId = users.id where id = ?', [gigId])
    if (row.length >0) {
        const [row2] = await db.query('select users.id, workers.category, workers.salary, users.name from workers inner join users on users.id = workers.userId where id = ?', [row[0].workerId])
        res.json({
            "gig" : row[0],
            "worker" : row2[0]
        })
    } else {
        const error = new Error("Cant find the gig")
        next(error)
    }
}

//nampilin daftar gigs by tab(send, on working, done)
const gigByStatus = async (req, res, next) => {
    const status = req.params.status
    const userId = req.user.id

    if (status != 'done') {
        const [row] = await db.query('select * from gigs where gigStatus = ? and ownerId = ?', [status, userId]) //order by createdAt desc
        if(row.length>0){
            res.json({
                "foundGigs" : true,
                "gigs" : row
            })
        } else {
            res.status(200)
            res.json({
                "foundGigs" : false,
                "gigs" : row
            })  
        }
    } else {
        const [row] = await db.query('select * from histories where ownerId = ?', [userId]) 
        if(row.length>0){
            res.json({
                "gigs" : row
            })
        } else {
            const error = new Error("No gigs found")
            next(error)    
        }
    }
}

const gigSetStatus = async(req, res, next) => {
    const status = req.params.status
    const id_user = req.user.id
    const gigId = req.params.gigId
    const [gig] = await db.query('select * from gigs where id=?', [gigId])
    if (gig.length > 0){
        const Gig = gig[0]
        db.query('insert into histories(gigId, ownerId,, gigStatus, workerId, title, category, jobDesc, salary, workTime, duration, gigLoc, city, createdAt) values(?,?,?,?,?,?,?,?,?,?,?,?)', [gigId, id_user, status, Gig.workerId, Gig.title, Gig.category, Gig.jobdesc, Gig.salary, Gig.workDate, Gig.workTime, Gig.gigLoc, Gig.city, Gig.createdAt])
        .then(()=>{
            if(status == "done"){
                next()
            } else {
                res.status(200)
                next()
            }
                  
        })
        .catch((err)=>{
            res.status(501)
            res.json({
                "success" : false,
                "error" : err
            })
        })
    } else {
        res.status(501)
        const error = new Error("Internal server error")
        next(error)
    }
}

const deleteGig = (req, res, next) => {
    const id = req.params.gigId
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
    findWorker,
    makeOffer,
    viewAnyGig,
    gigByStatus,
    gigSetStatus,
    deleteGig
}

module.exports = gigController