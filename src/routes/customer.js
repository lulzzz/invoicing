const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const { check, validationResult } = require('express-validator');

//Create a new customer
router.post('/customers', [ 
  check('name')
    .exists().withMessage('name field must exist')
    .not().isEmpty().withMessage('name field must not be empty'),
  check('nif')
    .exists().withMessage('NIF must exist')
    .not().isEmpty().withMessage('NIF must not be empty')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits'),
  check('address')
    .exists().withMessage('address field must exist')
    .not().isEmpty().withMessage('address field must not be empty'),
  check('postalCode')
    .exists().withMessage('postal code field must exist')
    .not().isEmpty().withMessage('postal code field must not be empty')
    .matches(/^([0-9]{4}-[0-9]{3})$/).withMessage('postal code should be in the form nnnn-nnn'),
  check('city')
    .exists().withMessage('city field must exist')
    .not().isEmpty().withMessage('city field must not be empty'),
  check('country')
    .exists().withMessage('country field must exist')
    .not().isEmpty().withMessage('country field must not be empty')
], (req, res) => {

  // send validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }

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
    else res.status(201).send('Customer with NIF ' + nif + ' was created.')
  });
})

router.get('/customers', (req, res) => {
  var sql = "SELECT name, nif, address, postalCode, city, country FROM customers";
  connection.query(sql, function (err, result) {
    if (err) res.status(400).send(err);
    else res.send(result)
  });
})

router.get('/customers/:nif', [
  check('nif')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits')
], (req, res) => {

  // send validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }

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

router.patch('/customers/:nif', [
  check('nif')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits')
], (req, res) => {

  // send validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }

  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'nif', 'address', 'postalCode', 'city', 'country']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  var nif = req.params.nif
  var sql = "UPDATE customers SET ? where nif = ?";
  connection.query(sql, [req.body, nif], function (err, result) {
    if (err) {
      res.status(400).send(err.sqlMessage);
    }
    else if (result.affectedRows === 0) {
      res.status(404).send("Customer with NIF " + nif + " could not be found.")
    }
    else res.send('Customer with NIF ' + nif + ' was updated.')
  });
})

router.delete('/customers/:nif', [
  check('nif')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits')
], (req, res) => {

  // send validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }
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