const express = require('express');
const router = new express.Router()
const connection = require('../db/mysql');

const round = (num) => {
    return Math.round(num * 1e2) / 1e2
}

router.get('/saft', (req, res) => {
    var year = req.query.year
    var month = req.query.month

    var SAFT = {
        "Header": {
            // TODO
            "AuditFileVersion": "1.04_01",
            "CompanyID": "",
            "TaxRegistrationNumber": "",
            "TaxAccountingBasis": "F",
            "CompanyName": "",
            "BusinessName": "",
            "CompanyAddress": {
                "AddressDetail": "",
                "City": "",
                "PostalCode": "",
                "Country": ""
            },
            "FiscalYear": "",
            "StartDate": "",
            "EndDate": "",
            "CurrencyCode": "EUR",
            "DateCreated": "",
            "TaxEntity": "Global",
            "ProductCompanyTaxID": "???KBZ???", //TODO KBZ?
            "SoftwareCertificateNumber": "????",
            "ProductID": "???ANIGEST???", //TODO ANIGEST?
            "ProductVersion": "????", //TODO ??
        },
        "MasterFiles": {},
        "SourceDocuments": {}
    }

    var customerQuery = 'SELECT DISTINCT `customers`.`idCustomer`, `customers`.`name`, `customers`.`nif`, `customers`.`address`, `customers`.`postalCode`, `customers`.`city`, `customers`.`country`'
        + ' FROM (`customers` JOIN `invoices`'
        + ' ON ((`invoices`.`idCustomer` = `customers`.`idCustomer`)))'
        + ' WHERE ((YEAR(`invoices`.`createdAt`) = ?) AND (MONTH(`invoices`.`createdAt`) = ?))'

    var productQuery = 'SELECT DISTINCT `products`.`code`,`products`.`description`,`products`.`productType`'
        + ' FROM ((`products`'
        + ' JOIN `invoices_products` ON ((`products`.`idProduct` = `invoices_products`.`idProduct`)))'
        + ' JOIN `invoices` ON ((`invoices`.`idInvoice` = `invoices_products`.`idInvoice`)))'
        + ' WHERE ((YEAR(`invoices`.`createdAt`) = ?) AND (MONTH(`invoices`.`createdAt`) = ?))'

    // var invoicesQuery = 'SELECT distinct reference, type, idCustomer, createdAt, unitPrice, quantity, tax, products.code, productType, description  FROM `invoice-app-test`.invoices '
    //     + 'inner join invoices_products on invoices.idInvoice = invoices_products.idInvoice '
    //     + 'inner join products on invoices_products.idProduct = products.idProduct '
    //     + 'WHERE ((YEAR(`invoices`.`createdAt`) = ?) AND (MONTH(`invoices`.`createdAt`) = ?))'

    var invoicesQuery = "SELECT g.reference, g.createdAt, g.idCustomer,"
        + " CONCAT('[', GROUP_CONCAT( JSON_OBJECT('code', u.code, 'description', u.description, 'quantity', ug.quantity, 'unitPrice', ug.unitPrice, 'tax', ug.tax) ),']')"
        + " AS products FROM invoices g JOIN invoices_products ug"
        + " ON ug.idInvoice = g.idInvoice JOIN products u"
        + " ON ug.idProduct = u.idProduct"
        + " WHERE ((YEAR(g.createdAt) = ?) AND (MONTH(g.createdAt) = ?))"
        + " GROUP BY g.reference"
    //https://stackoverflow.com/questions/53766447/sql-many-to-many-json

    var taxQuery = 'select distinct tax from invoices_products'
        + ' JOIN `invoices` ON `invoices`.`idInvoice` = `invoices_products`.`idInvoice`'
        + ' WHERE ((YEAR(`invoices`.`createdAt`) = ?) AND (MONTH(`invoices`.`createdAt`) = ?))'

    var companyQuery = "SELECT shortName, longName, nif, address, postalCode, city, country, phone, email, fax FROM `invoice-app-test`.company;"

    connection.query(companyQuery, function (err, companyResult) {
        if (err)
            console.log(err);
        else {
            var company = JSON.parse(JSON.stringify(companyResult[0]));
            console.log(company);

            SAFT.Header.CompanyID = company.nif
            SAFT.Header.TaxRegistrationNumber = company.nif
            SAFT.Header.CompanyName = company.shortName + " - " + company.longName
            SAFT.Header.BusinessName = company.shortName + " - " + company.longName
            SAFT.Header.CompanyAddress.AddressDetail = company.address
            SAFT.Header.CompanyAddress.City = company.city
            SAFT.Header.CompanyAddress.PostalCode = company.postalCode
            SAFT.Header.CompanyAddress.Country = company.country

            SAFT.Header.FiscalYear = year
            var lastDayOfMonth = new Date(year, month, 0).getDate();
            SAFT.Header.StartDate = year + '-' + month + '-01'
            SAFT.Header.EndDate = year + '-' + month + '-' + lastDayOfMonth

            SAFT.Header.DateCreated = new Date().toISOString().slice(0,10);

            connection.query(customerQuery, [year, month], function (err, customerResult) {
                if (err)
                    console.log(err);
                else {
                    var customerRows = JSON.parse(JSON.stringify(customerResult));

                    var Customer = []
                    customerRows.forEach(element => {
                        let tmp = {}

                        tmp.CustomerID = element.idCustomer
                        tmp.AccountID = "Desconhecido"
                        tmp.CustomerTaxID = element.nif
                        tmp.CompanyName = element.name

                        let BillingAddress = {}
                        BillingAddress.AddressDetail = element.address
                        BillingAddress.City = element.city
                        BillingAddress.PostalCode = element.postalCode
                        BillingAddress.Country = element.country
                        tmp.BillingAddress = BillingAddress
                        tmp.SelfBillingIndicator = "0"

                        Customer.push(tmp)
                    });

                    SAFT.MasterFiles.Customer = (Customer)

                    connection.query(productQuery, [year, month], function (err, productsResult) {
                        if (err)
                            console.log(err);
                        else {
                            var productRows = JSON.parse(JSON.stringify(productsResult));

                            var Product = []
                            productRows.forEach(element => {
                                let tmp = {}
                                tmp.ProductType = element.productType
                                tmp.ProductCode = element.code
                                tmp.ProductGroup = "Exames" //TODO Quais são os grupos de produtos?
                                tmp.ProductDescription = element.description
                                tmp.ProductNumberCode = element.code
                                Product.push(tmp)
                            });
                            SAFT.MasterFiles.Product = (Product)

                            connection.query(taxQuery, [year, month], function (err, taxResult) {
                                if (err)
                                    console.log(err);
                                else {
                                    var taxRows = JSON.parse(JSON.stringify(taxResult));
                                    var TaxTable = {
                                        TaxTableEntry: []
                                    }
                                    taxRows.forEach(element => {
                                        let tmp = {}
                                        tmp.TaxType = "IVA"
                                        tmp.TaxCountryRegion = "PT"
                                        if (element.tax === 0) {
                                            tmp.TaxCode = "ISE"
                                        }
                                        else {
                                            tmp.TaxCode = "NOR"
                                        }
                                        tmp.description = "Continente"
                                        tmp.TaxPercentage = element.tax
                                        TaxTable.TaxTableEntry.push(tmp)
                                    });
                                    SAFT.MasterFiles.TaxTable = TaxTable

                                    connection.query(invoicesQuery, [year, month], function (err, invoicesResult) {
                                        if (err)
                                            console.log(err)
                                        else {
                                            var invoiceRows = JSON.parse(JSON.stringify(invoicesResult));
                                            SalesInvoices = {}
                                            SalesInvoices.NumberOfEntries = invoiceRows.length
                                            SalesInvoices.TotalDebit = "0.00"
                                            SalesInvoices.TotalCredit = ""
                                            SalesInvoices.Invoice = []
                                            let tmpTotalCredit = 0

                                            for (const invoiceIterator of invoiceRows) {
                                                let tmpInvoice = {}
                                                tmpInvoice.InvoiceNo = invoiceIterator.reference
                                                // TODO
                                                // "DocumentStatus": {
                                                //     "InvoiceStatus": "N",
                                                //     "InvoiceStatusDate": "2018-12-11T12:16:52",
                                                //     "SourceID": "TESTE",
                                                //     "SourceBilling": "P"
                                                //   },
                                                //   "Hash": "O065zSBsJRSa0qY+OsylmbSSx3Fs6JBSO67b9atM7eba+8lSQ11Jv5JRGjoBx8PkUUnn0wt2OwaOebd33pJdeZq17aot5txdtl/4/C4b2faqm6WyCC74ObBrYp7A8AUwy1ANKvRpYLo14MsHpPUchioHH256LMa+njNRc74OtzA=",
                                                //   "HashControl": "1",
                                                //   "Period": "12",
                                                //   "InvoiceDate": "2018-12-11",
                                                //   "InvoiceType": "FR",
                                                //   "SpecialRegimes": {
                                                //     "SelfBillingIndicator": "0",
                                                //     "CashVATSchemeIndicator": "0",
                                                //     "ThirdPartiesBillingIndicator": "0"
                                                //   },
                                                //   "SourceID": "TESTE",
                                                //   "SystemEntryDate": "2018-12-11T12:16:52",
                                                tmpInvoice.CustomerID = invoiceIterator.idCustomer
                                                tmpInvoice.Line = []
                                                let tmpTaxPayable = 0
                                                let tmpNetTotal = 0

                                                let products = JSON.parse(invoiceIterator.products)
                                                for (const [index, productIterator] of products.entries()) {
                                                    let tmpProduct = {}
                                                    tmpProduct.LineNumber = index + 1
                                                    tmpProduct.ProductCode = productIterator.code
                                                    tmpProduct.ProductDescription = productIterator.description
                                                    tmpProduct.Quantity = productIterator.quantity
                                                    tmpProduct.UnitOfMeasure = "Unidade"
                                                    tmpProduct.UnitPrice = productIterator.unitPrice
                                                    tmpProduct.TaxPointDate = invoiceIterator.createdAt
                                                    tmpProduct.Description = productIterator.description
                                                    tmpProduct.CreditAmount = productIterator.unitPrice
                                                    if (productIterator.tax !== 0) {
                                                        tmpProduct.Tax = {
                                                            TaxType: "IVA",
                                                            TaxCountryRegion: "PT",
                                                            TaxCode: "NOR",
                                                            TaxPercentage: productIterator.tax
                                                        }
                                                    }
                                                    else {
                                                        tmpProduct.Tax = {
                                                            TaxType: "IVA",
                                                            TaxCountryRegion: "PT",
                                                            TaxCode: "ISE",
                                                            TaxPercentage: productIterator.tax
                                                        }
                                                        tmpProduct.TaxExemptionReason = "Artigo 16.º N.º 6 alínea c) do CIVA"
                                                    }
                                                    tmpProduct.SettlementAmount = "0" //TODO O que é isto?
                                                    tmpInvoice.Line.push(tmpProduct)

                                                    //Calcular somas de invoice e de total
                                                    let productTotal = productIterator.quantity * productIterator.unitPrice
                                                    tmpNetTotal += productTotal
                                                    tmpTotalCredit += productTotal
                                                    tmpTaxPayable += (productTotal * (productIterator.tax / 100))
                                                }

                                                tmpInvoice.DocumentTotals = {
                                                    TaxPayable: round(tmpTaxPayable),
                                                    NetTotal: round(tmpNetTotal),
                                                    GrossTotal: round(tmpTaxPayable + tmpNetTotal)
                                                }
                                                SalesInvoices.Invoice.push(tmpInvoice)
                                            }
                                            SalesInvoices.TotalCredit = round(tmpTotalCredit)
                                            SAFT.SourceDocuments.SalesInvoices = SalesInvoices

                                            res.send(SAFT)

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

module.exports = router
