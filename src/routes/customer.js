const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');

//Create a new customer
router.post('/customers', validation.customerPostValidation, validation.validationResult, (req, res) => {

  var values = []
  values.push(req.body.name)
  values.push(req.body.nif)
  values.push(req.body.address)
  values.push(req.body.postalCode)
  values.push(req.body.city)
  values.push(req.body.country)
  values.push(req.body.permit || 0)

  var sql = "INSERT INTO customers (`name`, `nif`, `address`, `postalCode`, `city`, `country`, `permit`) VALUES (?)";
  connection.query(sql, [values], function (err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send({ error: 'Customer with NIF ' + req.body.nif + ' already exists' })
      } else {
        return res.status(400).send({ error: err.sqlMessage })
      }
    }
    else connection.query("SELECT `name`, `nif`, `address`, `postalCode`, `city`, `country`, `permit` from customers where idCustomer = ?", result.insertId, function (err, result) {
      if (err) return res.status(400).send({ error: err.sqlMessage });
      else return res.status(201).send(result[0])
    })
  });
})

router.get('/customers', (req, res) => {
  var sql = "SELECT name, nif, address, postalCode, city, country, permit FROM customers";
  connection.query(sql, function (err, result) {
    if (err) return res.status(400).send({ error: err.sqlMessage });
    else return res.send(result)
  });
})

router.get('/customers/:nif', validation.nifValidation, validation.validationResult, (req, res) => {

  var nif = req.params.nif
  var sql = "SELECT name, nif, address, postalCode, city, country, permit FROM customers WHERE nif = ?";
  connection.query(sql, nif, function (err, result) {
    if (err) {
      return res.status(400).send({ error: err.sqlMessage });
    }
    else if (result.length === 0) {
      return res.status(404).send({ error: "Customer with NIF " + nif + " could not be found." })
    }
    else return res.send(result[0])
  });
})

router.patch('/customers/:nif', validation.customerPatchValidation, validation.validationResult, (req, res) => {

  const updates = Object.keys(req.body)
  //check if there are updates to do
  if (updates.length === 0) {
    return res.status(400).send({ error: 'Must provide parameters' })
  }
  const allowedUpdates = ['name', 'nif', 'address', 'postalCode', 'city', 'country', 'permit']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  // check if the updates are allowed
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Field to update is invalid!' })
  }

  var nif = req.params.nif
  var sql = "UPDATE customers SET ? where nif = ?";
  connection.query(sql, [req.body, nif], function (err, result) {
    if (err) {
      return res.status(400).send({ error: 'Bad request' });
    }
    else if (result.affectedRows === 0) {
      return res.status(404).send({ error: "Customer with NIF " + nif + " could not be found." })
    }
    else connection.query("SELECT `name`, `nif`, `address`, `postalCode`, `city`, `country`, `permit` from customers where nif = ?", nif, function (err, result) {
      if (err) return res.status(400).send({ error: err.sqlMessage });
      else return res.status(201).send(result[0])
    })
  });
})

router.delete('/customers/:nif', validation.nifValidation, validation.validationResult, (req, res) => {

  var nif = req.params.nif
  var sql = "DELETE FROM customers where nif = ?";
  connection.query(sql, [nif], function (err, result) {
    if (err) {
      return res.status(400).send({ error: err.sqlMessage });
    }
    else if (result.affectedRows === 0) {
      return res.status(404).send({ error: "Customer with NIF " + nif + " could not be found." })
    }
    else return res.send(204).send()
  });
})

module.exports = router