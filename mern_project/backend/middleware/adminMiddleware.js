const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Middleware to protect admin-only routes
const protectAdmin = async (req, res, next) => {
    // The protect middleware runs first and sets req.user
    // Here we additionally check if the user is actually an Admin document
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Try to find in Admin collection
            const admin = await Admin.findById(decoded.id).select('-password');
            if (!admin) {
                return res.status(403).json({ message: 'Forbidden — admin access required' });
            }
            req.admin = admin;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protectAdmin };
