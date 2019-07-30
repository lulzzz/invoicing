const express = require('express');
const connection = require('./db/mysql');
const invoiceRouter = require('./routes/invoice');
const companyRouter = require('./routes/company');
const productRouter = require('./routes/product');
const customerRouter = require('./routes/customer');

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(invoiceRouter)
app.use(companyRouter)
app.use(productRouter)
app.use(customerRouter)

app.listen(port, () => {
    console.log('Server is up on port', port);
})