const express = require('express');
const router = new express.Router()

//Create a new user
router.post('/company', async (req, res) => {
    var name = req.body.name
    var nif = req.body.nif
    var address = req.body.address
    var postalCode = req.body.postalCode
    var city = req.body.city
    var country = req.body.country
})

module.exports = router

// {
//     name: String,
//     nif: Number (xxxxxxxxx),
//     address: String,
//     postalCode: String (xxxx-xxx),
//     city: String,
//     country: String (PT)
// }