const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');
const { getCustomerId, getNoInvoices, insertInvoice, assignProductsToInvoice, getInvoiceInfo, getDetailedInvoiceInfo } = require('../db/databaseHelper');
const generatePDF = require('../utils/generatePDF');

//Get all invoices
router.get('/invoices', async (req, res) => {
    var query = 'SELECT reference FROM invoices'
    // + 'inner join invoices_products on invoices.idInvoice = invoices_products.idinvoice '
    // + 'inner join products on invoices_products.idProduct = products.idProduct '
    connection.query(query, function (error, results) {
        if (error) res.status(400).send({ error: err.sqlMessage })
        res.send(results)
    })
})

//Get invoices by reference
router.get('/invoices/:ref', async (req, res) => {

    getInvoiceInfo(req.params.ref).then((values) => {
        res.send(values)
    }).catch((error) => {
        res.status(400).send({ error })
    })
})

//Get invoice pdf by reference
router.get('/invoices/:ref/pdf', (req, res) => {

    getDetailedInvoiceInfo(req.params.ref).then(async (values) => {
        const pdf = await generatePDF(values, res)
        res.contentType("application/pdf"); // TODO continuar a enviar pdf ou enviar buffer??
        res.send(pdf);
    }).catch((error) => {
        res.status(400).send({ error })
    })

})

//Get detailed info from the invoice
router.get('/invoices/:ref/info', (req, res) => {

    getDetailedInvoiceInfo(req.params.ref).then((values) => {
        res.send(values)
    }).catch((error) => {
        res.status(400).send({ error })
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
        //TODO o que acontece quando ha erros?? falta um catch de promises
        /*TODO arranjar um sistema melhor para numerar os invoices.
        o que acontece quando há um novo ano? invoices devem começar do 0 para cada ano/serie*/
        var noInvoices = await getNoInvoices()
        var reference = invoiceType + ' ' + new Date(date).getFullYear() + '/' + (noInvoices + 1)

        /////Get customerID and insert invoice in invoices table/////
        var customerId = await getCustomerId(customerNIF)
        var resp = await insertInvoice(reference, invoiceType, date, customerId)

        /////Assign products to the created invoice
        await assignProductsToInvoice(resp.idInvoice, products)

        //TODO gerar pdf da fatura? Guardar pdf??

        getDetailedInvoiceInfo(resp.reference).then(async (values) => {
            const pdf = await generatePDF(values, res)
            //res.contentType("application/pdf");
            res.send({ reference: resp.reference, pdf: pdf });
        }).catch((error) => {
            res.status(400).send({ error })
        })

        // insert invoice with transaction
        // createNewInvoice(reference, invoiceType, date, customerId, products)
        // .then(async (values) => {

        //     getDetailedInvoiceInfo(reference).then(async (values) => {
        //         const pdf = await generatePDF(values, res)
        //         //res.contentType("application/pdf");

        //         res.send({ reference: reference, pdf: pdf });

        //     })
        // })
        // .catch((error) => {
        //     res.status(400).send({ error })
        // })
    } catch (error) {
        if (error.status === 404) {
            res.status(404).send({ error: error.message })
        }
        else res.status(400).send({ error })
    }
})

module.exports = router

