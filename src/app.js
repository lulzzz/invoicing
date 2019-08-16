const express = require('express');
const invoiceRouter = require('./routes/invoice');
const companyRouter = require('./routes/company');
const productRouter = require('./routes/product');
const customerRouter = require('./routes/customer');
const saftRouter = require('./routes/saft');

const app = express()

app.use(express.json())
app.use(invoiceRouter)
app.use(companyRouter)
app.use(productRouter)
app.use(customerRouter)
app.use(saftRouter)

module.exports = app