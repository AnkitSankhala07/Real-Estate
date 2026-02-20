const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    createProperty, getProperties, getPropertyById,
    updateProperty, deleteProperty, deletePropertyImage, getMyListings,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

// Use memory storage — files are passed as buffers to Cloudinary
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    },
});

// Public
router.get('/', getProperties);
router.get('/my-listings', protect, getMyListings);  // Must be before /:id
router.get('/:id', getPropertyById);

// Private
router.post('/', protect, upload.array('images', 5), createProperty);
router.put('/:id', protect, upload.array('images', 5), updateProperty);
router.delete('/:id/images', protect, deletePropertyImage);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
