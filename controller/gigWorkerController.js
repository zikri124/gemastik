const db = require('../database')

const gigByStatus = async (req, res, next) => {
    const status = req.params.status
    const userId = req.user.id

    if (status != 'done') {
        const [query] = await db.query('select category, city, title, createdAt from gigs where status = ? and workerId = ?', [status, userId])
        if(row.length>0){
            res.json({
                "gigs" : query
            })
        } else {
            const error = new Error("No gigs found")
            next(error)    
        }
    } else {
        const [query] = await db.query('select title, category, createdAt, city  from histories where workerId = ?', [userId]) 
        if(row.length>0){
            res.json({
                "gigs" : query
            })
        } else {
            const error = new Error("No gigs found")
            next(error)    
        }
    }
}

const applyOffer = async (req,res, next) => {
    const gigId = req.params.gigId
    db.query('update gigs set status = ? where id = ?', ['Confirmed', gigId])
        .then(() => {
            res.json({
                "success": true,
                "message": "Gig rejected"
            })
        })
        .catch(() => {
            res.status(501)
            const error = new Error("Internal server error")
            next(error)
        })
}

const rejectOffer = async (req, res, next) => {
    const gigId = req.params.gigId
    db.query('update gigs set status = ? where id = ?', ['Rejected', gigId])
        .then(() => {
            res.json({
                "success": true,
                "message": "Gig rejected"
            })
        })
        .catch(() => {
            res.status(501)
            const error = new Error("Internal server error")
            next(error)
        })
}

const cancelWork = async(req, res, next) => {
    const gigId = req.params.gigId

}

const gigWorkerController = {
    gigByStatus,
    applyOffer,
    rejectOffer
}

module.exports = gigWorkerController