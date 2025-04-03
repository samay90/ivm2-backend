const express = require("express");
const votingRouter = express.Router();
const lang = require("../../lang/lang.json");
const typeChecker = require("../utils/middlewares/typeChecker");
const userVerifier = require("../utils/middlewares/userVerifier");
const hasher = require("../utils/middlewares/hasher");
const { getVotingDetails, getVoteInfo, addVote } = require("../modules/voting");
const checker = require("../utils/functions/checker");
const voteForm = require("../utils/functions/typecheckers/voteForm");
votingRouter.get("/details",async(req,res)=>{
    const user = req.user;
    let getVotingDetailsResponse = await getVotingDetails(user.code,user.gender);
    let parsedData = [];
    let obj = {};
    let ind = 0;
    for (let i of getVotingDetailsResponse) {
        if (obj[i.post_id]!=undefined){
            parsedData[obj[i.post_id]].candidates.push({candidate_id:i.candidate_id,candidate_name:i.candidate_name,profile:i.profile});
        }else{
            if (i.candidate_id!=undefined){
                obj[i.post_id] = ind;
                parsedData[ind] = {post_id:i.post_id,post_name:i.post_name,post_category:i.post_category,candidates:i.candidate_id?[{candidate_id:i.candidate_id,candidate_name:i.candidate_name,profile:i.profile}]:[]};
                ind++;
            }
        }
    }
    res.send(hasher({
        code: 200,
        message: "Voting details fetched successfully.",
        error: false,
        data: parsedData
    }))
})
votingRouter.post("/vote",userVerifier,async(req,res)=>{
    const user = req.user;
    const body = req.body;
    const flagType = voteForm(body.form);
    if (!flagType) {
        res.status(400).send(hasher({
            code: 400,
            message: lang.UNAUTHORISED_ACCESS,
            error: true,
            data: {}
        }))
    }else{
        const getVoteInfoResponse = await getVoteInfo(user.code,user.gender,body.form);
        var counter = body.form.filter((i)=>i.candidate_id==-1).length;
        let hash = {};
        for (let i of getVoteInfoResponse) {
            if (!hash[i.post_id]){
                hash[i.post_id] = 1;
                counter++;
            }
        }
        if (counter!==body.form.length) {
            res.status(400).send(hasher({
                code: 400,
                message: lang.UNAUTHORISED_ACCESS,
                error: true,
                data: {}
            }))
        }else{
            const addVoteResponse = await addVote(user.user_id,body.form);
            if (addVoteResponse) {
                res.status(200).send(hasher({
                    code: 200,
                    message: "Voted successfully.",
                    error: false,
                    data: {}
                }))
            }else{
                res.status(400).send(hasher({
                    code: 400,
                    message: lang.SOMETHING_WENT_WORNG,
                    error: true,
                    data: {}
                }))
            }
        }
    }
})


module.exports = votingRouter   