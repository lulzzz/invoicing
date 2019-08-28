const { check, param, body, validationResult } = require('express-validator');

function validateNIF(value) {
  const nif = typeof value === 'string' ? value : value.toString();
  const validationSets = {
    one: ['1', '2', '3', '5', '6', '8'],
    two: ['45', '70', '71', '72', '74', '75', '77', '79', '90', '91', '98', '99']
  };

  if (nif.length !== 9) {
    return false;
  }

  if (!validationSets.one.includes(nif.substr(0, 1)) && !validationSets.two.includes(nif.substr(0, 2))) {
    return false;
  }

  const total = nif[0] * 9 + nif[1] * 8 + nif[2] * 7 + nif[3] * 6 + nif[4] * 5 + nif[5] * 4 + nif[6] * 3 + nif[7] * 2;
  const modulo11 = (Number(total) % 11);

  const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;

  return checkDigit === Number(nif[8]);
} /* .custom(nif => validateNIF(nif)).withMessage('nif is invalid') */

exports.companyPostValidation = [
  body('name')
    .not().isEmpty().withMessage('name field must not be empty'),
  body('nif')
    .not().isEmpty().withMessage('NIF must not be empty')
    .isInt().withMessage('NIF must be a number')
    .matches(/(^[0-9]{9})$/).withMessage('NIF must have 9 digits'),
  body('address')
    .not().isEmpty().withMessage('address field must not be empty'),
  body('postalCode')
    .not().isEmpty().withMessage('postal code field must not be empty')
    .matches(/^([0-9]{4}-[0-9]{3})$/).withMessage('postal code should be in the form nnnn-nnn'),
  body('city')
    .not().isEmpty().withMessage('city field must not be empty'),
  body('country')
    .not().isEmpty().withMessage('country field must not be empty'),
]

exports.customerPostValidation = [
  body('name')
    .not().isEmpty().withMessage('name field must not be empty'),
  body('nif')
    .not().isEmpty().withMessage('NIF must not be empty')
    .isInt().withMessage('NIF must be a number')
    .matches(/(^[0-9]{9})$/).withMessage('NIF must have 9 digits'),
  body('address')
    .not().isEmpty().withMessage('address field must not be empty'),
  body('postalCode')
    .not().isEmpty().withMessage('postal code field must not be empty')
    .matches(/^([0-9]{4}-[0-9]{3})$/).withMessage('postal code should be in the form nnnn-nnn'),
  body('city')
    .not().isEmpty().withMessage('city field must not be empty'),
  body('country')
    .not().isEmpty().withMessage('country field must not be empty'),
  body('permit')
    .not().isEmpty().withMessage('permit must not be empty')
]

exports.customerPatchValidation = [
  param('nif')
    .isInt().withMessage('NIF must be a number')
    .matches(/(^[0-9]{9})$/).withMessage('NIF must have 9 digits'),
  body('name')
    .optional().not().isEmpty().withMessage('name field must not be empty'),
  body('nif')
    .optional()
    .not().isEmpty().withMessage('NIF must not be empty')
    .isInt().withMessage('NIF must be a number')
    .matches(/(^[0-9]{9})$/).withMessage('NIF must have 9 digits'),
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
    .not().isEmpty().withMessage('country field must not be empty'),
  body('permit')
    .not().isEmpty().withMessage('permit must not be empty')
]

exports.companyPatchValidation = [
  body('name')
    .optional().not().isEmpty().withMessage('name field must not be empty'),
  body('nif')
    .optional()
    .not().isEmpty().withMessage('NIF must not be empty')
    .isInt().withMessage('NIF must be a number')
    .matches(/(^[0-9]{9})$/).withMessage('NIF must have 9 digits'),
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
    .matches(/(^[0-9]{9})$/).withMessage('NIF must have 9 digits')
]

exports.productPostValidation = [
  body('productType')
    .not().isEmpty().withMessage('product type should not be empty')
    .matches(/^(S|P|O|E|I){1}$/).withMessage("product type should be 'S', 'P', 'O', 'E' or 'I'"),
  body('code')
    .not().isEmpty().withMessage('product code should not be empty')
    .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the product code'),
  body('description')
    .not().isEmpty().withMessage('product description should not be empty')
]

exports.productPatchValidation = [
  body('productType')
    .optional()
    .not().isEmpty().withMessage('product type should not be empty')
    .matches(/^(S|P|O|E|I){1}$/).withMessage("product type should be 'S', 'P', 'O', 'E' or 'I'"),
  body('code')
    .optional()
    .not().isEmpty().withMessage('product code should not be empty')
    .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the product code'),
  body('description')
    .optional()
    .not().isEmpty().withMessage('product description should not be empty')
]

