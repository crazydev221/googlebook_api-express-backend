const mysql = require('mysql');
const env = require('../const/env');

// Create MySQL connection
const mysqldb = mysql.createConnection({
    host: env.MYSQL_HOST,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DB
});

module.exports = mysqldb;
