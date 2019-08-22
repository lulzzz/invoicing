const NodeRSA = require('node-rsa');
const fs = require('fs');

const hash = (invoiceDate, systemEntrydate, invoiceNo, grosstotal, previousHash) => {

    const privateKey = fs.readFileSync('./key/invoice_key')

    var message = invoiceDate + ';' + systemEntrydate + ';' + invoiceNo + ';' + grosstotal + ';' + previousHash

    const key = new NodeRSA(privateKey);
    var signed = key.sign(message, 'base64');
    
    return signed
}

module.exports = hash