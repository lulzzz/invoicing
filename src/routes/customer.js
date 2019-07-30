const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');

//Create a new customer
router.post('/customers', (req, res) => {
    var values = []
    values.push(req.body.name)
    values.push(req.body.nif)
    values.push(req.body.address)
    values.push(req.body.postalCode)
    values.push(req.body.city)
    values.push(req.body.country)
    console.log(values);
    var sql = "INSERT INTO customers (`name`, `nif`, `address`, `postalCode`, `city`, `country`) VALUES (?)";
    connection.query(sql, [values], function (err, result) {
        if (err) res.status(400).send(err);
        else res.send('OK')
      });
})

router.get('/customers', (req, res) => {
    var sql = "SELECT * FROM customers"; //TODO send only some params
    connection.query(sql, function (err, result) {
        if (err) res.status(400).send(err);
        else res.send(result)
      });
})

router.get('/customers/:nif', (req, res) => {
    var sql = "SELECT * FROM customers where nif = ?"; //TODO send only some params
    connection.query(sql, [req.params.nif], function (err, result) {
        if (err) res.status(400).send(err);
        else res.send(result)
      });
})

router.patch('/customers/:nif', (req, res) => {
    var sql = "UPDATE customers SET ? where nif = ?";
    connection.query(sql, [req.body, req.params.nif],  function (err, result) {
        if (err) res.status(400).send(err)
        else res.send(result)
      });
})

router.delete('/customers/:nif', (req, res) => {
    var sql = "DELETE FROM customers where nif = ?";
    connection.query(sql, [req.params.nif],  function (err, result) {
        if (err) res.status(400).send(err)
        else res.send(result)
      });
})

module.exports = router