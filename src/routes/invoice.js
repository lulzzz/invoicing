const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const {getCustomerId, getNoInvoices, insertInvoice} = require('../db/databaseHelper');

//Get all invoices
router.get('/invoices', async (req, res) => {

    try {
        var query = 'SELECT * FROM invoices '
            + 'inner join invoices_products on invoices.idInvoice = invoices_products.idinvoice '
            + 'inner join products on invoices_products.idProduct = products.idProduct '
        connection.query(query, (error, results, fields) => {
            if (error) throw error

            res.send(results)
        })
        // res.send(invoices)
    } catch (error) {
        res.status(400).send(error.message)
    }

})

//Create new invoice
router.post('/invoices', async (req, res) => {

    var invoiceType = req.body.type
    var customerNIF = req.body.customer.nif

    var noInvoices = await getNoInvoices()
    var customerId = await getCustomerId(customerNIF)

    var reference = invoiceType + ' ' + new Date().getFullYear() + '/' + (noInvoices + 1)

    var resp = await insertInvoice(reference, invoiceType, customerId)

    res.send(resp)
})



module.exports = router