const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');
const { validationResult } = require('express-validator');

//Create a new user
router.post('/company', validation.customerCompanyPostValidation, (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }

  connection.query("SELECT COUNT(*) as rowCount from company", (err, result) => {
    if (err) res.status(400).send(err);
    else if (result[0].rowCount === 1) {
      res.status(403).send('Company already created')
    } else {
      var values = []
      values.push(req.body.name)
      values.push(req.body.nif)
      values.push(req.body.address)
      values.push(req.body.postalCode)
      values.push(req.body.city)
      values.push(req.body.country)
      var sql = "INSERT INTO company (`name`, `nif`, `address`, `postalCode`, `city`, `country`) VALUES (?)";
      connection.query(sql, [values], function (err, result) {
        if (err) res.status(400).send(err);
        // else res.status(201).send('Company with values {' + values + '} was created')
        else connection.query("SELECT `name`, `nif`, `address`, `postalCode`, `city`, `country` from company where idCompany = ?", result.insertId, function (err, result) {
          if (err) res.status(400).send(err);
          else res.status(201).send(result[0])
        })
      });
    }
  })
})

router.get('/company', (req, res) => {
  var sql = "SELECT name, nif, address, postalCode, city, country FROM company LIMIT 1";
  connection.query(sql, function (err, result) {
    if (err) res.status(400).send(err);
    else if (result.length === 0){
      res.status(404).send('No company found');
    }
    else res.send(result)
  });
})

router.patch('/company', (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'nif', 'address', 'postalCode', 'city', 'country']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }
  //TODO if is valid operation, validate fields
  var sql = "UPDATE company SET ?";
  connection.query(sql, [req.body], function (err, result) {
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