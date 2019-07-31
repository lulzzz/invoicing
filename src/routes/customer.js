const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');

//Create a new customer
router.post('/customers', (req, res) => {
  //TODO return created customer?
  var values = []
  values.push(req.body.name)
  values.push(req.body.nif)
  values.push(req.body.address)
  values.push(req.body.postalCode)
  values.push(req.body.city)
  values.push(req.body.country)
  var sql = "INSERT INTO customers (`name`, `nif`, `address`, `postalCode`, `city`, `country`) VALUES (?)";
  connection.query(sql, [values], function (err, result) {
    if (err) res.status(400).send(err);
    else res.status(201).send('OK')
  });
})

router.get('/customers', (req, res) => {
  //TODO send only some params (dont send id)
  var sql = "SELECT * FROM customers"; 
  connection.query(sql, function (err, result) {
    if (err) res.status(400).send(err);
    else res.send(result)
  });
})

router.get('/customers/:nif', (req, res) => {
  //TODO send only some params (dont send id)
  //TODO send 404 if no customer is found
  var sql = "SELECT * FROM customers where nif = ?";
  connection.query(sql, [req.params.nif], function (err, result) {
    if (err) res.status(400).send(err);
    else res.send(result)
  });
})

router.patch('/customers/:nif', (req, res) => {
  //TODO send 404 if no customer is found
  //TODO set allowed params, all others should send forbidden (ids can be changed)
  //TODO return updated customer?
  var sql = "UPDATE customers SET ? where nif = ?";
  connection.query(sql, [req.body, req.params.nif], function (err, result) {
    if (err) res.status(400).send(err)
    else res.send(result)
  });
})

router.delete('/customers/:nif', (req, res) => {
  //TODO send 404 if no customer is found
  //TODO Return deleted customer?
  var sql = "DELETE FROM customers where nif = ?";
  connection.query(sql, [req.params.nif], function (err, result) {
    if (err) res.status(400).send(err)
    else res.send(result)
  });
})

module.exports = router