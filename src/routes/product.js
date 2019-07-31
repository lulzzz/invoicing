const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const { param, check, validationResult } = require('express-validator');

//Create a new product
router.post('/products', [
  check('productType', "Product type should not be empty").not().isEmpty(),
  check('productType', "Product type should be 'S', 'P', 'O', 'E' or 'I'").matches(/^(S|P|O|E|I){1}$/),
  check('code', "Product code should not be empty").not().isEmpty(),
  check('descritpion', "Product description should not be empty").not().isEmpty(),
], (req, res) => {

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }

  //TODO check if productType is acceptable
  //TODO check if all fields are filled
  var values = []
  values.push(req.body.productType)
  values.push(req.body.code)
  values.push(req.body.description)

  var sql = "INSERT INTO products (`productType`, `code`, `description`) VALUES (?)";
  connection.query(sql, [values], function (err, result) {
    if (err) {
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          res.status(409).send('Product with code ' + req.body.code + ' already exists')
          break;
        default:
          res.status(400).send(err.sqlMessage)
          break;
      }
    }
    else res.send('OK')
  });

})

// Get all products
router.get('/products', (req, res) => {
  var sql = "SELECT productType, code, description FROM products";
  connection.query(sql, function (err, result) {
    if (err) {
      res.status(400).send(err.sqlMessage);
    } else res.send(result)
  });
})

//Get specific product
router.get('/products/:code', (req, res) => {
  var productCode = req.params.code
  var sql = "SELECT productType, code, description FROM products where code = ?";
  connection.query(sql, productCode, function (err, result) {
    if (err) {
      res.status(400).send(err.sqlMessage);
    }
    else if (result.length === 0) {
      res.status(404).send("Product with code " + productCode + " could not be found.")
    }
    else res.send(result)
  });
})

//Update Specific product
router.patch('/products/:code', (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['productType', 'code', 'description']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  var productCode = req.params.code
  var sql = "UPDATE products SET ? where code = ?";
  connection.query(sql, [req.body, productCode], function (err, result) {
    if (err) {
      res.status(400).send(err.sqlMessage);
    }
    else if (result.length === 0) {
      res.status(404).send("Product with code " + productCode + " could not be found.")
    }
    else res.send(result)
  });
})

//Delete specific product
router.delete('/products/:code', (req, res) => {
  var productCode = req.params.code
  var sql = "DELETE FROM products where code = ?";
  connection.query(sql, productCode, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    else if (result.length === 0) {
      res.status(404).send("Product with code " + productCode + " could not be found.")
    }
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