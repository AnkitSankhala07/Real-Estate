const Saved = require('../models/Saved');
const Property = require('../models/Property');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Toggle save / unsave a property
// @route   POST /api/saved/toggle
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const toggleSave = async (req, res) => {
    try {
        const { propertyId } = req.body;
        if (!propertyId) return res.status(400).json({ message: 'propertyId is required' });

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const existing = await Saved.findOne({ property: propertyId, user: req.user._id });

        if (existing) {
            await existing.deleteOne();
            return res.json({ message: 'Property removed from saved', saved: false });
        }

        await Saved.create({ property: propertyId, user: req.user._id });
        res.status(201).json({ message: 'Property saved successfully', saved: true });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all saved properties for the logged-in user
// @route   GET /api/saved
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getSavedProperties = async (req, res) => {
    try {
        const saved = await Saved.find({ user: req.user._id })
            .populate({
                path: 'property',
                populate: { path: 'user', select: 'name email number' },
            })
            .sort({ createdAt: -1 });

        // Filter out any orphaned saves (property deleted)
        const validSaved = saved.filter(s => s.property !== null);
        res.json(validSaved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Check if a property is saved by the current user
// @route   GET /api/saved/check/:propertyId
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const checkSaved = async (req, res) => {
    try {
        const existing = await Saved.findOne({
            property: req.params.propertyId,
            user: req.user._id,
        });
        res.json({ saved: !!existing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { toggleSave, getSavedProperties, checkSaved };
