const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Property = require('../models/Property');
const Saved = require('../models/Saved');
const Request = require('../models/Request');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
    try {
        const { name, email, number, password } = req.body;

        if (!name || !email || !number || !password) {
            return res.status(400).json({ message: 'All fields are required: name, email, number, password' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            number: number.trim(),
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/users/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get real dashboard stats in parallel
        const [properties, saved, enquiries] = await Promise.all([
            Property.countDocuments({ user: req.user._id }),
            Saved.countDocuments({ user: req.user._id }),
            Request.countDocuments({ receiver: req.user._id }),
        ]);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            number: user.number,
            // Dashboard stats
            properties,
            saved,
            enquiries,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, number, password, currentPassword } = req.body;

        // If changing password, require current password
        if (password) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to change password' });
            }
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
            if (password.length < 6) {
                return res.status(400).json({ message: 'New password must be at least 6 characters' });
            }
            user.password = password;
        }

        // Check email uniqueness if changed
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use by another account' });
            }
            user.email = email.toLowerCase().trim();
        }

        user.name = name ? name.trim() : user.name;
        user.number = number ? number.trim() : user.number;

        const updated = await user.save();
        res.json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            number: updated.number,
            token: generateToken(updated._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
