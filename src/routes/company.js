const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');

//Create a new user
router.post('/company', validation.companyPostValidation, validation.validationResult, (req, res) => {

  connection.query("SELECT COUNT(*) as rowCount from company", (err, result) => {
    if (err) return res.status(400).send({ error: err.sqlMessage });
    else if (result[0].rowCount === 1) {
      return res.status(409).send({ error: 'Company already created' })
    } else {
      var values = []
      values.push(req.body.shortName)
      values.push(req.body.longName)
      values.push(req.body.nif)
      values.push(req.body.address)
      values.push(req.body.postalCode)
      values.push(req.body.city)
      values.push(req.body.country)
      var sql = "INSERT INTO company (`shortName`, `longName`, `nif`, `address`, `postalCode`, `city`, `country`) VALUES (?)";
      connection.query(sql, [values], function (err, result) {
        if (err) return res.status(400).send({ error: err.sqlMessage });
        else connection.query("SELECT `shortName`, `longName`, `nif`, `address`, `postalCode`, `city`, `country` from company where idCompany = ?", result.insertId, function (err, result) {
          if (err) return res.status(400).send({ error: err.sqlMessage });
          else return res.status(201).send(result[0])
        })
      });
    }
  })
})

router.get('/company', (req, res) => {
  var sql = "SELECT shortName, longName, nif, address, postalCode, city, country FROM company LIMIT 1";
  connection.query(sql, function (err, result) {
    if (err) return res.status(400).send({ error: err.sqlMessage });
    else if (result.length === 0) {
      return res.status(404).send({ error: 'No company found' });
    }
    else return res.send(result)
  });
})

router.patch('/company', validation.companyPatchValidation, validation.validationResult, (req, res) => {

  const updates = Object.keys(req.body)
  //check if there are updates to do
  if (updates.length === 0) {
    return res.status(400).send({ error: 'Must provide parameters' })
  }
  const allowedUpdates = [`shortName`, `longName`, 'nif', 'address', 'postalCode', 'city', 'country']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  // check if the updates are allowed
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Field to update is invalid!' })
  }

  connection.query("SELECT COUNT(*) as rowCount from company", (err, result) => {
    if (err) res.status(400).send({ error: err.sqlMessage });
    else if (result[0].rowCount === 0) {
      return res.status(404).send({ error: 'No company created yet' });
    }
    else {
      var sql = "UPDATE company SET ?";
      connection.query(sql, [req.body], function (err, result) {
        if (err) return res.status(400).send({ error: 'Bad request' })
        else return res.redirect('/company')
      });
    }
  });


})

module.exports = router