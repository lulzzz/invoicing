const connection = require('../db/mysql');

var getProductId = (code) => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT idProduct FROM products WHERE code = ?"
        connection.query(sql, code,
            function (err, result) {
                if (err)
                    reject(err);
                else{
                    console.log(result.length);
                    if(result.length === 0){
                        reject('Product with code ' + code + ' does not exist.')
                        return
                    }
                    resolve(result[0].idProduct)
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
                else
                    resolve(result[0].idCustomer);
                    //TODO erro quando nao e encontrado nif
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
        console.log(values);
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO invoices_products (idInvoice, idProduct, unitPrice, quantity, tax) VALUES ?"
            connection.query(sql, [values], function (err, result) {
                if (err)
                    reject(err);
                else
                    resolve(result)
            });
        });

    }
}