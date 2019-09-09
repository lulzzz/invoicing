const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//see if the user is logged in (token is valid)
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        jwt.verify(token, 'sssshhhh')

        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = auth