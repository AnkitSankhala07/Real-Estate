const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
    // Original PHP uses sha1, but we should upgrade to bcrypt. 
    // For migration purposes, if we want to keep existing passwords, we'd need a different strategy.
    // But here we are building a fresh MERN app.
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
