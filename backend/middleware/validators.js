const { validationResult } = require('express-validator');

// Validate request
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Rate limiting (simple in-memory)
const requestCounts = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

exports.rateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return next();
    }
    
    const record = requestCounts.get(ip);
    
    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + WINDOW_MS;
        return next();
    }
    
    if (record.count >= MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later'
        });
    }
    
    record.count++;
    next();
};
