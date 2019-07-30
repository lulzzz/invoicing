const validatePostBody = async (req, res, next) => {

    try {
        if(!req.body.company) throw new Error("missing company")
        if(!req.body.customer) throw new Error("missing company")
        if(!req.body.products) throw new Error("missing company")
        if(req.body.products.length === 0) throw new Error("must have products")

        next()
    } catch (error) {
        res.status(400).send('Bad request: ' + error.message)
    }
    
}

module.exports = validatePostBody