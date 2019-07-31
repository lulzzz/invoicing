const { check, param } = require('express-validator');

exports.customerCompanyPostValidation = [
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
]

exports.nifValidation = [
  param('nif')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits')
]

exports.productPostValidation = [
  check('productType')
    .not().isEmpty().withMessage("product type should not be empty")
    .exists().withMessage('product type field must exist')
    .matches(/^(S|P|O|E|I){1}$/).withMessage("product type should be 'S', 'P', 'O', 'E' or 'I'"),
  check('code')
    .not().isEmpty().withMessage("product code should not be empty")
    .exists().withMessage('product code field must exist'),
  check('description')
    .not().isEmpty().withMessage("product description should not be empty")
    .exists().withMessage('product description field must exist')
]

exports.invoiceValidation = [
  check('type')
    .not().isEmpty().withMessage("type should not be empty")
    .exists().withMessage('type field must exist')
    .matches(/^(FR)$/).withMessage("type should be 'FR'"),
  check('customerNIF')
    .not().isEmpty().withMessage("customerNIF should not be empty")
    .exists().withMessage('customerNIF field must exist')
    .isInt().withMessage('customerNIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('customerNIF must have 9 digits'),
  check('products')
    .not().isEmpty().withMessage("products should not be empty")
    .exists().withMessage('products field must exist')
]