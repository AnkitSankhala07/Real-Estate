const express = require('express');
const router = express.Router();
const { toggleSave, getSavedProperties, checkSaved } = require('../controllers/savedController');
const { protect } = require('../middleware/authMiddleware');

router.post('/toggle', protect, toggleSave);
router.get('/', protect, getSavedProperties);
router.get('/check/:propertyId', protect, checkSaved);

module.exports = router;
