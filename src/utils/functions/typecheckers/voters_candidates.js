const conv = require("../../../../static/conv.json");

const voters_candidates = (data) => {
    if (!Array.isArray(data)) {
        return false
    }else{
        for (let i of data) {
            if (typeof i !== "string" || i.length!=3) {
                return false
            }else if (!Object.keys(conv.program).includes(i[0]) ||  !Object.keys(conv.year).includes(i[1]) || !Object.keys(conv.department).includes(i[2])) {
                return false
            }
        }
        return true;
    }
}

module.exports = voters_candidates