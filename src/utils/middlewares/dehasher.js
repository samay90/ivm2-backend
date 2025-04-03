const hasher = require("./hasher");
const dehasher = (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    if (body && body.body){
        if (typeof body.body !== "string") {
            res.status(400).send(hasher({
                code: 400,
                message: "Invalid body.",
                error: true,
                data: {}
            }))
        }else{
            const parsed = JSON.parse(atob(body.body));
            if (parsed.error) {
                res.status(400).send(hasher({
                    code: 400,
                    message: "Invalid body.",
                    error: true,
                    data: {}
                }))
            }else{
                req.body = parsed
                next(); 
            }
        }
    }else{
        next()
    }
}

module.exports = dehasher