const mysql = require("mysql2");
const dotEnv = require("dotenv");
dotEnv.config();
const db = mysql.createPool({
    host:process.env.DATABASE_HOST_NAME,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
    port:process.env.DATABASE_PORT
})

module.exports = db 