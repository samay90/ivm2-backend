const express = require("express");
const router = express.Router();
const authRouter = require("../controllers/Auth"); 
const userVerifier = require("../utils/middlewares/userVerifier");
const adminRouter = require("../controllers/Admin");
const votingRouter = require("../controllers/Voting");
const voteChecker = require("../utils/middlewares/voteChecker");
const adminVerifier = require("../utils/middlewares/adminVerifier");

router.use("/auth",authRouter);
router.use("/admin",adminVerifier,adminRouter)
router.use("/voting",userVerifier,voteChecker,votingRouter);
module.exports = router;