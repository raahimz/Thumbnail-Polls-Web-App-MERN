const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST api/users
// @desc    register user
// @access  Public
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Valid email is required').isEmail(),
        check('password', 'Password with at least 6 characters is required').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Check if user already exists
            const foundUser = await User.findOne({ email });
            if (foundUser) {
                return res.status(400).json({errors: [{msg: 'User already exists with that email'}]});
            }

            // Creating new user
            const newUser = new User({
                name,
                email,
                password
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(password, salt);

            // Saving new user
            await newUser.save();

            // Return jswebtoken
            const payload = {
                user: {
                    id: newUser.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtsecret'),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                }
            )
        } catch (err) {
            console.error(err.message);
            res.status(500).json('Server error');
        }
    }
);

module.exports = router;