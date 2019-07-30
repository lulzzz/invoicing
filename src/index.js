const express = require('express');
const connection = require('./db/mysql');
const invoiceRouter = require('./routes/invoice');
const companyRouter = require('./routes/company');

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(invoiceRouter)
app.use(companyRouter)

app.listen(port, () => {
    console.log('Server is up on port', port);
})