const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');
const { check, validationResult } = require('express-validator');

//Create a new customer
router.post('/customers', validation.customerCompanyPostValidation, validation.validationResult, (req, res) => {

  var values = []
  values.push(req.body.name)
  values.push(req.body.nif)
  values.push(req.body.address)
  values.push(req.body.postalCode)
  values.push(req.body.city)
  values.push(req.body.country)

  var sql = "INSERT INTO customers (`name`, `nif`, `address`, `postalCode`, `city`, `country`) VALUES (?)";
  connection.query(sql, [values], function (err, result) {
    if (err) {
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          res.status(409).send('Customer with NIF ' + req.body.nif + ' already exists')
          break;
        default:
          res.status(400).send(err.sqlMessage)
          break;
      }
    }
    else connection.query("SELECT `name`, `nif`, `address`, `postalCode`, `city`, `country` from customers where idCustomer = ?", result.insertId, function (err, result) {
      if (err) res.status(400).send(err);
      else res.status(201).send(result[0])
    })
  });
})

router.get('/customers', (req, res) => {
  var sql = "SELECT name, nif, address, postalCode, city, country FROM customers";
  connection.query(sql, function (err, result) {
    if (err) res.status(400).send(err);
    else res.send(result)
  });
})

router.get('/customers/:nif', validation.nifValidation, validation.validationResult, (req, res) => {

  var nif = req.params.nif
  var sql = "SELECT name, nif, address, postalCode, city, country FROM customers WHERE nif = ?";
  connection.query(sql, nif, function (err, result) {
    if (err) {
      res.status(400).send(err.sqlMessage);
    }
    else if (result.length === 0) {
      res.status(404).send("Customer with NIF " + nif + " could not be found.")
    }
    else res.send(result)
  });
})

router.patch('/customers/:nif', validation.customerPatchValidation, validation.validationResult, (req, res) => {

  const updates = Object.keys(req.body)
  //check if there are updates to do
  if (updates.length === 0) {
    return res.status(400).send({ error: 'Must provide parameters' })
  }
  const allowedUpdates = ['name', 'nif', 'address', 'postalCode', 'city', 'country']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  // check if the updates are allowed
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  var nif = req.params.nif
  var sql = "UPDATE customers SET ? where nif = ?";
  connection.query(sql, [req.body, nif], function (err, result) {
    if (err) {
      res.status(400).send({ error: 'Bad request' });
    }
    else if (result.affectedRows === 0) {
      res.status(404).send("Customer with NIF " + nif + " could not be found.")
    }
    else res.send('Customer with NIF ' + nif + ' was updated.')
  });
})

router.delete('/customers/:nif', validation.nifValidation, validation.validationResult, (req, res) => {

  var nif = req.params.nif
  var sql = "DELETE FROM customers where nif = ?";
  connection.query(sql, [nif], function (err, result) {
    if (err) {
      res.status(400).send(err.sqlMessage);
    }
    else if (result.affectedRows === 0) {
      res.status(404).send("Customer with NIF " + nif + " could not be found.")
    }
    else res.send('Customer with NIF ' + nif + ' was deleted.')
  });
})

module.exports = router