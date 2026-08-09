const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const caPath = path.resolve(process.env.DB_CA_PATH);

console.log("CA path:", caPath);
console.log("CA exists:", fs.existsSync(caPath));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;