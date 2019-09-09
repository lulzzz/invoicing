const express = require('express');
const router = new express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const connection = require('../db/mysql');

router.post('/register', async (req, res) => {
    var user = req.body.user
    var pwd = req.body.password
    if (user && pwd) {
        console.log(pwd);
        var hashedPassword = await bcrypt.hash(pwd, 8)

        var values = []
        values.push(user)
        values.push(hashedPassword)


        connection.query('INSERT INTO users (user, password) VALUES (?)', [values], (error, results) => {
            if (error) {
                res.status(400).send(error)
            }
            else {
                res.status(201).send('User created')
            }
        })
    }
    else {
        res.status(422).send("Please provide a name and a password")
    }
})

router.post('/login', (req, res) => {
    try {
        var user = req.body.user
        var pwd = req.body.password

        connection.query('select * from users where user = ?', [user], async (error, results) => {
            if (error) {
                res.status(400).send(error)
            }
            else {
                console.log(results);
                if (results.length !== 0) {
                    const isMatch = await bcrypt.compare(pwd, results[0].password)
                    if (!isMatch) {
                        res.status(400).send('wrong credentials')
                    }
                    else {
                        const token = jwt.sign({ user }, 'sssshhhh')
                        res.status(200).send(token)
                    }
                }
                else {
                    res.status(400).send('wrong credentials')
                }
            }
        })


    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/auth', auth, (req, res) => {
    res.send('authenticated')
})

module.exports = router