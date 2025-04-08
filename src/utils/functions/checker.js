const checker = (data,fields) =>{
    for (let i of fields){
        if (data[i]==undefined || data[i]=="" || data[i]==null){
            return i+" field is required."
        }
    }
    return false
}
module.exports = checker