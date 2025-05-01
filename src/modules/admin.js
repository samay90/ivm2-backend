const db = require("../utils/database/db");
const generateTicket = require("../utils/functions/ticketGenerator");
const getUser = (roll_no) => {
    return new Promise((resolve, reject) => {
        const q = `select * from users where roll_no=?;`;
        db.query(q, [roll_no], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
const updateTickets = () =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as flag from users;`
        db.query(q,(err,result)=>{
            if (err){
                reject(err);
            }else{
                for (let i = 1; i <= result[0].flag; i++) {
                    const q2 = `update users set ticket=? where user_id=?;`;
                    db.query(q2,[generateTicket(),i],(err,result)=>{
                        if (err){
                            reject(err);
                        }
                    })
                }
                resolve(result);
            }
        })
    })
}
const findUser = (email) => {
    return new Promise((resolve, reject) => {
        const q = `select * from admins where email=?;`;
        db.query(q, [email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const getAdminDetails = (id) => {
    return new Promise((resolve, reject) => {
        const q = `select * from admins where admin_id=?;`;
        db.query(q,[id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
const createAdmin = (email,password) => {
    return new Promise((resolve, reject) => {
        const q = `insert into admins(email,password) values(?,?);`;
        db.query(q,[email,password], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const getPosts = () => {
    return new Promise((resolve, reject) => {
        const q = `select * from posts;`;
        db.query(q, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const createPost = (post_name,post_category,voters,allowed) => {
    return new Promise((resolve, reject) => {
        const q = `insert into posts(post_name,post_category,voters,allowed) values(?,?,?,?);`;
        db.query(q,[post_name,post_category,JSON.stringify(voters),allowed], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const deletePost = (post_id) => {
    return new Promise((resolve, reject) => {
        const q = `delete from posts where post_id=?;`;
        db.query(q,[post_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const checkPostExistience = (post_id) => {
    return new Promise((resolve, reject) => {
        const q = `select count(*) as flag from candidates where post_id=?;`;
        db.query(q,[post_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    })
}
const getCandidates = () => {
    return new Promise((resolve, reject) => {
        const q = `select c.*,p.post_id,p.post_name,p.post_category from candidates as c LEFT JOIN posts as p ON c.post_id=p.post_id;`;
        db.query(q, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const createCandidate = (candidate_name,post_id,profile) => {
    return new Promise((resolve, reject) => {
        const q = `insert into candidates(candidate_name,post_id,profile) values(?,?,?);`;
        db.query(q,[candidate_name,post_id,profile], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const checkPost = (post_id) => {
    return new Promise((resolve, reject) => {
        const q = `select count(*) as flag from posts where post_id=?;`;
        db.query(q,[post_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const deleteCandidate = (candidate_id) => {
    return new Promise((resolve, reject) => {
        const q = `delete from candidates where candidate_id=?;`;
        db.query(q,[candidate_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const getMachines = () => {
    return new Promise((resolve, reject) => {
        const q = `select * from machines;`;
        db.query(q, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }); 
}
const createMachine = (machine_name,ip) => {
    return new Promise((resolve, reject) => {
        const q = `insert into machines(machine_name,ip) values(?,?);`;
        db.query(q,[machine_name,ip], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const deleteMachine = (machine_id) => {
    return new Promise((resolve, reject) => {
        const q = `delete from machines where machine_id=?;`;
        db.query(q,[machine_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const getTicket = (roll_no) => {
    return new Promise((resolve, reject) => {
        const q = `select * from users where roll_no=?;`;
        db.query(q,[roll_no], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const getResult = () =>{
    return new Promise((resolve,reject)=>{
        const q = `SELECT 
    p.post_id,
    p.post_name,
    p.post_category,
    COALESCE(c.candidate_id, -1) AS candidate_id,
    COALESCE(c.candidate_name, 'NOTA') AS candidate_name,
    COALESCE(c.profile, null) AS profile,
    COUNT(v.vote_id) AS total_votes
FROM (
    SELECT 
        post_id, candidate_id, candidate_name, profile 
    FROM candidates

    UNION ALL

    -- Generate a NOTA row for each post
    SELECT 
        p.post_id, 
        -1 AS candidate_id, 
        'NOTA' AS candidate_name, 
        null AS profile
    FROM posts p
) c
JOIN posts p ON c.post_id = p.post_id
LEFT JOIN votes v ON c.post_id = v.post_id AND c.candidate_id = v.candidate_id
GROUP BY 
    p.post_id, 
    p.post_name, 
    p.post_category, 
    c.candidate_id, 
    c.candidate_name, 
    c.profile
ORDER BY total_votes DESC;
`;
        db.query(q,(err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}
const getVotes = () =>{
    return new Promise((resolve,reject)=>{
        const q = `select v.vote_id,u.user_id,u.name,u.roll_no,COALESCE(c.candidate_id,-1) as candidate_id,COALESCE(c.candidate_name,'NOTA') as candidate_name,p.post_id,p.post_name
         from votes as v LEFT JOIN users as u ON u.user_id=v.user_id LEFT JOIN candidates as c ON c.candidate_id=v.candidate_id LEFT JOIN posts as p ON p.post_id=v.post_id;`;
        db.query(q,(err,result)=>{
            if (err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}
const getLessPosts = () => {
    return new Promise((resolve, reject) => {
        const q = `select post_id,post_name from posts ;`;
        db.query(q, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const getAdmins = () => {
    return new Promise((resolve, reject) => {
        const q = `select admin_id,email from admins;`;
        db.query(q, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const deleteAdmin = (admin_id) => {
    return new Promise((resolve, reject) => {
        const q = `delete from admins where admin_id=?;`;
        db.query(q,[admin_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const conv = require("../../static/conv.json");
const getUsersVotingData = () => {
    return new Promise((resolve, reject) => {
        const q = `select name,ticket,year,department,roll_no,program,gender,user_id as token_no from users ORDER BY program,year,department,roll_no;`;
        db.query(q, (err, result) => {
            if (err) {
                reject(err);
            } else {
                for (let i of result) {
                    i.department=conv.department[i.department];
                    i.program=conv.program[i.program];
                    i.gender=conv.gender[i.gender];
                    i.year=conv.year[i.year];
                }
                resolve(result);
            }
        });
    });
}
const getTokens = () =>{
    return new Promise((resolve,reject)=>{
        const q = `select user_id as token_no,name,year,department,roll_no,program,gender from users ORDER BY program,year,department,roll_no;`;
        db.query(q,(err,result)=>{
            if (err){
                reject(err);
            }else{
                for (let i of result) {
                    i.department=conv.department[i.department];
                    i.program=conv.program[i.program];
                    i.gender=conv.gender[i.gender];
                    i.year=conv.year[i.year];
                }
                resolve(result);
            }
        })
    })
}
module.exports = {getVotes,getAdmins,getTokens,getUsersVotingData,deleteAdmin,getResult,getLessPosts,updateTickets,getTicket,deleteMachine,createMachine,deleteCandidate,getMachines,checkPost,createCandidate,getCandidates,checkPostExistience,createPost,deletePost,getAdminDetails,getPosts,getUser,createAdmin,findUser};