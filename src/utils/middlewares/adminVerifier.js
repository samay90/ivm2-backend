const jwt = require("jsonwebtoken");
const hasher = require("./hasher");
const lang = require("../../../lang/lang.json");
const { getAdminDetails } = require("../../modules/admin");

const adminVerifier	 = (req, res, next) => {
    const rawToken = req.headers.authorization;
    if (!rawToken){
        res.status(401).send(hasher({
            code: 401,
            message: lang.UNAUTHORISED_ACCESS,
            error: true,
            data: {}
        }))
    }else{
        let token = rawToken.split(" ")[1];
        if (!token){
            res.status(401).send(hasher({
                code: 401,
                message: lang.INVALID_TOKEN,
                error: true,
                data: {}
            }))
        }else{
            token = atob(token);
            if (!token) {
                res.status(401).send(hasher({
                    code: 401,
                    message: lang.INVALID_TOKEN,
                    error: true,
                    data: {}
                }))
            }else{
                jwt.verify(token, process.env.JWT_SECRET_KEY,async (err, decoded) => {
                    if (err){
                        if (err.message==="jwt expired") {
                            res.status(401).send(hasher({
                                code: 401,
                                message: lang.TOKEN_EXPIRED,
                                error: true,
                                data: {}
                            }))
                        }else{
                            res.status(401).send(hasher({
                                code: 401,
                                message: lang.INVALID_TOKEN,
                                error: true,
                                data: {}
                            }))
                        }
                    }else{
                        const getUserResponse = await getAdminDetails(decoded.admin_id);
                        const user = await getUserResponse[0];
                        if (!user) {
                            res.status(401).send(hasher({
                                code: 401,
                                message: lang.UNAUTHORISED_ACCESS,
                                error: true,
                                data: {}
                            }))
                        }else{
                            req.user=user;
                            next();
                        }
                    }
                })
            }
        }
    }
};

module.exports = adminVerifier;