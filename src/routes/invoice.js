const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');
const { getCustomerId, getNoInvoices, createNewInvoice, getInvoiceInfo, getDetailedInvoiceInfo } = require('../db/databaseHelper');
const generatePDF = require('../utils/generatePDF');
const combinePDF = require('../utils/combinePDF');

//Get all invoices
router.get('/invoices', async (req, res) => {
    var query = 'SELECT reference FROM invoices'
    // + 'inner join invoices_products on invoices.idInvoice = invoices_products.idinvoice '
    // + 'inner join products on invoices_products.idProduct = products.idProduct '
    connection.query(query, function (error, results) {
        if (error) res.status(400).send({ error: error.sqlMessage })
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
        res.contentType("application/pdf");
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

const createInvoice = (invoiceInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            var invoiceType = invoiceInfo.type
            var customerNIF = invoiceInfo.customerNIF
            var products = invoiceInfo.products
            var payments = invoiceInfo.payments
            var header = invoiceInfo.header //specific for exam centers info and number
            let date = new Date().toLocaleDateString()

            //TODO auto proposto

            /////Create invoice reference/////
            var noInvoices = await getNoInvoices(date, header.number)

            var reference = invoiceType + ' ' + header.number + new Date(date).getFullYear() + '/' + (noInvoices + 1)

            /////Get customerID and insert invoice in invoices table/////
            var customerId = await getCustomerId(customerNIF)
            // insert invoice with transaction
            await createNewInvoice(reference, invoiceType, date, customerId, products, payments, header)

            const values = await getDetailedInvoiceInfo(reference)
            const pdf = await generatePDF(values)
            resolve({ reference, pdf: pdf });
        } catch (error) {
            reject(error)
        }

    })
}

//Create new invoice
router.post('/invoices', validation.invoiceValidation, validation.invoiceValidationResult, async (req, res) => {

    try {
        var invoices = req.body.invoice
        var references = {}
        var pdfs = []
        for (const [index, info] of invoices.entries()) {
            // console.log(req.errors.length);
            if (req.errors.includes(index)) {
                references[index] = 'error'
            } else {
                info.header = req.body.header
                await createInvoice(info).then((invoice) => {
                    references[index] = invoice.reference
                    pdfs.push(invoice.pdf)
                })
                    .catch((error) => {
                        references[index] = error
                    })
            }


        }

        var combinedPDF = ""
        if (pdfs.length !== 0) // only if there is a valid invoice to create PDF
            combinedPDF = combinePDF(pdfs)
        res.send({ references, "pdf": combinedPDF.toString('base64') })
    } catch (error) {
        if (error.status === 404) {
            res.status(404).send({ error: error.message })
        }
        else res.status(400).send({ error })
    }
})

module.exports = router

