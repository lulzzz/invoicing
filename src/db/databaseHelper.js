const connection = require('../db/mysql');

var getProductId = (code) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT idProduct FROM products WHERE code = ?"
        connection.query(sql, code,
            function (err, result) {
                if (err)
                    reject(err);
                else {
                    if (result.length === 0) {
                        reject({ message: 'Product with code ' + code + ' does not exist.' })
                    }
                    else {
                        resolve(result[0].idProduct)
                    }
                }
            });
    })
}

module.exports = {
    getNoInvoices: () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(*) AS invoiceCount FROM invoices', function (err, result) {
                if (err)
                    reject(err)
                else
                    resolve(result[0].invoiceCount)

            });
        })
    },

    getCustomerId: (customerNIF) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT idCustomer FROM customers where nif = ?', [customerNIF], function (err, result) {
                if (err)
                    reject(err)
                else if (result.length === 0) {
                    reject({ status: 404, message: 'Customer with nif ' + customerNIF + ' not found' })
                }
                else
                    resolve(result[0].idCustomer);
            });
        })
    },

    insertInvoice: (reference, invoiceType, date, customerId) => {
        return new Promise((resolve, reject) => {
            values = [reference, invoiceType, date, customerId]
            let sql = "INSERT INTO invoices (reference, type, createdAt, FK_idCustomer) VALUES (?)"
            connection.query(sql, [values],
                function (err, result) {
                    if (err)
                        reject(err);
                    else
                        resolve({ "idInvoice": result.insertId, reference })
                });
        })
    },

    assignProductsToInvoice: async (invoiceId, products) => {
        var values = []
        for await (const product of products) {
            let productId = await getProductId(product.code)
            product.id = productId
            let tmp = []
            tmp.push(invoiceId)
            tmp.push(productId)
            tmp.push(product.unitPrice)
            tmp.push(product.quantity)
            tmp.push(product.tax)
            values.push(tmp)
        }
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO invoices_products (idInvoice, idProduct, unitPrice, quantity, tax) VALUES ?"
            connection.query(sql, [values], function (err, result) {
                if (err)
                    reject(err);
                else
                    resolve(result)
            });
        });

    },

    getInvoiceDetails: async (ref, cb) => {
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
            if (err) throw new Error(err);
            else {
                values.reference = result[0].reference
                values.createdAt = result[0].createdAt
                connection.query(companyQuery, function (err, result) {
                    if (err) throw new Error(err);
                    else {
                        values.company = JSON.parse(JSON.stringify(result))
                        connection.query(customerQuery, ref, function (err, result) {
                            if (err) throw new Error(err);
                            else {
                                values.customer = JSON.parse(JSON.stringify(result))
                                connection.query(productsQuery, ref, function (err, result) {
                                    if (err) throw new Error(err);
                                    else {
                                        values.products = JSON.parse(JSON.stringify(result))
                                        cb(values)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}