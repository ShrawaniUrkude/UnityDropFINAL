const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'unitydrop_secret');
            
            try {
                req.user = await User.findById(decoded.id);
            } catch (dbError) {
                // Fallback - just use the decoded token
                req.user = { id: decoded.id };
            }
            
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or expired'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Authorize by role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user?.role || 'unknown'} is not authorized to access this route`
            });
        }
        next();
    };
};
