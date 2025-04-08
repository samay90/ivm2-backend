const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const expressFileUpload = require("express-fileupload");
const router = require("./src/routes/routes");
const typeChecker = require("./src/utils/middlewares/typeChecker");
const sizeChecker = require("./src/utils/middlewares/sizeChecker");
const dehasher = require("./src/utils/middlewares/dehasher");

dotEnv.config();

app.use(expressFileUpload({ useTempFiles: true , tempFileDir: "ivm/tmp/"}));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",(req,res,next)=>{setTimeout(() => {
    next()
}, 1000);},dehasher,typeChecker,sizeChecker,router);

app.listen(process.env.PORT, process.env.IP);