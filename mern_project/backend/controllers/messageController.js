const Message = require('../models/Message');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Submit a contact message
// @route   POST /api/messages
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const createMessage = async (req, res) => {
    try {
        const { name, email, number, message } = req.body;

        if (!name || !email || !number || !message) {
            return res.status(400).json({ message: 'All fields are required: name, email, number, message' });
        }

        const newMessage = await Message.create({ name, email, number, message });
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all contact messages (admin only)
// @route   GET /api/messages
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a contact message (admin only)
// @route   DELETE /api/messages/:id
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteMessage = async (req, res) => {
    try {
        const msg = await Message.findById(req.params.id);
        if (!msg) return res.status(404).json({ message: 'Message not found' });

        await msg.deleteOne();
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createMessage, getAllMessages, deleteMessage };
