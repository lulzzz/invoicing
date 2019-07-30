const connection = require('../db/mysql');

module.exports = {
    getNoInvoices : () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(*) AS invoiceCount FROM invoices', function (err, result) {
                if (err)
                    reject(err)
                else
                    resolve(result[0].invoiceCount)

            });
        })
    },

    getCustomerId : (customerNIF) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT idCustomer FROM customers where nif = ?', [customerNIF], function (err, result) {
                if (err)
                    reject(err)
                else
                    resolve(result[0].idCustomer);
            });
        })
    },

    insertInvoice : (reference, invoiceType, date, customerId) => {
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO invoices (reference, type, createdAt, FK_idCustomer) VALUES ('" + reference + "', '" + invoiceType + "', '" + date + "', " + customerId + ")"
            connection.query(sql, [reference],
                function (err, result) {
                    if (err)
                        // res.status(400).send(err)
                        reject(err);
                    else
                        resolve(reference)
                });
        })
    }
}