const puppeteer = require('puppeteer');
const fs = require('fs')
const data = {
	"reference": "FR 2019/31",
	"date": 2019-08-02,
	"company": {
		"name": "ANIECA",
		"nif": 123123123,
		"address": "rua da anieca",
		"postalCode": "1223-123",
		"city": "Lisboa",
		"country": "PT"
	},
	"customer": {
		"name": "cliente",
		"nif": 234234234,
		"address": "rua do cliente 1",
		"postalCode": "1567-827",
		"city": "Lisboa",
		"country": "PT"
	},
	"products": [
		{
			"code": "ExA",
			"description": "Exame tipo A",
			"unitPrice": 3.50,
			"quantity": 2,
			"tax": 23
		},
		{
			"code": "ExB",
			"description": "Exame tipo B",
			"unitPrice": 5.00,
			"quantity": 1,
			"tax": 23
		},
		{
			"code": "ExC",
			"description": "Exame tipo C",
			"unitPrice": 10.00,
			"quantity": 1,
			"tax": 0
		}
	]
}

const hbs = require('handlebars');
const path = require('path');

const compile = async (templateName, data) => {
    const filePath = path.join(process.cwd(), 'src/templates', `${templateName}.hbs`)
    const html = await fs.readFileSync(filePath, 'utf-8')
    hbs.registerHelper("math", function(lvalue, operator, rvalue, options) {
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

const run = async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('invoice', data)

        await page.setContent(content);
        await page.emulateMedia('print')
        await page.pdf({
            path: 'mypdf.pdf',
            format: 'A4',
            printBackground: true
        })

        console.log('done');
        await browser.close()
        process.exit()
    } catch (error) {
        console.log(error);
    }
}

run()