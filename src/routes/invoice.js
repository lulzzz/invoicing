const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');
const { getCustomerId, getNoInvoices, createNewInvoice, getInvoiceInfo, getDetailedInvoiceInfo, insertCustomer, generateHash } = require('../db/databaseHelper');
const generatePDF = require('../utils/generatePDF');
const combinePDF = require('../utils/combinePDF');

// Get references of all invoices
router.get('/invoices', async (req, res) => {
    var query = 'SELECT reference FROM invoices ORDER BY serie, invoiceNo + 0, createdAt'
    // + 'inner join invoices_products on invoices.idInvoice = invoices_products.idinvoice '
    // + 'inner join products on invoices_products.idProduct = products.idProduct '
    connection.query(query, function (error, results) {
        if (error) res.status(400).send({ error: error.sqlMessage })
        res.send(results)
    })
})

// Get invoice by reference
router.get('/invoices/:ref', async (req, res) => {

    getInvoiceInfo(req.params.ref).then((values) => {
        res.send(values)
    }).catch((error) => {
        res.status(400).send({ error })
    })
})

// Get invoice pdf by reference
router.get('/invoices/:ref/pdf', (req, res) => {

    getDetailedInvoiceInfo(req.params.ref).then(async (values) => {
        const pdf = await generatePDF(values, res)
        res.contentType("application/pdf");
        res.send(pdf);
    }).catch((error) => {
        res.status(400).send({ error })
    })

})

// Get detailed info from the invoice by reference
router.get('/invoices/:ref/info', (req, res) => {

    getDetailedInvoiceInfo(req.params.ref).then((values) => {
        res.send(values)
    }).catch((error) => {
        res.status(400).send({ error })
    })
})

// Helper function to create invoice
const createInvoice = (invoiceInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            var invoiceType = invoiceInfo.type
            var customerNIF = invoiceInfo.customerNIF
            var products = invoiceInfo.products
            var payments = invoiceInfo.payments
            var header = invoiceInfo.header //specific for exam centers info and number
            var date = new Date(); // Or the date you'd like converted.
            var isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 19);
            /////Get customerID and insert invoice in invoices table/////
            var customerId = await getCustomerId(customerNIF).catch((error) => { return null })

            // if costumer isn't found, self-proposed student. grab info from req body
            if (!customerId) {
                let values = []
                if (!invoiceInfo.customerName) { throw new Error("a customer name must be provided") }
                values.push(invoiceInfo.customerName)
                values.push(invoiceInfo.customerNIF)
                values.push(invoiceInfo.customerAddress)
                values.push(invoiceInfo.customerPostalCode)
                values.push(invoiceInfo.customerCity)
                values.push(invoiceInfo.customerCountry)
                values.push(invoiceInfo.customerPermit || 999)
                customerId = await insertCustomer(values)
            }

            /////Create invoice reference/////
            var noInvoices = await getNoInvoices(date, header.number)
            let previousInvoiceRef = invoiceType + ' ' + header.number + new Date(date).getFullYear() + '/' + (noInvoices)

            let serie = '' + header.number + new Date(date).getFullYear()
            let invoiceNo = (noInvoices + 1)
            var reference = invoiceType + ' ' + serie + '/' + invoiceNo

            var hash = await generateHash(previousInvoiceRef, reference, isoDate, products)

            // insert invoice with transaction
            await createNewInvoice(reference, invoiceType, serie, invoiceNo, isoDate, customerId, products, payments, header, hash)

            const values = await getDetailedInvoiceInfo(reference)
            const pdf = await generatePDF(values)
            resolve({ reference, pdf });
        } catch (error) {
            reject(error)
        }

    })
}

// Create new invoice
router.post('/invoices', validation.invoiceValidation, validation.invoiceValidationResult, async (req, res) => {

    try {
        var invoices = req.body.invoice
        var references = {}
        var pdfs = []
        for (const [index, info] of invoices.entries()) {
            let errors = req.errors.filter(errors => errors.index === index);
            if (errors.length !== 0) {
                references[index] = errors.map(e => e.message).join(", ")
            } else {
                info.header = req.body.header
                await createInvoice(info)
                    .then((invoice) => {
                        references[index] = invoice.reference
                        pdfs.push(invoice.pdf)
                    })
                    .catch((error) => {
                        console.log(error);
                        if (error.message) {
                            references[index] = error.message
                        }
                        else {
                            throw new Error(error)
                        }
                    })
            }
        }

        var combinedPDF = ""
        if (pdfs.length !== 0) // only if there is a valid invoice to create PDF
            combinedPDF = combinePDF(pdfs)
        else {
            res.status(400) // STATUS 400 IF NO PDF
        }
        res.send({ references, "pdf": combinedPDF.toString('base64') })
    } catch (error) {
        if (error.status === 404) {
            res.status(404).send({ error: error.message })
        }
        else res.status(400).send({ error: error.message })
    }
})

module.exports = router

