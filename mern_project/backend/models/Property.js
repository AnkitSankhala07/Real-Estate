const mongoose = require('mongoose');

const propertySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        propertyName: { type: String, required: true, trim: true, maxlength: 100 },
        address: { type: String, required: true, trim: true, maxlength: 200 },
        price: { type: Number, required: true, min: 0 },
        type: {
            type: String,
            enum: ['flat', 'house', 'shop', 'plot', 'villa', 'pg'],
            required: true,
        },
        offer: {
            type: String,
            enum: ['sale', 'resale', 'rent'],
            required: true,
        },
        status: {
            type: String,
            enum: ['ready to move', 'under construction', 'new launch'],
            required: true,
        },
        furnished: {
            type: String,
            enum: ['furnished', 'semi-furnished', 'unfurnished'],
            required: true,
        },
        bhk: { type: Number, min: 0, max: 20 },
        deposit: { type: Number, min: 0, default: 0 },
        bedroom: { type: Number, min: 0, max: 20 },
        bathroom: { type: Number, min: 0, max: 20 },
        balcony: { type: Number, min: 0, max: 20, default: 0 },
        carpet: { type: Number, required: true, min: 1 },
        age: { type: Number, min: 0, max: 99, default: 0 },
        totalFloors: { type: Number, min: 0, max: 200 },
        roomFloor: { type: Number, min: 0, max: 200 },
        loan: {
            type: String,
            enum: ['available', 'not available'],
            default: 'not available',
        },
        description: { type: String, required: true, maxlength: 2000 },

        // Up to 5 image URLs (Cloudinary)
        images: {
            type: [String],
            validate: [arr => arr.length <= 5, 'Maximum 5 images allowed'],
            default: [],
        },

        // Amenities — direct mirror of PHP schema
        amenities: {
            lift: { type: Boolean, default: false },
            securityGuard: { type: Boolean, default: false },
            playGround: { type: Boolean, default: false },
            garden: { type: Boolean, default: false },
            waterSupply: { type: Boolean, default: false },
            powerBackup: { type: Boolean, default: false },
            parkingArea: { type: Boolean, default: false },
            gym: { type: Boolean, default: false },
            shoppingMall: { type: Boolean, default: false },
            hospital: { type: Boolean, default: false },
            school: { type: Boolean, default: false },
            marketArea: { type: Boolean, default: false },
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast location/name search
propertySchema.index({ address: 'text', propertyName: 'text' });
// Index for common filter combinations
propertySchema.index({ offer: 1, type: 1, price: 1 });
propertySchema.index({ user: 1 });

module.exports = mongoose.model('Property', propertySchema);
