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
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send('Product with code ' + req.body.code + ' already exists')
      } else
        return res.status(400).send(err.sqlMessage)
    }
    else connection.query("SELECT productType, code, description FROM products where idProduct = ?", result.insertId, function (err, result) {
      if (err) {
        return res.status(400).send(err.sqlMessage);
      } else return res.status(201).send(result)
    });
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
  const updates = Object.keys(req.body)
  if (updates.length === 0) {
    return res.status(400).send({ error: 'Must provide parameters' })
  }
  const allowedUpdates = ['productType', 'code', 'description']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Field to update is invalid!' })
  }

  var oldProductCode = req.params.code
  var newProductCode = req.body.code
  var sql = "UPDATE products SET ? where code = ?";
  connection.query(sql, [req.body, oldProductCode], function (err, result) {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).send({ error: "A product with the code " + newProductCode + " already exists" });
      else return res.status(400).send(err.sqlMessage);
    }
    else if (result.affectedRows === 0) {
      return res.status(404).send("Product with code " + oldProductCode + " could not be found.")
    }
    else connection.query("SELECT productType, code, description FROM products where code = ?", newProductCode, function (err, result) {
      if (err) {
        return res.status(400).send(err.sqlMessage);
      } else return res.status(201).send(result)
    });
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