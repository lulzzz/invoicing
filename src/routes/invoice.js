const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');
const validation = require('../middleware/validation');
const { getCustomerId, getNoInvoices, insertInvoice, assignProductsToInvoice, getInvoiceDetails } = require('../db/databaseHelper');

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
    //TODO find how to manage reference with spaces in params
    var ref = req.params.ref
    var values = {}

    var productsQuery = "SELECT products.code, products.description, invoices_products.unitPrice, invoices_products.quantity, invoices_products.tax "
        + "FROM invoices inner join invoices_products "
        + "on invoices.idInvoice = invoices_products.idinvoice "
        + "inner join products on invoices_products.idProduct = products.idProduct "
        + "WHERE invoices.reference = ?;"

    var customerQuery = "SELECT customers.name, customers.nif, customers.address, customers.postalCode, customers.city "
        + "FROM invoices inner join customers "
        + "on invoices.FK_idCustomer = customers.idCustomer "
        + "WHERE invoices.reference = ?;"

    var companyQuery = "SELECT name, nif, address, postalCode, city, country from company"

    var invoiceQuery = 'SELECT reference, createdAt FROM invoices where reference = ?'

    connection.query(invoiceQuery, ref, function (err, result) {
        if (err) return res.status(400).send(err);
        else {
            values.reference = result[0].reference
            values.createdAt = result[0].createdAt
            console.log(values);
            connection.query(companyQuery, function (err, result) {
                if (err) return res.status(400).send(err);
                else {
                    values.company = JSON.parse(JSON.stringify(result))
                    connection.query(customerQuery, ref, function (err, result) {
                        if (err) return res.status(400).send(err);
                        else {
                            values.customer = JSON.parse(JSON.stringify(result))
                            connection.query(productsQuery, ref, function (err, result) {
                                if (err) return res.status(400).send(err);
                                else {
                                    values.products = JSON.parse(JSON.stringify(result))
                                    return res.send(values)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

//Get invoices by reference
router.get('/invoices/:ref/pdf', async (req, res) => {
    getInvoiceDetails(req.params.ref, (values) => {
        console.log(values);
        //TODO
        //get all elements of each tax and put in array
        //multiply prices by tax
        //pass everyting to PDF generator
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

        //TODO gerar pdf da fatura? Guardar??

        res.status(201).send(resp.reference)
    } catch (error) {
        if (error.status === 404) {
            res.status(404).send(error.message)
        }
        else res.status(400).send(error.message)
    }
})

module.exports = router

