/** @format */

const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async(req, res) => {
    const { username, password } = req.body;

    //simple validation
    if (!username || !password)
        return res.status(400).json({
            success: false,
            message: 'Missing username and/or password}',
        });
    try {
        //check for existing user
        const user = await User.findOne({
            username: username,
        });

        if (user)
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'User already exists',
                });

        //AllGood

        const hashedPassword = await argon2.hash(password);

        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.send('hello');

        //return token
        const accessToken = jwt.sign({
                userId: newUser._id
            },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({
            success: true,
            message: 'Successfully registered user',
            accessToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'internet server error' })
    }
});


// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    //Simple validation
    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Missing username and/or password' })
    try {
        //check for exist user
        const user = await User.findOne({ username })
        if (!user)
            return res.status(404).json({
                    success: false,
                    message: 'incorrect username or password'
                }) //Username found
        const password = await argon2.verify(user.password, password);
        if (!passwordValid)
            return res.status(400).json({ success: false, message: 'incorrect username or password' })
                //AllGood
                //return token 
        const accessToken = jwt.sign({ userId: user._id },
            process.env.ACCESS_TOKEN_SECRET)
        re.json({
            success: true,
            message: 'user created successfully',
            accessToken
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'incorrect username or password' })

    }
});
module.exports = router;