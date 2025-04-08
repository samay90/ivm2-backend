const express = require("express");
const authRouter = express.Router();
const lang = require("../../lang/lang.json");
const { getVerifcation, checkPreviousVotes, checkIp } = require("../modules/auth");
const jwt = require("jsonwebtoken");
const getTime = require("../utils/functions/getTimeString");
const hasher = require("../utils/middlewares/hasher");
const dotEnv = require("dotenv")
const bcrypt = require("bcrypt");
const checker = require("../utils/functions/checker");
const { findUser } = require("../modules/admin");
dotEnv.config();
authRouter.post("/login",async (req, res) => {
    const body = req.body;
    const checkerResponse = checker(body,["ticket","roll_no"]);
    if (checkerResponse){
        res.status(400).send(hasher({
            code: 400,
            message: checkerResponse,
            error: true,
            data: {}
        }))
    }else{
        const checkIpResponse = await checkIp(req.ip);
        if (checkIpResponse.flag==0){
            res.status(400).send(hasher({
                code: 400,
                message: lang.NOT_AT_BOOTH,
                error: true,
                data: {}
            }))
        }else{
            const findUserFlag = await getVerifcation(body.ticket,body.roll_no);
            if (findUserFlag.length==0){
                res.status(400).send(hasher({
                    code: 400,
                    message: lang.INVALID_TICKET,
                    error: true,
                    data: {}
                }))
            }else{
                const checkPreviousVote = await checkPreviousVotes(findUserFlag[0].user_id);
                if (checkPreviousVote.flag>0){
                    res.status(400).send(hasher({
                        code: 400,
                        message: lang.ALREADY_VOTED,
                        error: true,
                        data: {}
                    }))
                }else{
                    const token = jwt.sign({user_id:findUserFlag[0].user_id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
                    res.status(200).send(hasher({
                        code: 200,
                        message: "Login successful.",
                        error: false,
                        data: {token: btoa(token)}
                    }))
                }
            }
        }
    }
})
authRouter.post("/admin/login",async (req, res) => {
    const body = req.body;
    const checkerResponse = checker(body,["email","password"]);
    if (checkerResponse){
        res.status(400).send(hasher({
            code: 400,
            message: checkerResponse,
            error: true,
            data: {}
        }))
    }else{
        const findUserResponse = await findUser(body.email);
        if (findUserResponse){
            if (findUserResponse.length > 0) {
                const checkPassword = await bcrypt.compare(body.password,findUserResponse[0].password);
                if (checkPassword){
                    const token = jwt.sign({admin_id:findUserResponse[0].admin_id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
                    res.status(200).send(hasher({
                        code: 200,
                        message: "User logged in successfully.",
                        error: false,
                        data: {token:btoa(token)}
                    }))
                }else{
                    res.status(400).send(hasher({
                        code: 400,
                        message: lang.INVALID_PASSWORD,
                        error: true,
                        data: {}
                    }))
                }
            }else{
                res.status(400).send(hasher({
                    code: 400,
                    message: lang.USER_NOT_FOUND,
                    error: true,
                    data: {}
                }))
            }
        }else{
            res.status(400).send(hasher({
                code: 400,
                message: lang.SOMETHING_WENT_WORNG,
                error: true,
                data: {}
            }))
        }
    }
})
module.exports = authRouter