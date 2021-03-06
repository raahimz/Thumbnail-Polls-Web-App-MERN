const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check for token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtsecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is invalid, authorization denied' });
    }
}