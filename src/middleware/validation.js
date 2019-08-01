const { check, param, body, validationResult } = require('express-validator');

exports.customerCompanyPostValidation = [
  body('name')
    .exists().withMessage('name field must exist')
    .not().isEmpty().withMessage('name field must not be empty'),
  body('nif')
    .exists().withMessage('NIF must exist')
    .not().isEmpty().withMessage('NIF must not be empty')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits'),
  body('address')
    .exists().withMessage('address field must exist')
    .not().isEmpty().withMessage('address field must not be empty'),
  body('postalCode')
    .exists().withMessage('postal code field must exist')
    .not().isEmpty().withMessage('postal code field must not be empty')
    .matches(/^([0-9]{4}-[0-9]{3})$/).withMessage('postal code should be in the form nnnn-nnn'),
  body('city')
    .exists().withMessage('city field must exist')
    .not().isEmpty().withMessage('city field must not be empty'),
  body('country')
    .exists().withMessage('country field must exist')
    .not().isEmpty().withMessage('country field must not be empty')
]

exports.customerPatchValidation = [
  param('nif')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits'),
  body('name')
    .optional().not().isEmpty().withMessage('name field must not be empty'),
  body('nif')
    .optional()
    .not().isEmpty().withMessage('NIF must not be empty')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits'),
  body('address')
    .optional()
    .not().isEmpty().withMessage('address field must not be empty'),
  body('postalCode')
    .optional()
    .not().isEmpty().withMessage('postal code field must not be empty')
    .matches(/^([0-9]{4}-[0-9]{3})$/).withMessage('postal code should be in the form nnnn-nnn'),
  body('city')
    .optional()
    .not().isEmpty().withMessage('city field must not be empty'),
  body('country')
    .optional()
    .not().isEmpty().withMessage('country field must not be empty')
]

exports.companyPatchValidation = [
  body('name')
    .optional().not().isEmpty().withMessage('name field must not be empty'),
  body('nif')
    .optional()
    .not().isEmpty().withMessage('NIF must not be empty')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits'),
  body('address')
    .optional()
    .not().isEmpty().withMessage('address field must not be empty'),
  body('postalCode')
    .optional()
    .not().isEmpty().withMessage('postal code field must not be empty')
    .matches(/^([0-9]{4}-[0-9]{3})$/).withMessage('postal code should be in the form nnnn-nnn'),
  body('city')
    .optional()
    .not().isEmpty().withMessage('city field must not be empty'),
  body('country')
    .optional()
    .not().isEmpty().withMessage('country field must not be empty')
]

exports.nifValidation = [
  param('nif')
    .isInt().withMessage('NIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('NIF must have 9 digits')
]

exports.productPostValidation = [
  body('productType')
    .not().isEmpty().withMessage("product type should not be empty")
    .exists().withMessage('product type field must exist')
    .matches(/^(S|P|O|E|I){1}$/).withMessage("product type should be 'S', 'P', 'O', 'E' or 'I'"),
  body('code')
    .not().isEmpty().withMessage("product code should not be empty")
    .exists().withMessage('product code field must exist')
    .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the product code'),
  body('description')
    .not().isEmpty().withMessage("product description should not be empty")
    .exists().withMessage('product description field must exist')
]

exports.productPatchValidation = [
  body('productType')
    .optional()
    .not().isEmpty().withMessage("product type should not be empty")
    .matches(/^(S|P|O|E|I){1}$/).withMessage("product type should be 'S', 'P', 'O', 'E' or 'I'"),
  body('code')
    .optional()
    .not().isEmpty().withMessage("product code should not be empty")
    .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the product code'),
  body('description')
    .optional()
    .not().isEmpty().withMessage("product description should not be empty")
]

exports.productCodeValidation = [
  param('code')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the product code')
]

exports.invoiceValidation = [
  body('type')
    .not().isEmpty().withMessage("type should not be empty")
    .exists().withMessage('type field must exist')
    .matches(/^(FR)$/).withMessage("type should be 'FR'"),
  body('customerNIF')
    .not().isEmpty().withMessage("customerNIF should not be empty")
    .exists().withMessage('customerNIF field must exist')
    .isInt().withMessage('customerNIF must be a number')
    .matches(/^[0-9]{9}/).withMessage('customerNIF must have 9 digits'),
  body('products')
    .not().isEmpty().withMessage("products should not be empty")
    .exists().withMessage('products field must exist')
  //TODO validate rest of productsF
  // let arr = [
  //   {
  //     user_id:1,
  //     hours:8
  //   },
  //   {
  //     user_id:2,
  //     hours:7
  //   }
  // ]

  // You can put check like this:
  // check("arr.*.user_id")  
  //   .not()  
  //   .isEmpty()
  // check("arr.*.hours")  
  //   .not()  
  //   .isEmpty()
]

exports.validationResult = (req, res, next) => {
  const errors = validationResult(req).errors;
  if (errors.length !== 0) {
    return res.status(422).send({ error: errors });
  }
  next()
}