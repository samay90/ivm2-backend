const getTime = (d = new Date())=>{
    const date = new Date(d);
    
    return date.getTime();
}

module.exports = getTime