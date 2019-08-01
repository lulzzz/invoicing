const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');

//Create a new product
router.post('/products', validation.productPostValidation, validation.validationResult, (req, res) => {

  var values = []
  values.push(req.body.productType)
  values.push(req.body.code)
  values.push(req.body.description)

  var sql = "INSERT INTO products (`productType`, `code`, `description`) VALUES (?)";
  connection.query(sql, [values], function (err, result) {
    if (err) {
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          return res.status(409).send('Product with code ' + req.body.code + ' already exists')
          break;
        default:
          return res.status(400).send(err.sqlMessage)
          break;
      }
    }
    else return res.redirect('/products/' + req.body.code) //TODO can't redirect here, should send 201
  });
})

// Get all products
router.get('/products', (req, res) => {
  var sql = "SELECT productType, code, description FROM products";
  connection.query(sql, function (err, result) {
    if (err) {
      return res.status(400).send(err.sqlMessage);
    } else return res.send(result)
  });
})

//Get specific product
router.get('/products/:code', validation.productCodeValidation, validation.validationResult, (req, res) => {

  var productCode = req.params.code
  var sql = "SELECT productType, code, description FROM products where code = ?";
  connection.query(sql, productCode, function (err, result) {
    if (err) {
      return res.status(400).send({ error: err.sqlMessage });
    }
    else if (result.length === 0) {
      return res.status(404).send({ error: "Product with code " + productCode + " could not be found." })
    }
    else return res.send(result)
  });
})

//Update Specific product
router.patch('/products/:code', validation.productPatchValidation, validation.validationResult, (req, res) => {

  //TODO validate body
  const updates = Object.keys(req.body)
  //check if there are updates to do
  if (updates.length === 0) {
    return res.status(400).send({ error: 'Must provide parameters' })
  }
  const allowedUpdates = ['productType', 'code', 'description']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Field to update is invalid!' })
  }

  var productCode = req.params.code
  var sql = "UPDATE products SET ? where code = ?";
  connection.query(sql, [req.body, productCode], function (err, result) {
    console.log(result);
    if (err) {
      return res.status(400).send(err.sqlMessage);
    }
    else if (result.affectedRows === 0) {
      return res.status(404).send("Product with code " + productCode + " could not be found.")
    }
    else return res.redirect('/products/' + req.body.code)
  });
})

//Delete specific product
router.delete('/products/:code', validation.productCodeValidation, validation.validationResult, (req, res) => {

  var productCode = req.params.code
  var sql = "DELETE FROM products where code = ?";
  connection.query(sql, productCode, function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    else if (result.affectedRows === 0) {
      return res.status(404).send("Product with code " + productCode + " could not be found.")
    }
    else return res.send('Product with code ' + nif + ' was deleted.') //TODO send deleted product
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