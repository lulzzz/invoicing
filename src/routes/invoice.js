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
            var header = invoiceInfo.header
            let date = new Date().toLocaleDateString()

            //TODO auto proposto
            
            /////Create invoice reference/////
            /*TODO arranjar um sistema melhor para numerar os invoices.
            o que acontece quando há um novo ano? invoices devem começar do 0 para cada ano/serie*/
            var noInvoices = await getNoInvoices()
            var reference = invoiceType + ' ' + new Date(date).getFullYear() + '/' + (noInvoices + 1)
            
            /////Get customerID and insert invoice in invoices table/////
            var customerId = await getCustomerId(customerNIF)
            // insert invoice with transaction
            await createNewInvoice(reference, invoiceType, date, customerId, products, payments, header)
            
            const values = await getDetailedInvoiceInfo(reference)
            const pdf = await generatePDF(values)
            resolve({ reference, pdf: pdf});
        } catch (error) {
            reject(error)
        }

    })
}

//Create new invoice
router.post('/invoices', /*validation.invoiceValidation, validation.validationResult,*/ async (req, res) => {

    // {
    //     "header":{
    //         "header_name":"asfsdf",
    //         "header_address":"asdfsadf",
    //         "header_cp":"sdfsdf",
    //         "header_location":"sdfsdf",
    //         "header_telephone1":"sfdf",
    //         "header_email":"sdfsdf"
    //   },
    //   "invoice":[
    //       {
    //           "type": "FR",
    //         "customerName":"Rui Branco",
    //         "customerNIF": 502601655,
    //         "products": [
    //             {
    //               "code": "139",
    //               "unitPrice": 3.2,
    //               "quantity": 1,
    //               "tax": 23
    //             },
    //             {
    //               "code": "2",
    //               "unitPrice": "2",
    //               "quantity": 2,
    //               "tax": 23
    //             }
    //         ],
    //         "payments":[
    //             {
    //                 "method":"Check - BCP",
    //                 "value":"33"
    //             },
    //             {
    //                 "method":"ATM",
    //                 "value":"10"   
    //             }
    //         ]
    //       },
    //     {
    //         "type": "FR",
    //         "customerNIF": 502601655,
    //         "products":[
    //             {
    //                 "code": "139",
    //                 "unitPrice": 3.2,
    //                 "quantity": 1,
    //                 "tax": 23
    //             },
    //             {
    //                 "code": "2",
    //                 "unitPrice": "2",
    //                 "quantity": 2,
    //                 "tax": 23
    //             }
    //         ],
    //         "payments":[
    //             {
    //                 "method":"ATM",
    //                 "value":"10"   
    //             }
    //         ]
    //     }
    // ]
    // }

    try {
        var invoices = req.body.invoice
        var references = []
        var pdfs = []
        for (const info of invoices) {
            info.header = req.body.header
            var invoice = await createInvoice(info)
            references.push(invoice.reference)
            pdfs.push(invoice.pdf)
        }
        //TODO retornar erros de faturas que falham
        var combinedPDF = combinePDF(pdfs)
        res.send({references, "pdf": combinedPDF.toString('base64')})
    } catch (error) {
        if (error.status === 404) {
            res.status(404).send({ error: error.message })
        }
        else res.status(400).send({ error })
    }
})

module.exports = router

