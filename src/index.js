const express = require('express');
const connection = require('./db/mysql');
const invoiceRouter = require('./routes/invoice');

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(invoiceRouter)

app.listen(port, () => {
    console.log('Server is up on port', port);
})