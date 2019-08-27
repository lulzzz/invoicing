var mysql = require('mysql');
var fs = require('fs');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dateStrings: true,
    multipleStatements: true
});

// To run the database creation script
// var initQuery = fs.readFileSync(__dirname + '/db.sql').toString()

// pool.query(initQuery, (err, result) => {
//     if (err)
//         console.log(err);
//     else
//         console.log(result);
// })

module.exports = pool