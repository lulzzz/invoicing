var mysql = require('mysql');
var fs = require('fs');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'eu-cdbr-west-02.cleardb.net',
    user: 'b736eab1b9d8d6',
    password: 'e3ae70b1',
    database: 'heroku_86cd5bf3a6220ea',
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
