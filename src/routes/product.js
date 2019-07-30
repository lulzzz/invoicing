const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');

//Create a new product
router.post('/products', (req, res) => {
    var values = []
    values.push(req.body.productType)
    values.push(req.body.code)
    values.push(req.body.description)

    var sql = "INSERT INTO products (`productType`, `code`, `description`) VALUES (?)";
    connection.query(sql, [values], function (err, result) {
        if (err) res.status(400).send(err);
        else res.send('OK')
      });
})

// Get all products
router.get('/products', (req, res) => {
    var sql = "SELECT productType, code, description FROM products";
    connection.query(sql, function (err, result) {
        if (err) res.status(400).send(err);
        else res.send(result)
      });
})

//Get specific product
router.get('/products/:code', (req, res) => {
    var productCode = req.params.code
    var sql = "SELECT productType, code, description FROM products where code = ?";
    connection.query(sql, productCode, function (err, result) {
        if (err) res.status(400).send(err);
        else res.send(result)
      });
})

//Update Specific product
router.patch('/products/:code', (req, res) => {
    var sql = "UPDATE products SET ? where code = ?";
    connection.query(sql, [req.body, req.params.code],  function (err, result) {
        if (err) res.status(400).send(err)
        else res.send(result)
      });
})

//Delete specific product
router.delete('/products/:code', (req, res) => {
    var sql = "DELETE FROM products where code = ?";
    connection.query(sql, [req.params.code],  function (err, result) {
        if (err) res.status(400).send(err)
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