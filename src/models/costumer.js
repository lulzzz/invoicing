const mongoose = require('mongoose');

const costumerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    nif: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => {
                return /^[0-9]{9}/.test(v);
            },
            message: 'Provided NIF number is invalid.'
        }
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true
    },
    address: {
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, //should be true
            ref: 'User'
        }
    }
})

costumerSchema.virtual('invoicesFromCostumer', {
    ref: 'Invoice',
    localField: '_id',
    foreignField: 'costumer'
})

const Costumer = mongoose.model('Costumer', costumerSchema)

module.exports = Costumer