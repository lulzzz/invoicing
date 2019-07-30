const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    ref: {
        type: String,
        unique:true
    },
    company: {
        name: String,
        nif: {
            type: Number,
            required: true,
            validate: {
                validator: (v) => {
                    return /^[0-9]{9}/.test(v);
                },
                message: 'Provided NIF number is invalid.'
            }
        },
        address: String,
        postalCode: String,
        city: String,
        country: String
    },
    customer: {
        name: String,
        nif: {
            type: Number,
            required: true,
            validate: {
                validator: (v) => {
                    return /^[0-9]{9}/.test(v);
                },
                message: 'Provided NIF number is invalid.'
            }
        },
        address: String,
        postalCode: String,
        city: String,
        country: String
    },
    products: [{
        code: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ''
        },
        unitPrice: {
            type: mongoose.Decimal128,
            default: 0,
            required: true
        },
        quantity: Number,
        tax: {
            type: Number,
            enum: [23, 22, 18, 0],
            default: 23,
            required: true
        },
        discount: {
            type: Number,
            required: true,
            default:0
        }
    }]
}, {
    timestamps: true
})

//Hash the plain text password before saving
invoiceSchema.pre('save', async function (next) {
    const invoice = this
    const nDocs = await Invoice.countDocuments({}, function(err, c) {
        return c;
    });
    
    invoice.ref = 'FR ' + invoice.createdAt.getFullYear() + '/' + (nDocs+1)
    next()
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice