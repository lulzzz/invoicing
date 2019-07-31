const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const { getCustomerId, getNoInvoices, insertInvoice, assignProductsToInvoice, getProductId } = require('../db/databaseHelper');

//Get all invoices
router.get('/invoices', async (req, res) => {

    try {
        var query = 'SELECT reference FROM invoices'
        // + 'inner join invoices_products on invoices.idInvoice = invoices_products.idinvoice '
        // + 'inner join products on invoices_products.idProduct = products.idProduct '
        connection.query(query, (error, results, fields) => {
            if (error) throw error
            res.send(results)
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//Create new invoice
router.post('/invoices', async (req, res) => {

    // {
    //     "type": "FS/FR",
    //     "customerNIF": "123456789",
    //     "products": [{
    //         "code": "xxxxx",
    //         "unitPrice": 10,
    //         "tax": 23,
    //         "quantity": 2
    //     ??? "discount": ???
    //     }],
    //     "date": "yyyy/mm/dd"
    //     ?????? "vencimento": ?????
    // }



    try {
        var invoiceType = req.body.type
        var customerNIF = req.body.customerNIF
        var products = req.body.products
        var date = req.body.date
    
        var noInvoices = await getNoInvoices() 
        //TODO arranjar um melhor sistema para numerar os invoices. o que acontece quando há um novo ano? invoices devem começar do 0 para cada ano
        var customerId = await getCustomerId(customerNIF)
    
        var reference = invoiceType + ' ' + new Date(date).getFullYear() + '/' + (noInvoices + 1)
    
        var resp = await insertInvoice(reference, invoiceType, date, customerId)
    
        await assignProductsToInvoice(resp.idInvoice, products)
    
        res.status(201).send(resp.reference)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router