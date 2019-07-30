const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');

//Create a new user
router.post('/products', (req, res) => {
    var values = []
    values.push(req.body.productType)
    values.push(req.body.code)
    values.push(req.body.description)
    console.log(values);
    var sql = "INSERT INTO products (`productType`, `code`, `description`) VALUES (?)";
    connection.query(sql, [values], function (err, result) {
        if (err) res.status(400).send(err);
        else res.send('OK')
      });
})

router.get('/products', (req, res) => {
    var sql = "SELECT productType, code, description FROM products";
    connection.query(sql, function (err, result) {
        if (err) res.status(400).send(err);
        else res.send(result)
      });
})

router.get('/products/:code', (req, res) => {
    console.log(req.params.code);
    var productCode = req.params.code
    var sql = "SELECT productType, code, description FROM products where code = ?";
    connection.query(sql, productCode, function (err, result) {
        if (err) res.status(400).send(err);
        else res.send(result)
      });
})

router.patch('/product', (req, res) => {
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