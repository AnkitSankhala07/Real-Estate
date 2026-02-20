const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create new property listing
// @route   POST /api/properties
// @access  Private (requires login)
// ─────────────────────────────────────────────────────────────────────────────
const createProperty = async (req, res) => {
    try {
        const {
            propertyName, address, price, type, offer, status, furnished,
            bhk, deposit, bedroom, bathroom, balcony, carpet, age,
            totalFloors, roomFloor, loan, description,
            // Amenities (sent as boolean strings or booleans)
            lift, securityGuard, playGround, garden, waterSupply,
            powerBackup, parkingArea, gym, shoppingMall, hospital, school, marketArea,
        } = req.body;

        // Validate required fields
        if (!propertyName || !address || !price || !type || !offer || !status || !furnished || !carpet || !description) {
            return res.status(400).json({ message: 'Required fields missing: propertyName, address, price, type, offer, status, furnished, carpet, description' });
        }

        // Handle image uploads
        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            // Upload each file to Cloudinary
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'akxton/properties', resource_type: 'image' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    stream.end(file.buffer);
                });
            });
            imageUrls = await Promise.all(uploadPromises);
        }

        const property = await Property.create({
            user: req.user._id,
            propertyName,
            address,
            price: Number(price),
            type,
            offer,
            status,
            furnished,
            bhk: bhk ? Number(bhk) : undefined,
            deposit: deposit ? Number(deposit) : 0,
            bedroom: bedroom ? Number(bedroom) : undefined,
            bathroom: bathroom ? Number(bathroom) : undefined,
            balcony: balcony ? Number(balcony) : 0,
            carpet: Number(carpet),
            age: age ? Number(age) : 0,
            totalFloors: totalFloors ? Number(totalFloors) : undefined,
            roomFloor: roomFloor ? Number(roomFloor) : undefined,
            loan: loan || 'not available',
            description,
            images: imageUrls,
            amenities: {
                lift: lift === 'true' || lift === true,
                securityGuard: securityGuard === 'true' || securityGuard === true,
                playGround: playGround === 'true' || playGround === true,
                garden: garden === 'true' || garden === true,
                waterSupply: waterSupply === 'true' || waterSupply === true,
                powerBackup: powerBackup === 'true' || powerBackup === true,
                parkingArea: parkingArea === 'true' || parkingArea === true,
                gym: gym === 'true' || gym === true,
                shoppingMall: shoppingMall === 'true' || shoppingMall === true,
                hospital: hospital === 'true' || hospital === true,
                school: school === 'true' || school === true,
                marketArea: marketArea === 'true' || marketArea === true,
            },
        });

        await property.populate('user', 'name email number');
        res.status(201).json(property);

    } catch (error) {
        console.error('createProperty error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all properties with filtering, search, and pagination
// @route   GET /api/properties
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getProperties = async (req, res) => {
    try {
        const {
            keyword, location, type, offer, status, furnished, bhk,
            minPrice, maxPrice, loan, page = 1, pageSize = 12, sort = 'newest',
        } = req.query;

        const filter = {};

        // Keyword / location search (address or property name)
        const searchTerm = keyword || location;
        if (searchTerm) {
            filter.$or = [
                { address: { $regex: searchTerm, $options: 'i' } },
                { propertyName: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        if (type) filter.type = type;
        if (offer) filter.offer = offer;
        if (status) filter.status = status;
        if (furnished) filter.furnished = furnished;
        if (bhk) filter.bhk = Number(bhk);
        if (loan) filter.loan = loan;

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Sorting
        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            price_asc: { price: 1 },
            price_desc: { price: -1 },
        };
        const sortOption = sortMap[sort] || sortMap.newest;

        // Pagination
        const skip = (Number(page) - 1) * Number(pageSize);

        const [properties, total] = await Promise.all([
            Property.find(filter)
                .populate('user', 'name email number')
                .sort(sortOption)
                .skip(skip)
                .limit(Number(pageSize)),
            Property.countDocuments(filter),
        ]);

        res.json({
            properties,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(pageSize)),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('user', 'name email number');

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check ownership
        if (property.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized — you can only update your own properties' });
        }

        const {
            propertyName, address, price, type, offer, status, furnished,
            bhk, deposit, bedroom, bathroom, balcony, carpet, age,
            totalFloors, roomFloor, loan, description,
            lift, securityGuard, playGround, garden, waterSupply,
            powerBackup, parkingArea, gym, shoppingMall, hospital, school, marketArea,
        } = req.body;

        // Handle new image uploads
        let imageUrls = property.images; // keep existing ones

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'akxton/properties', resource_type: 'image' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    stream.end(file.buffer);
                });
            });
            const newUrls = await Promise.all(uploadPromises);
            imageUrls = [...imageUrls, ...newUrls]; // append new images
        }

        // Update fields
        property.propertyName = propertyName || property.propertyName;
        property.address = address || property.address;
        property.price = price ? Number(price) : property.price;
        property.type = type || property.type;
        property.offer = offer || property.offer;
        property.status = status || property.status;
        property.furnished = furnished || property.furnished;
        property.bhk = bhk ? Number(bhk) : property.bhk;
        property.deposit = deposit !== undefined ? Number(deposit) : property.deposit;
        property.bedroom = bedroom ? Number(bedroom) : property.bedroom;
        property.bathroom = bathroom ? Number(bathroom) : property.bathroom;
        property.balcony = balcony !== undefined ? Number(balcony) : property.balcony;
        property.carpet = carpet ? Number(carpet) : property.carpet;
        property.age = age !== undefined ? Number(age) : property.age;
        property.totalFloors = totalFloors ? Number(totalFloors) : property.totalFloors;
        property.roomFloor = roomFloor ? Number(roomFloor) : property.roomFloor;
        property.loan = loan || property.loan;
        property.description = description || property.description;
        property.images = imageUrls;

        property.amenities = {
            lift: lift === 'true' || lift === true,
            securityGuard: securityGuard === 'true' || securityGuard === true,
            playGround: playGround === 'true' || playGround === true,
            garden: garden === 'true' || garden === true,
            waterSupply: waterSupply === 'true' || waterSupply === true,
            powerBackup: powerBackup === 'true' || powerBackup === true,
            parkingArea: parkingArea === 'true' || parkingArea === true,
            gym: gym === 'true' || gym === true,
            shoppingMall: shoppingMall === 'true' || shoppingMall === true,
            hospital: hospital === 'true' || hospital === true,
            school: school === 'true' || school === true,
            marketArea: marketArea === 'true' || marketArea === true,
        };

        const updated = await property.save();
        await updated.populate('user', 'name email number');
        res.json(updated);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a specific image from a property
// @route   DELETE /api/properties/:id/images
// @access  Private (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const deletePropertyImage = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' });

        // Remove from Cloudinary if it's a cloudinary URL
        if (imageUrl.includes('cloudinary')) {
            const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        property.images = property.images.filter(img => img !== imageUrl);
        await property.save();

        res.json({ message: 'Image deleted', images: property.images });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Only owner or admin can delete
        if (property.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized — you can only delete your own properties' });
        }

        // Delete images from Cloudinary
        const deletePromises = property.images
            .filter(url => url.includes('cloudinary'))
            .map(url => {
                const publicId = url.split('/').slice(-2).join('/').split('.')[0];
                return cloudinary.uploader.destroy(publicId).catch(() => { });
            });
        await Promise.all(deletePromises);

        await property.deleteOne();
        res.json({ message: 'Property listing deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get logged-in user's own property listings
// @route   GET /api/properties/my-listings
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getMyListings = async (req, res) => {
    try {
        const properties = await Property.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    deletePropertyImage,
    getMyListings,
};
