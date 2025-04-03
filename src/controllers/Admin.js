const express = require("express");
const adminRouter = express.Router();
const lang = require("../../lang/lang.json");
const hasher = require("../utils/middlewares/hasher");
const rules = require("../../static/rules.json");
const { getUser, updateTickets, getPosts, createPost, checkPostExistience, deletePost, getCandidates, createCandidate, deleteCandidate, getMachines, createMachine, deleteMachine, createAdmin, getTicket, getResult, getVotes } = require("../modules/admin");
const checker = require("../utils/functions/checker");
const voters_candidates = require("../utils/functions/typecheckers/voters_candidates");
const getTime = require("../utils/functions/getTimeString");
const {uploadFile} = require("../utils/upload/upload");
const bcrypt = require("bcrypt");

adminRouter.get("/user/:roll_no",async (req,res)=>{
    const user = req.user;
    if (!rules.GET_USER_DETAILS.includes(user.role)){
        res.status(401).send(hasher({
            code: 401,
            message: lang.UNAUTHORISED_ACCESS,
            error: true,
            data: {}
        }))
    }else{
        const {roll_no} = req.params;
        if (!roll_no) {
            res.status(400).send(hasher({
                code: 400,
                message: lang.USER_NOT_FOUND,
                error: true,
                data: {}
            }))
        }else{
            const getUserResponse =await getUser(roll_no);
            if (getUserResponse){
                if (getUserResponse.length > 0) {
                    res.status(200).send(hasher({
                        code: 200,
                        message: "User details fetched successfully.",
                        error: false,
                        data: getUserResponse[0],
                    }))
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
    }
})
adminRouter.get("/generate-ticket",async (req,res)=>{
    const updateTicketsResponse = await updateTickets();
    if (updateTicketsResponse){
        res.status(200).send(hasher({
            code: 200,
            message: "Tickets updated successfully.",
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
})
adminRouter.post("/create-admin",async (req,res)=>{
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
        const hashedPassword =await bcrypt.hash(body.password,10);
        const createAdminResponse = await createAdmin(body.email,hashedPassword);
        if (createAdminResponse){
            if (createAdminResponse.affectedRows > 0) {
                res.status(200).send(hasher({
                    code: 200,
                    message: "Admin created successfully.",
                    error: false,
                    data: {}
                }))
            }else{
                res.status(400).send(hasher({
                    code: 400,
                    message: lang.ADMIN_ALREADY_EXIST,
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
adminRouter.get("/posts",async (req,res)=>{
    const getPostsResponse = await getPosts();
    if (getPostsResponse){
        res.status(200).send(hasher({
            code: 200,
            message: "Posts fetched successfully.",
            error: false,
            data: getPostsResponse
        }))
    }else{
        res.status(400).send(hasher({
            code: 400,
            message: lang.SOMETHING_WENT_WORNG,
            error: true,
            data: {}
        }))
    }

})
adminRouter.post("/post/new",async (req,res)=>{
    const body = req.body;
    const checkerResponse = checker(body,["post_name","post_category","voters","allowed"]);
    if (checkerResponse){
        res.status(400).send(hasher({
            code: 400,
            message: checkerResponse,
            error: true,
            data: {}
        }))
    }else{
        const checkVoters = voters_candidates(body.voters);
        if (checkVoters){
            const createPostResponse = await createPost(body.post_name,body.post_category,body.voters,body.allowed);
            if (createPostResponse){
                if (createPostResponse.affectedRows > 0) {
                    res.status(200).send(hasher({
                        code: 200,
                        message: "Post created successfully.",
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
            }else{
                res.status(400).send(hasher({
                    code: 400,
                    message: lang.SOMETHING_WENT_WORNG,
                    error: true,
                    data: {}
                }))
            }
        }else{
            res.status(400).send(hasher({
                code: 400,
                message: lang.UNAUTHORISED_ACCESS   ,
                error: true,
                data: {}
            }))
        }
    }
})
adminRouter.post("/post/delete",async (req,res)=>{
    const body = req.body;
    const checkerResponse = checker(body,["post_id"]);
    if (checkerResponse){
        res.status(400).send(hasher({
            code: 400,
            message: checkerResponse,
            error: true,
            data: {}
        }))
    }else{
        const checkPostExistienceResponse = await checkPostExistience(body.post_id);
        if (checkPostExistienceResponse.flag>0){
            res.status(400).send(hasher({
                code: 400,
                message: lang.POST_USED,
                error: true,
                data: {}
            }))
        }else{
            const deletePostResponse = await deletePost(body.post_id);
            if (deletePostResponse){
                if (deletePostResponse.affectedRows > 0) {
                    res.status(200).send(hasher({
                        code: 200,
                        message: "Post deleted successfully.",
                        error: false,
                        data: {}
                    }))
                }else{
                    res.status(400).send(hasher({
                        code: 400,
                        message: lang.NO_SUCH_POST,
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
    }
})
adminRouter.get("/candidates",async (req,res)=>{
    const getCandidatesResponse = await getCandidates();
    if (getCandidatesResponse){
        res.status(200).send(hasher({
            code: 200,
            message: "Candidates fetched successfully.",
            error: false,
            data: getCandidatesResponse
        }))
    }else{
        res.status(400).send(hasher({
            code: 400,
            message: lang.SOMETHING_WENT_WORNG,
            error: true,
            data: {}
        }))
    }
})
adminRouter.post("/candidate/new",async (req,res)=>{
    const body = req.body;
    const checkerResponse = checker(body,["candidate_name","post_id"]);
    if (checkerResponse){
        res.status(400).send(hasher({
            code: 400,
            message: checkerResponse,
            error: true,
            data: {}
        }))
    }else{
        if (!req.files || !req.files.profile || Array.isArray(req.files.profile)){
            res.status(400).send(hasher({
                code: 400,
                message: lang.UNAUTHORISED_ACCESS,
                error: true,
                data: {}
            }))
        }else{
            console.log(req.files.profile)
            if (!(req.files.profile.mimetype == "image/jpeg" || req.files.profile.mimetype == "image/png" || req.files.profile.mimetype == "image/jpg") || req.files.profile.size > 10**6){
                res.status(400).send(hasher({
                    code: 400,
                    message: lang.INVALID_PROFILE,
                    error: true,
                    data: {}
                }))
            }else{
                const uploadFileResponse = await uploadFile(req.files.profile.tempFilePath);
                if (uploadFileResponse){
                    const createCandidateResponse = await createCandidate(body.candidate_name,body.post_id,uploadFileResponse.secure_url);
                    if (createCandidateResponse){
                        if (createCandidateResponse.affectedRows > 0) {
                            res.status(200).send(hasher({
                                code: 200,
                                message: "Candidate created successfully.",
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
        }
    }
})
adminRouter.post("/candidate/delete",async (req,res)=>{
    const body = req.body;
    const checkerResponse = checker(body,["candidate_id"]);
    if (checkerResponse){
        res.status(400).send(hasher({
            code: 400,
            message: checkerResponse,
            error: true,
            data: {}
        }))
    }else{
        const deleteCandidateResponse = await deleteCandidate(body.candidate_id);
        if (deleteCandidateResponse){
            if (deleteCandidateResponse.affectedRows > 0) {
                res.status(200).send(hasher({
                    code: 200,
                    message: "Candidate deleted successfully.",
                    error: false,
                    data: {}
                }))
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
adminRouter.get("/machines",async (req,res)=>{
    const getMachinesResponse = await getMachines();
    if (getMachinesResponse){
        res.status(200).send(hasher({
            code: 200,
            message: "Machines fetched successfully.",
            error: false,
            data: getMachinesResponse
        }))
    }else{
        res.status(400).send(hasher({
            code: 400,
            message: lang.SOMETHING_WENT_WORNG,
            error: true,
            data: {}
        }))
    }
})
adminRouter.post("/machine/new",async (req,res)=>{
    const body = req.body;
    const checkerResponse = checker(body,["machine_name","ip"]);
    if (checkerResponse){
        res.status(400).send(hasher({
            code: 400,
            message: checkerResponse,
            error: true,
            data: {}
        }))
    }else{
        const createMachineResponse = await createMachine(body.machine_name,body.ip);
        if (createMachineResponse){
            if (createMachineResponse.affectedRows > 0) {
                res.status(200).send(hasher({
                    code: 200,
                    message: "Machine created successfully.",
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
adminRouter.post("/machine/delete",async (req,res)=>{
    const body = req.body;
    const checkerResponse = checker(body,["machine_id"]);
    if (checkerResponse){
        res.status(400).send(hasher({
            code: 400,
            message: checkerResponse,
            error: true,
            data: {}
        }))
    }else{
        const deleteMachineResponse = await deleteMachine(body.machine_id);
        if (deleteMachineResponse){
            if (deleteMachineResponse.affectedRows > 0) {
                res.status(200).send(hasher({
                    code: 200,
                    message: "Machine deleted successfully.",
                    error: false,
                    data: {}
                }))
            }else{
                res.status(400).send(hasher({
                    code: 400,
                    message: lang.INVALID_MACHINE_ID,
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
adminRouter.get("/:roll_no/ticket",async (req,res)=>{
    const {roll_no} = req.params;
    const getTicketResponse = await getTicket(roll_no);
    if (getTicketResponse){
        if (getTicketResponse.length > 0) {
            res.status(200).send(hasher({
                code: 200,
                message: "Ticket fetched successfully.",
                error: false,
                data: getTicketResponse[0]
            }))
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
})
adminRouter.get("/result",async (req,res)=>{
    const getResultResponse = await getResult();
    let parsedData = [];
    let obj = {};
    let ind = 0;
    for (let i of getResultResponse) {
        if (obj[i.post_id]!=undefined){
            parsedData[obj[i.post_id]].candidates.push({candidate_id:i.candidate_id,candidate_name:i.candidate_name,profile:i.profile,total_votes:i.total_votes});
        }else{
            if (i.candidate_id!=undefined){
                obj[i.post_id] = ind;
                parsedData[ind] = {post_id:i.post_id,post_name:i.post_name,post_category:i.post_category,candidates:i.candidate_id?[{candidate_id:i.candidate_id,candidate_name:i.candidate_name,profile:i.profile,total_votes:i.total_votes}]:[]};
                ind++;
            }
        }
    }
    res.status(200).send(hasher({
        code: 200,
        message: "Result fetched successfully.",
        error: false,
        data: parsedData
    }))
})
adminRouter.get("/votes/csv",async (req,res)=>{
    const getVotesResponse = await getVotes();
    if (getVotesResponse){
        res.status(200).send(hasher({
            code: 200,
            message: "Votes fetched successfully.",
            error: false,
            data: getVotesResponse
        }))
    }else{
        res.status(400).send(hasher({
            code: 400,
            message: lang.SOMETHING_WENT_WORNG,
            error: true,
            data: {}
        }))
    }
})
module.exports = adminRouter;