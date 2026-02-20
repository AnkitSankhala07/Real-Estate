const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Property = require('../models/Property');
const Message = require('../models/Message');
const Request = require('../models/Request');
const cloudinary = require('../config/cloudinary');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const loginAdmin = async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: 'Name and password are required' });
        }

        const admin = await Admin.findOne({ name });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                token: generateToken(admin._id),
                isAdmin: true,
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
    try {
        const [userCount, propertyCount, messageCount, requestCount] = await Promise.all([
            User.countDocuments(),
            Property.countDocuments(),
            Message.countDocuments(),
            Request.countDocuments(),
        ]);

        res.json({
            users: userCount,
            properties: propertyCount,
            messages: messageCount,
            enquiries: requestCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a user (and their properties/saved/requests)
// @route   DELETE /api/admin/users/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete all user's properties (and their Cloudinary images)
        const userProperties = await Property.find({ user: user._id });
        for (const prop of userProperties) {
            for (const url of prop.images) {
                if (url.includes('cloudinary')) {
                    const publicId = url.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.uploader.destroy(publicId).catch(() => { });
                }
            }
            await prop.deleteOne();
        }

        await user.deleteOne();
        res.json({ message: `User ${user.name} and all their data deleted` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all properties (admin view)
// @route   GET /api/admin/properties
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({})
            .populate('user', 'name email number')
            .sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Admin delete any property
// @route   DELETE /api/admin/properties/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteAdminProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        // Delete images from Cloudinary
        for (const url of property.images) {
            if (url.includes('cloudinary')) {
                const publicId = url.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId).catch(() => { });
            }
        }

        await property.deleteOne();
        res.json({ message: 'Property deleted by admin' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginAdmin, getStats, getAllUsers, getAllProperties, deleteUser, deleteAdminProperty };
