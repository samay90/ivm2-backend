const voteForm = (data) =>{
    if (typeof data !== "object") {
        return false;
    }else{
        if (!Array.isArray(data)){
            return false;
        }else{
            for (let i of data) {
                if (typeof i !== "object"||Array.isArray(i)|| i.post_id==undefined||i.candidate_id==undefined || !Number.isInteger(i.post_id) || !Number.isInteger(i.candidate_id)) {
                    return false;
                }
            }
        }
    }
    return true;
}
module.exports = voteForm