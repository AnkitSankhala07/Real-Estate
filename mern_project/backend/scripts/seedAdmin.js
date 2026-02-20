const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const existing = await Admin.findOne({ name: 'admin' });
        if (existing) {
            console.log('ℹ️  Admin already exists. Skipping.');
            process.exit(0);
        }

        const admin = await Admin.create({
            name: 'admin',
            password: 'admin123',
        });

        console.log('\n🎉 Admin created successfully!');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('\n⚠️  Please change the password in production!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seed();
