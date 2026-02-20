const express = require('express');
const router = express.Router();
const { createMessage, getAllMessages, deleteMessage } = require('../controllers/messageController');
const { protectAdmin } = require('../middleware/adminMiddleware');

// Public — anyone can submit a contact form
router.post('/', createMessage);

// Admin only — protectAdmin handles its own JWT verification
router.get('/', protectAdmin, getAllMessages);
router.delete('/:id', protectAdmin, deleteMessage);

module.exports = router;
