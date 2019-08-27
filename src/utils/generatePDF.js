const puppeteer = require('puppeteer');
const fs = require('fs')

const hbs = require('handlebars');
const path = require('path');

const compile = async (templateName, data) => {
    const filePath = path.join(process.cwd(), 'src/templates', `${templateName}.hbs`)
    const html = await fs.readFileSync(filePath, 'utf-8')
    return hbs.compile(html)(data);
}

const formatData = (data) => {

    data.createdAt = data.createdAt.split(" ")[0]

    if (data.company.phone) {
        data.company.phone = 'Telef. nº ' + data.company.phone
    }

    // if (data.company.fax) {
    //     data.company.fax = 'Fax nº ' + data.company.fax
    // }

    if (data.company.email) {
        data.company.email = 'Email: ' + data.company.email
    }

    if (data.header.phone) {
        data.header.phone = 'Telef. nº ' + data.header.phone
    }

    // if (data.header.fax) {
    //     data.header.fax = 'Fax nº ' + data.header.fax
    // }

    if (data.header.email) {
        data.header.email = 'Email: ' + data.header.email
    }


    data.products.forEach(element => {
        element.unitPrice = element.unitPrice.toFixed(2)
        element.quantity = element.quantity.toFixed(2)
        element.tax = element.tax.toFixed(2)
        element.liquidTotal = element.liquidTotal.toFixed(2)
    });

    data.taxes.forEach(element => {
        if (element.tax === 0) {
            element.tax = 'Isento'
        }
        else { element.tax = 'IVA' + element.tax }
        element.incidence = element.incidence.toFixed(2)
        element.value = element.value.toFixed(2)
    });

    data.summary.sum = data.summary.sum.toFixed(2)
    //TODO desconto
    data.summary.noTax = data.summary.noTax.toFixed(2)
    data.summary.tax = data.summary.tax.toFixed(2)
    data.summary.total = data.summary.total.toFixed(2)

    if (data.customer.permit === 0)
        data.customer.permit = null
    if (data.customer.permit) {
        data.customer.permit = 'Alvará nº ' + data.customer.permit
    }

    data.payments.forEach(element => {
        element.value = element.value.toFixed(2)
    })

    if (data.signature) {
        let processed = "Processado por programa certificado n.º xxxx/AT" // TODO numero de certificação
        data.signature += "-" + processed
    }

    function base64_encode(file) {
        var bitmap = fs.readFileSync(file);
        return new Buffer.from(bitmap).toString('base64');
    }
    data.img = 'data:image/png;base64,' + base64_encode(process.cwd() + '/src/templates/anieca.png');

    return data
}

const run = async (data) => {
    try {
        let cleanedData = formatData(data)
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('invoice', cleanedData)

        await page.setContent(content);
        await page.emulateMedia('print')
        const pdf = await page.pdf({
            //path: 'mypdf.pdf',
            format: 'A4',
            printBackground: true
        })

        await browser.close()
        return pdf
    } catch (error) {
        // console.log(error);
        throw error
    }
}

module.exports = run