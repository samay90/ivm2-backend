const size = require("../../../static/size.json")
const hasher = require("./hasher")

const sizeChecker = (req, res, next) => {
    for ( let i of Object.keys(req.body) ) {
        if ( req.body[i].length > size[i] ) {
            return res.status(400).send(hasher({
                code: 400,
                message: "Size of "+i+" must be less than "+size[i],
                error: true,
                data:{}
            }))
        }
    }
    next();
}

module.exports = sizeChecker