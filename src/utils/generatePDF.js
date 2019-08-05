const puppeteer = require('puppeteer');
const fs = require('fs')
// const data = {
// 	"reference": "FR 2019/31",
// 	"date": 2019-08-02,
// 	"company": {
// 		"name": "ANIECA",
// 		"nif": 123123123,
// 		"address": "rua da anieca",
// 		"postalCode": "1223-123",
// 		"city": "Lisboa",
// 		"country": "PT"
// 	},
// 	"customer": {
// 		"name": "cliente",
// 		"nif": 234234234,
// 		"address": "rua do cliente 1",
// 		"postalCode": "1567-827",
// 		"city": "Lisboa",
// 		"country": "PT"
// 	},
// 	"products": [
// 		{
// 			"code": "ExA",
// 			"description": "Exame tipo A",
// 			"unitPrice": 3.50,
// 			"quantity": 2,
// 			"tax": 23
// 		},
// 		{
// 			"code": "ExB",
// 			"description": "Exame tipo B",
// 			"unitPrice": 5.00,
// 			"quantity": 1,
// 			"tax": 23
// 		},
// 		{
// 			"code": "ExC",
// 			"description": "Exame tipo C",
// 			"unitPrice": 10.00,
// 			"quantity": 1,
// 			"tax": 0
// 		}
// 	]
// }

const hbs = require('handlebars');
const path = require('path');

const compile = async (templateName, data) => {
    const filePath = path.join(process.cwd(), 'src/templates', `${templateName}.hbs`)
    const html = await fs.readFileSync(filePath, 'utf-8')
    hbs.registerHelper("math", function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });
    return hbs.compile(html)(data);
}

const formatData = (data) => {

    data.products.forEach(element => {
        element.unitPrice = element.unitPrice.toFixed(2)
        element.quantity = element.quantity.toFixed(2)
        element.tax = element.tax.toFixed(2)
        element.liquidTotal = element.liquidTotal.toFixed(2)
    });
    
    data.taxes.forEach(element => {
        if(element.tax === 0){
            element.tax = 'Isento'
        }
        else {element.tax = 'IVA' + element.tax }
        element.incidence = element.incidence.toFixed(2)
        element.value = element.value.toFixed(2)
    });

    data.summary.sum = data.summary.sum.toFixed(2)
    data.summary.noTax = data.summary.noTax.toFixed(2)
    data.summary.tax = data.summary.tax.toFixed(2)
    data.summary.total = data.summary.total.toFixed(2)

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
            path: 'mypdf.pdf',
            format: 'A4',
            printBackground: true
        })

        console.log('done');
        // await browser.close()
        return pdf
    } catch (error) {
        // console.log(error);
        throw error
    }
}

module.exports = run