const express = require('express');
const router = express.Router();
const { loginAdmin, getStats, getAllUsers, getAllProperties, deleteUser, deleteAdminProperty } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminMiddleware');

// Admin authentication — public
router.post('/login', loginAdmin);

// Admin-protected routes
router.get('/stats', protectAdmin, getStats);
router.get('/users', protectAdmin, getAllUsers);
router.get('/properties', protectAdmin, getAllProperties);
router.delete('/users/:id', protectAdmin, deleteUser);
router.delete('/properties/:id', protectAdmin, deleteAdminProperty);

module.exports = router;
