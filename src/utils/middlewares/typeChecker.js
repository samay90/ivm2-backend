const types = require("../../../static/types.json")
const hasher = require("./hasher")

const typeChecker = (req, res, next) => {
    if (req.body && req.body.post_id){
        req.body.post_id = parseInt(req.body.post_id);
    }
    for ( let i of Object.keys(req.body) ) {
        if ( types[i]&&typeof req.body[i] !== types[i] ) {
            return res.status(400).send(hasher({
                code: 400,
                message: "Type of "+i+" must be "+types[i],
                error: true,
                data:{}
            }))
        }
    }
    next();
}

module.exports = typeChecker