const db = require("../utils/database/db");
const getTime = require("../utils/functions/getTimeString");


const getVerifcation = (ticket,roll_no) =>{
    return new Promise((resolve,reject)=>{
        const q = `select user_id from users where ticket=? and roll_no=?;`
        db.query(q,[ticket,roll_no],(err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}
const checkPreviousVotes = (user_id) => {
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as flag from votes where user_id=?;`;
        db.query(q,[user_id],(err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result[0]);
            }
        })
    })
}
const getUserDetails = (user_id) =>{
    return new Promise((resolve,reject)=>{
        const q = `select * from users where user_id=?;`;
        db.query(q,[user_id],(err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}
module.exports = {getVerifcation,checkPreviousVotes,getUserDetails}