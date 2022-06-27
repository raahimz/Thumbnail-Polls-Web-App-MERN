const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET api/auth
// @desc    Get user data if authenticated
// @access  Private

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user and get token (login)
// @access  Public

router.post(
    '/',
    [
        check('email', 'Valid email is required').isEmail(),
        check('password', 'Valid password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
            
        try {
            // Get user with given email
            const foundUser = await User.findOne({ email });

            // Checking whether given email is registered
            if (!foundUser) {
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
            }

            // Authenticating whether given password is correct
            const isMatch = await bcrypt.compare(password, foundUser.password);

            if (!isMatch) {
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
            }
            // Return jswebtoken
            const payload = {
                user: {
                    id: foundUser.id
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