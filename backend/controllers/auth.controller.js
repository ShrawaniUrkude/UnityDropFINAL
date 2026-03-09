const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'unitydrop_secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// In-memory users for fallback
let inMemoryUsers = [];

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        
        // Check if user exists
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }
            
            const user = await User.create({ name, email, password, phone, role });
            const token = generateToken(user._id);
            
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token
                }
            });
        } catch (dbError) {
            // In-memory fallback
            const existing = inMemoryUsers.find(u => u.email === email);
            if (existing) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            }
            
            const newUser = {
                _id: `user_${Date.now()}`,
                name, email, password, phone, role: role || 'donor',
                createdAt: new Date()
            };
            inMemoryUsers.push(newUser);
            
            const token = generateToken(newUser._id);
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: { _id: newUser._id, name, email, role: newUser.role, token }
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }
        
        try {
            const user = await User.findOne({ email }).select('+password');
            
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            
            // Update last login
            user.lastLogin = new Date();
            await user.save({ validateBeforeSave: false });
            
            const token = generateToken(user._id);
            
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token
                }
            });
        } catch (dbError) {
            // In-memory fallback
            const user = inMemoryUsers.find(u => u.email === email && u.password === password);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
            
            const token = generateToken(user._id);
            res.json({
                success: true,
                data: { _id: user._id, name: user.name, email: user.email, role: user.role, token }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        try {
            const user = await User.findById(req.user.id);
            res.json({ success: true, data: user });
        } catch (dbError) {
            const user = inMemoryUsers.find(u => u._id === req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            res.json({ success: true, data: user });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Logout (just for acknowledgment, JWT is stateless)
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};
