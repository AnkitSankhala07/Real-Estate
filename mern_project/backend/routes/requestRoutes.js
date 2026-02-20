const express = require('express');
const router = express.Router();
const { sendRequest, getReceivedRequests, getSentRequests, deleteRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendRequest);
router.get('/received', protect, getReceivedRequests);
router.get('/sent', protect, getSentRequests);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
