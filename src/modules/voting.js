const db = require("../utils/database/db");
const getTime = require("../utils/functions/getTimeString");

const getCandidates = async (post_id)=>{
    return new Promise((resolve,reject)=>{
        const q = `select * from candidates where post_id=?;`;
        db.query(q,[post_id],(err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        }
        )
    })
}
const getVotingDetails = async (code,gender)=>{
    return new Promise((resolve,reject)=>{
        const q = `select p.post_id,p.post_name,p.post_category,c.* from posts as p LEFT JOIN candidates as c ON p.post_id=c.post_id where JSON_CONTAINS(p.voters,'"${code}"','$') and (p.allowed=2 or p.allowed=${gender});`;
        db.query(q,async (err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}
const getVoteInfo = async (code,gender,data)=>{
    return new Promise((resolve,reject)=>{
        const q = `select p.post_id,c.candidate_id from posts as p LEFT JOIN candidates as c ON p.post_id=c.post_id where JSON_CONTAINS(p.voters,'"${code}"','$') and (p.allowed=2 or p.allowed=${gender}) and (${data.map((i)=> ` (p.post_id='${i.post_id}' and c.candidate_id='${i.candidate_id}') `).join(" or ")});`;
        db.query(q,async (err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}
const addVote = async (user_id,data)=>{
    return new Promise((resolve,reject)=>{
        const q = `insert into votes(user_id,post_id,candidate_id,created_at) values ?;`;
        db.query(q,[data.map((item)=>[user_id,item.post_id,item.candidate_id,getTime()])],(err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}
const checkIP = async (ip)=>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as flag from machines where ip=?;`;
        db.query(q,[ip],(err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result[0]);
            }
        })
    })
}
module.exports = {getVotingDetails,getVoteInfo,getCandidates,addVote,checkIP}