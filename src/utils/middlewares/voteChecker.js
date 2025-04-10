const { checkPreviousVotes } = require("../../modules/auth");
const lang = require("../../../lang/lang.json");
const hasher = require("../middlewares/hasher");
const { checkIP } = require("../../modules/voting");
const voteChecker =async (req, res, next) => {
    const user = req.user;
    const checkPreviousVotesResponse = await checkPreviousVotes(user.user_id);
    if (checkPreviousVotesResponse.flag>0){
        res.status(400).send(hasher({
            code: 400,
            message: lang.ALREADY_VOTED,
            error: true,
            data: {}
        }))
    }else{
        const raw_ip = (req.ip).split("ffff:");
    	const parsedIp = raw_ip[raw_ip.length-1];
        const checkIPResponse = await checkIP(parsedIp);
        if (checkIPResponse.flag==0){
            res.status(400).send(hasher({
                code: 400,
                message: lang.NOT_AT_BOOTH,
                error: true,
                data: {}
            }))
        }else{
            next();
        }
    }
}
module.exports = voteChecker