var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dateStrings: true
});

// this need to be here for select with large fields (lots of products for one invoice in saft)
pool.query('SET SESSION group_concat_max_len = 100000;', function (err, result) {
    if (err)
        console.log(err);
})


module.exports = pool