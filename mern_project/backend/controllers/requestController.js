const Request = require('../models/Request');
const Property = require('../models/Property');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Send an enquiry for a property (send request to property owner)
// @route   POST /api/requests
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const sendRequest = async (req, res) => {
    try {
        const { propertyId } = req.body;
        if (!propertyId) return res.status(400).json({ message: 'propertyId is required' });

        const property = await Property.findById(propertyId).populate('user', '_id name');
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const ownerId = property.user._id;

        // Can't send enquiry on your own property
        if (ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot send an enquiry on your own property' });
        }

        // Check if already sent
        const existing = await Request.findOne({
            property: propertyId,
            sender: req.user._id,
        });

        if (existing) {
            return res.status(400).json({ message: 'Enquiry already sent for this property' });
        }

        const request = await Request.create({
            property: propertyId,
            sender: req.user._id,
            receiver: ownerId,
        });

        await request.populate([
            { path: 'property', select: 'propertyName address price images' },
            { path: 'sender', select: 'name email number' },
        ]);

        res.status(201).json({ message: 'Enquiry sent successfully', request });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all enquiries received by the logged-in user (as property owner)
// @route   GET /api/requests/received
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getReceivedRequests = async (req, res) => {
    try {
        const requests = await Request.find({ receiver: req.user._id })
            .populate('property', 'propertyName address price images offer type')
            .populate('sender', 'name email number')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all enquiries sent by the logged-in user
// @route   GET /api/requests/sent
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getSentRequests = async (req, res) => {
    try {
        const requests = await Request.find({ sender: req.user._id })
            .populate('property', 'propertyName address price images offer type')
            .populate('receiver', 'name email number')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete / retract an enquiry
// @route   DELETE /api/requests/:id
// @access  Private (sender only)
// ─────────────────────────────────────────────────────────────────────────────
const deleteRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Enquiry not found' });

        if (request.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await request.deleteOne();
        res.json({ message: 'Enquiry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendRequest, getReceivedRequests, getSentRequests, deleteRequest };
