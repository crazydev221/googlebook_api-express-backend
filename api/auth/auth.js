const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import the model
const UserModel = require('../../model/users');
const env = require('../../const/env');

var router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Auth API is running!'
    });
});

/** *
 * This is a token verify function
* @route GET /api/auth/protected
* @param no param
* @return token verification is true or false
*/
router.get('/protected', verifyToken, (req, res) => {
    res.send({
        success: true,
        message: req.user.email + ' are authorized'
    });
});

/** *
 * This is a register function in googlebook backend
* @route GET /api/auth/register
* @param email, password
* @return user signup is success or not
*/
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check the multiple user by email
        const existUser = await UserModel.findOne( {where: {email: email} });
        if(existUser) {
            return res.status(400).send({
                message: 'Email already exists'
            });
        }
        
        // If user is not multiple, create user account
        const hash = await bcrypt.hash(password, 10); // encrypt the password with hash
        await UserModel.create({ // Create User
            email: email,
            password: hash
        })

        // If registered, send the success message
        console.log(`${email} registered`);
        res.status(201).send({
            message: 'User registered'
        });
    } catch {
        // If error was occurred, send the error message
        console.error('Register Error:', err);
        res.status(500).send({
            message: 'Error in Register'
        });
    }
});

/** *
 * This is a login function in googlebook backend
* @route POST /api/auth/login
* @param email, password
* @return signin is success or not
*/
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email address
        const user = await UserModel.findOne({ where: { email: email } });
        if(!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        // If valid email, check the password
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            return res.status(401).send({
                message: 'Incorrect password'
            });
        }

        // If valid email and password, send JWT token
        const token = jwt.sign({ email: user.email }, env.JWT_SECRET);
        res.json({
            token: 'Bearer ' + token
        });
    } catch(error) {
        // If error was occurred, send the error message
        console.error('Login failed', error);
        res.status(500).send('Login failed!');
    }
});

function verifyToken(req, res, next) {
    const head = req.headers.authorization.slice(0, 6);
    if (head !== 'Bearer') { // Check the token is Bearer token
        return res.status(400).send({
            success: false,
            message: 'This is not Bearer token'
        });
    }
    const token = req.headers.authorization.slice(7);

    // If token is null, send error message
    if(!token) {
        return res.status(401).send({
            message: 'Access is denied, token is expired'
        });
    }
    try {
        // Decode the json web token
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // If error is occurred in decoding, send error message 
        return res.status(400).send({
            message: 'Invalid token'
        });
    }
}

module.exports = [router, verifyToken];
