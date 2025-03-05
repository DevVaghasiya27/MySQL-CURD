const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    table: process.env.TABLE,
});

connection.connect((error) => {
    if (error) throw error;
    console.log("Connected to MySQL");
})

module.exports = connection;