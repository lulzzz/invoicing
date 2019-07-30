// designação e tipo de produtos ou serviços

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    tax: {
        type: String,
        // enum: ['IVA23', 'IVA22', 'IVA18', 'Isento'],
        default: 'IVA23',
        required: true
    },
    pvp: {
        type: mongoose.Decimal128,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, //should be true
        ref: 'User'
    }
})

productSchema.virtual('invoicesFromProduct', {
    ref: 'Invoice',
    localField: '_id',
    foreignField: 'products'
})

productSchema.pre('save', function (next) {
    var product = this
    switch (product.tax) {
        case 'IVA23':
            product.pvp = product.unitPrice * 1.23
            break;
        case 'IVA22':
            product.pvp = product.unitPrice * 1.22
            break;
        case 'IVA18':
            product.pvp = product.unitPrice * 1.18
            break;
        case 'Isento':
            product.pvp = product.unitPrice
            break;
        default:
            throw new Error('Invalid tax')
            break;
    }
    next()
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product