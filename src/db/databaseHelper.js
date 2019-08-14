const connection = require('../db/mysql');

var getProductId = (code) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT idProduct FROM products WHERE code = ?"
        connection.query(sql, code,
            function (err, result) {
                if (err)
                    reject(err.sqlMessage);
                else {
                    if (result.length === 0) {
                        reject({ status: 404, message: 'Product with code ' + code + ' does not exist.' })
                    }
                    else {
                        resolve(result[0].idProduct)
                    }
                }
            });
    })
}

const round = (num) => {
    return Math.round(num * 1e2) / 1e2
}

module.exports = {
    getNoInvoices: () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(*) AS invoiceCount FROM invoices', function (err, result) {
                if (err)
                    reject(err.sqlMessage)
                else
                    resolve(result[0].invoiceCount)

            });
        })
    },

    getCustomerId: (customerNIF) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT idCustomer FROM customers WHERE nif = ?', [customerNIF], function (err, result) {
                if (err)
                    reject(err.sqlMessage)
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
            let sql = "INSERT INTO invoices (reference, type, createdAt, idCustomer) VALUES (?)"
            connection.query(sql, [values],
                function (err, result) {
                    if (err)
                        reject(err.sqlMessage);
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
                    reject(err.sqlMessage);
                else
                    resolve(result)
            });
        });

    },

    //insert invoices in invoices and invoices_products using transactions
    createNewInvoice: async (reference, invoiceType, date, customerId, products, payments, header) => {
        return new Promise((resolve, reject) => {
            connection.getConnection(async (err, connection) => {
                connection.beginTransaction(async (err) => {
                    if (err) {//Transaction Error (Rollback and release connection)
                        connection.rollback(() => {
                            reject(err.sqlMessage);
                            connection.release();
                            //Failure
                        });
                    } else {
                        values = [reference, invoiceType, date, customerId, header.name, header.address, header.postalCode, header.city, header.phone, header.fax, header.email]
                        let sql = "INSERT INTO invoices (reference, type, createdAt, idCustomer, header_name, header_address, header_postalCode, header_city, header_phone, header_fax, header_email) VALUES (?)"
                        connection.query(sql, [values], async (err, result) => {
                            if (err) {          //Query Error (Rollback and release connection)
                                connection.rollback(() => {
                                    reject(err.sqlMessage);
                                    connection.release();
                                    //Failure
                                });
                            } else {
                                let invoiceId = result.insertId
                                var values = []
                                try {
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
                                } catch (error) {
                                    reject(error)
                                }
                                let sql = "INSERT INTO invoices_products (idInvoice, idProduct, unitPrice, quantity, tax) VALUES ?"
                                connection.query(sql, [values], function (err, result) {
                                    if (err) {
                                        connection.rollback(function () {
                                            reject(err.sqlMessage);
                                            connection.release();
                                            //Failure
                                        });
                                    }
                                    else {
                                        var valuesPayment = []
                                        payments.forEach(p => {
                                            let tmp = []
                                            tmp.push(invoiceId)
                                            tmp.push(p.method)
                                            tmp.push(p.value)
                                            valuesPayment.push(tmp)
                                        });
                                        let sql = "INSERT INTO paymentmethod (idInvoice, method, value) VALUES ?"
                                        connection.query(sql, [valuesPayment], function (err, result) {
                                            if (err) {
                                                connection.rollback(function () {
                                                    reject(err.sqlMessage);
                                                    connection.release();
                                                    //Failure
                                                });
                                            }
                                            else {
                                                connection.commit(function (err) {
                                                    if (err) {
                                                        connection.rollback(function () {
                                                            connection.release();
                                                            reject(err.sqlMessage);
                                                        });
                                                    } else {
                                                        connection.release();
                                                        resolve(result)
                                                        //Success
                                                    }
                                                });
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            })
        })
    },

    getDetailedInvoiceInfo: (ref, cb) => {
        return new Promise((resolve, reject) => {
            module.exports.getInvoiceInfo(ref)
                .then((values) => {
                    values.products.forEach(element => {
                        element.liquidTotal = element.unitPrice * element.quantity
                    });

                    // first, convert data into a Map with reduce
                    let taxes = values.products.reduce((prev, curr) => {
                        let count = prev.get(curr.tax) || 0;
                        prev.set(curr.tax, round(curr.quantity * curr.unitPrice + count));
                        return prev;
                    }, new Map());

                    // then, map your counts object back to an array
                    let taxesObj = [...taxes].map(([tax, incidence]) => {
                        var value = round(tax * incidence / 100)
                        return { tax, incidence, value }
                    })

                    values.taxes = taxesObj

                    var summary = {
                        sum: 0,
                        //TODO Desconto
                        noTax: 0,
                        tax: 0,
                        total: 0
                    }

                    taxesObj.forEach(element => {
                        summary.sum += element.incidence
                        //TODO desconto
                        summary.noTax += element.incidence
                        summary.tax += element.value
                    });

                    summary.total = summary.noTax + summary.tax
                    values.summary = summary
                    resolve(values)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },

    getInvoiceInfo: async (ref) => {
        var values = {}

        var productsQuery = "SELECT products.code, products.description, invoices_products.unitPrice, invoices_products.quantity, invoices_products.tax "
            + "FROM invoices INNER JOIN invoices_products "
            + "ON invoices.idInvoice = invoices_products.idinvoice "
            + "INNER JOIN products ON invoices_products.idProduct = products.idProduct "
            + "WHERE invoices.reference = ?;"

        var customerQuery = "SELECT customers.name, customers.nif, customers.address, customers.postalCode, customers.city, customers.permit "
            + "FROM invoices INNER JOIN customers "
            + "ON invoices.idCustomer = customers.idCustomer "
            + "WHERE invoices.reference = ?;"

        var companyQuery = "SELECT shortName, longName, nif, address, postalCode, city, country, phone, email, fax FROM company"

        var invoiceQuery = 'SELECT reference, createdAt, header_name, header_address, header_postalCode, header_city, header_phone, header_fax, header_email FROM invoices WHERE reference = ?'

        var paymentQuery = "SELECT paymentMethod.method, paymentMethod.value "
            + "FROM paymentmethod INNER JOIN invoices "
            + "ON invoices.idInvoice = paymentMethod.idInvoice "
            + "WHERE invoices.reference = ?;"

        return new Promise((resolve, reject) => {
            connection.query(invoiceQuery, ref, function (err, result) {
                if (err) reject(err.sqlMessage);
                else if (result.length === 0) {
                    reject('Reference not found');
                }
                else {
                    values.reference = result[0].reference
                    values.createdAt = result[0].createdAt
                    let header = {}
                    header.name = result[0].header_name
                    header.address = result[0].header_address
                    header.postalCode = result[0].header_postalCode
                    header.city = result[0].header_city
                    header.phone = result[0].header_phone
                    header.fax = result[0].header_fax
                    header.email = result[0].header_email
                    values.header = header
                    connection.query(companyQuery, function (err, companyResult) {
                        if (err) reject(err.sqlMessage);
                        else {
                            values.company = JSON.parse(JSON.stringify(companyResult[0]))
                            connection.query(customerQuery, ref, function (err, customerResult) {
                                if (err) reject(err.sqlMessage);
                                else {
                                    values.customer = JSON.parse(JSON.stringify(customerResult[0]))
                                    connection.query(productsQuery, ref, function (err, productsResult) {
                                        if (err) reject(err.sqlMessage);
                                        else {
                                            values.products = JSON.parse(JSON.stringify(productsResult))

                                            connection.query(paymentQuery, ref, function (err, paymentResult) {
                                                if (err) reject(err.sqlMessage);
                                                else {
                                                    values.payments = JSON.parse(JSON.stringify(paymentResult))
                                                    resolve(values)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })

    }
}