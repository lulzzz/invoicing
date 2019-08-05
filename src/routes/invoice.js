const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');
const { getCustomerId, getNoInvoices, insertInvoice, assignProductsToInvoice, getInvoiceInfo, getDetailedInvoiceInfo } = require('../db/databaseHelper');
const generatePDF = require('../utils/generatePDF');

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

//Get invoices by reference
router.get('/invoices/:ref', async (req, res) => {

    getInvoiceInfo(req.params.ref, async (err, values) => {
        if (err) res.status(400).send(err)
        else res.send(values)
    })

})

//Get invoice pdf by reference
router.get('/invoices/:ref/pdf', (req, res) => {

    getDetailedInvoiceInfo(req.params.ref, async (err, values) => {
        if (err) res.status(400).send(err)
        else {
            try {
                const pdf = await generatePDF(values, res)
                res.contentType("application/pdf");
                res.send(pdf);
            } catch (error) {
                res.status(400).send(error.message)
            }

        }
    })

})

//Get detailed info from the invoice
router.get('/invoices/:ref/info', (req, res) => {

    getDetailedInvoiceInfo(req.params.ref, async (err, values) => {
        if (err) res.status(400).send(err)
        else {
            res.send(values);
        }
    })
})

//Create new invoice
router.post('/invoices', validation.invoiceValidation, validation.validationResult, async (req, res) => {

    // {
    //     "type": "FS/FR",
    //     "customerNIF": "123456789",
    //     "products": [{
    //         "code": "xxxxx",
    //         "unitPrice": 10,
    //         "tax": 23,
    //         "quantity": 2
    //              "discount": ????
    //     }],
    //     "date": "yyyy/mm/dd"
    //     ?????? "vencimento": ?????
    // }
    //TODO adicionar desconto????

    try {
        //TODO verificar que data de invoice é posterior à do último
        var invoiceType = req.body.type
        var customerNIF = req.body.customerNIF
        var products = req.body.products
        var date = req.body.date

        /////Create invoice reference/////
        /*TODO arranjar um sistema melhor para numerar os invoices.
        o que acontece quando há um novo ano? invoices devem começar do 0 para cada ano/serie*/
        var noInvoices = await getNoInvoices()
        var reference = invoiceType + ' ' + new Date(date).getFullYear() + '/' + (noInvoices + 1)

        /////Get customerID and insert invoice in invoices table/////
        var customerId = await getCustomerId(customerNIF)
        var resp = await insertInvoice(reference, invoiceType, date, customerId)

        /////Assign products to the created invoice
        var productToInvoice = await assignProductsToInvoice(resp.idInvoice, products)

        //TODO gerar pdf da fatura? Guardar pdf??

        res.status(201).send(resp.reference)
    } catch (error) {
        if (error.status === 404) {
            res.status(404).send(error.message)
        }
        else res.status(400).send(error.message)
    }
})

module.exports = router

