const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
        unique: true,
        required: false,
        trim: true,
        lowercase: true
    },
    website: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Your password can\'t contain the word \'password\'')
            }
        }
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
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
{
    // timestamps: true,
    minimize: true
}
)


//to assign tasks to the user who created them
userSchema.virtual('invoices', {
    ref: 'Invoice',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('costumers', {
    ref: 'Costumer',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner'
})


// hide sensitive information when user content is requested
// userSchema.methods.toJSON = function() {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens
//     delete userObject.avatar
    
//     return userObject
// }

//generate auth token when user is logged in
// userSchema.methods.generateAuthToken = async function() {
//     const user = this

//     const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
//     user.tokens = user.tokens.concat({token})
//     user.save()
//     return token
// }

//Find user by credentials to login
// userSchema.statics.findByCredentials = async (email, password) => {
//     const user = await User.findOne({email})

//     if (!user) {
//         throw new Error('Unable to login')
//     }

//     const isMatch = await bcrypt.compare(password, user.password)

//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }
//     return user
// }

//Hash the plain text password before saving
// userSchema.pre('save', async function (next) {
//     const user = this

//     if(user.isModified('password')){
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next()
// })

//delete user tasks when user is removed
// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id})
//     next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User