exports.productCodeValidation = [
  param('code')
    .custom(value => !/\s/.test(value))
    .withMessage('No spaces are allowed in the product code')
]

exports.invoiceValidation = [
  // header validation -> header is specific information for exam centers
  body('header')
    .not().isEmpty().withMessage('header should not be empty'),
  body('header.name')
    .optional()
    .not().isEmpty().withMessage('header name should not be empty'),
  body('header.address')
    .optional()
    .not().isEmpty().withMessage('header address should not be empty'),
  body('header.postalCode')
    .optional()
    .not().isEmpty().withMessage('header postalCode should not be empty'),
  body('header.city')
    .optional()
    .not().isEmpty().withMessage('header city should not be empty'),
  body('header.phone')
    .optional()
    .not().isEmpty().withMessage('header phone should not be empty'),
  // body('header.fax')
  //   .not().isEmpty().withMessage('header fax should not be empty'),
  body('header.email')
    .optional()
    .not().isEmpty().withMessage('header email should not be empty'),
  body('header.number')
    .not().isEmpty().withMessage('header number should not be empty'),


  // invoice validation
  body('invoice')
    .not().isEmpty().withMessage('invoice should not be empty'),
  body('invoice.*.type')
    .not().isEmpty().withMessage('invoice type should not be empty')
    .matches(/^(FR|FS|FT){1}$/).withMessage('invoice type should be \'FR\', \'FS\' or \'FT\''),
  body('invoice.*.customerNIF')
    .not().isEmpty().withMessage('customerNIF should not be empty')
    .isInt().withMessage('customerNIF must be a number')
    .matches(/(^[0-9]{9})$/).withMessage('customerNIF must have 9 digits')
    /* .custom(nif => validateNIF(nif)).withMessage('nif is invalid') */,
  body('invoice.*.products')
    .not().isEmpty().withMessage('products should not be empty'),
  // products validation
  body('invoice.*.products.*.code')
    .not().isEmpty().withMessage('product code should not be empty')
    .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in the product code'),
  body('invoice.*.products.*.unitPrice')
    .not().isEmpty().withMessage('unit price should not be empty')
    .isDecimal({ min: 0.0 }).withMessage('unit price should be a number')
    .custom(uPrice => uPrice >= 0).withMessage('unit price should be >= 0'),
  body('invoice.*.products.*.quantity')
    .not().isEmpty().withMessage('product quantity should not be empty')
    .isInt({ min: 1 }).withMessage('quantity should be a positive integer (> 1)'),
  body('invoice.*.products.*.tax')
    .not().isEmpty().withMessage('product tax should not be empty')
    .isDecimal({ min: 0.0 }).withMessage('tax should be a number')
    .custom(uPrice => uPrice >= 0).withMessage('tax should be >= 0'),
  // payments validation
  body('invoice.*.payments')
    .not().isEmpty().withMessage('payments should not be empty'),
  body('invoice.*.payments.*.method')
    .not().isEmpty().withMessage('payment method should not be empty'),
  body('invoice.*.payments.*.value')
    .not().isEmpty().withMessage('value should not be empty')
    .isDecimal().withMessage('value should be a number')
    .custom(value => value >= 0).withMessage('unit price should be >= 0'),
]

exports.invoiceValidationResult = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).send({ error: 'Body should not be empty' });
  }
  const errors = validationResult(req).errors;
  req.errors = []
  if (errors.length !== 0) {
    let headerError = (errors.filter(errors => errors.param.match(/^header(.*)/)))
    if (headerError.length !== 0) {
      return res.status(422).send({ error: headerError[0].msg });
    }
    let invoiceError = (errors.filter(errors => errors.param.match(/^invoice$/)))
    if (invoiceError.length !== 0) {
      return res.status(422).send({ error: invoiceError[0].msg });
    }
    // req.errors.line = errors.param.match(/(?<=\[).+?(?=\])/)[0]
    req.errors = [...new Set(errors.map(function (d) { return { index: parseInt(d.param.match(/(?<=\[).+?(?=\])/)), message: d.msg } }))];
  }
  next()
}

exports.validationResult = (req, res, next) => {
  const errors = validationResult(req).errors;
  if (errors.length !== 0) {
    return res.status(422).send({ error: errors.map(e => e.msg).join(", ") })
  }
  next()
}