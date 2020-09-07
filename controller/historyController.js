const db = require('../database')

const GigtoHistory = async(req, res, next) => {
    const gigId = req.params.gigId
    const star = req.body.star
    const review = req.body.review
    const [gig] = await db.query('select * from gigs where id=?', [gigId])
    if (gig.length > 0){
        const Gig = gig[0]
        db.query('insert into histories(id, id_user, category, jobDesc, salary, workTime, gigLoc, star, review) values(?,?,?,?,?,?,?,?,?)', [gigId, Gig.category, Gig.jobdesc, Gig.salary, Gig.workTime, Gig.gigLoc, star, review])
        .then(()=>{
            req.id = gigId
            next()      
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

const historyController = {
    GigtoHistory
}

module.exports = historyController