const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');

//Create a new user
router.post('/company', (req, res) => {
    var values = []
    values.push(req.body.name)
    values.push(req.body.nif)
    values.push(req.body.address)
    values.push(req.body.postalCode)
    values.push(req.body.city)
    values.push(req.body.country)
    console.log(values);
    var sql = "INSERT INTO company (`name`, `nif`, `address`, `postalCode`, `city`, `country`) VALUES (?)";
    connection.query(sql, [values], function (err, result) {
        if (err) res.status(400).send(err);
        else res.send('OK')
      });
})

router.get('/company', (req, res) => {
    var sql = "SELECT * FROM company LIMIT 1";
    connection.query(sql, function (err, result) {
        if (err) res.status(400).send(err);
        else res.send(result)
      });
})

router.patch('/company', (req, res) => {
    console.log(req.body);

    var sql = "UPDATE company SET ?";
    connection.query(sql, [req.body],  function (err, result) {
        if (err) res.status(400).send('Bad request')
        else res.send(result)
      });
})

module.exports = router

// {
//     name: String,
//     nif: Number (xxxxxxxxx),
//     address: String,
//     postalCode: String (xxxx-xxx),
//     city: String,
//     country: String (PT)
// }