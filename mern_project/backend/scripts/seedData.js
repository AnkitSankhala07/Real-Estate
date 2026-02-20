/**
 * Sample Data Seeder — Akxton Real Estate Portal
 * ─────────────────────────────────────────────────────────────
 * Usage: npm run seed:data          (from backend folder)
 *        or: npm run seed --prefix backend  (from root)
 *
 * Seeds:
 *  • 5 Users
 *  • 20 Properties (mix of types, offers, cities)
 *  • 6 Saved entries
 *  • 4 Requests
 *  • 5 Contact Messages
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Property = require('../models/Property');
const Saved = require('../models/Saved');
const Request = require('../models/Request');
const Message = require('../models/Message');

// ── Helpers ──────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ── Sample image URLs (publicly accessible real-estate photos) -
const IMG = {
    flat: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    house: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    ],
    villa: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    ],
    shop: [
        'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    ],
    plot: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800',
    ],
    pg: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    ],
};

// ── Raw User Data ─────────────────────────────────────────────
const userData = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', number: '9876543210', password: 'password123' },
    { name: 'Priya Patel', email: 'priya@example.com', number: '9876543211', password: 'password123' },
    { name: 'Amit Verma', email: 'amit@example.com', number: '9876543212', password: 'password123' },
    { name: 'Sneha Gupta', email: 'sneha@example.com', number: '9876543213', password: 'password123' },
    { name: 'Vikram Singh', email: 'vikram@example.com', number: '9876543214', password: 'password123' },
];

// ── Raw Property Data ─────────────────────────────────────────
const buildProperties = (users) => [
    // ── FLATS — RENT ──
    {
        user: users[0]._id,
        propertyName: 'Sunrise 2BHK Apartment',
        address: 'Andheri West, Mumbai, Maharashtra',
        price: 32000,
        type: 'flat', offer: 'rent', status: 'ready to move', furnished: 'furnished',
        bhk: 2, bedroom: 2, bathroom: 2, balcony: 1, carpet: 850, age: 3,
        totalFloors: 12, roomFloor: 7, loan: 'not available', deposit: 64000,
        description: 'A beautiful fully-furnished 2BHK apartment in the heart of Andheri West with stunning city views. Walking distance from metro station and malls.',
        images: IMG.flat,
        amenities: { lift: true, securityGuard: true, powerBackup: true, parkingArea: true, gym: true, waterSupply: true },
    },
    {
        user: users[1]._id,
        propertyName: 'Lakeview Studio Apartment',
        address: 'Koramangala, Bengaluru, Karnataka',
        price: 18000,
        type: 'flat', offer: 'rent', status: 'ready to move', furnished: 'semi-furnished',
        bhk: 1, bedroom: 1, bathroom: 1, balcony: 1, carpet: 450, age: 2,
        totalFloors: 8, roomFloor: 4, loan: 'not available', deposit: 36000,
        description: 'Compact and elegant studio apartment perfect for IT professionals. Close to major tech parks and with fast Wi-Fi infrastructure in the building.',
        images: IMG.flat,
        amenities: { lift: true, securityGuard: true, waterSupply: true, powerBackup: true },
    },
    {
        user: users[2]._id,
        propertyName: 'Green Valley 3BHK',
        address: 'Banjara Hills, Hyderabad, Telangana',
        price: 45000,
        type: 'flat', offer: 'rent', status: 'ready to move', furnished: 'furnished',
        bhk: 3, bedroom: 3, bathroom: 3, balcony: 2, carpet: 1350, age: 1,
        totalFloors: 20, roomFloor: 14, loan: 'not available', deposit: 90000,
        description: 'Spacious 3BHK luxury apartment in premium Banjara Hills locality. Modular kitchen, wooden flooring and premium fixtures throughout.',
        images: IMG.flat,
        amenities: { lift: true, securityGuard: true, garden: true, gym: true, parkingArea: true, powerBackup: true, waterSupply: true },
    },

    // ── FLATS — SALE ──
    {
        user: users[0]._id,
        propertyName: 'Skyline Heights 4BHK Penthouse',
        address: 'Powai, Mumbai, Maharashtra',
        price: 18500000,
        type: 'flat', offer: 'sale', status: 'ready to move', furnished: 'semi-furnished',
        bhk: 4, bedroom: 4, bathroom: 4, balcony: 3, carpet: 2200, age: 0,
        totalFloors: 30, roomFloor: 30, loan: 'available', deposit: 0,
        description: 'Brand new penthouse with panoramic lake views in Powai. Italian marble flooring, modular kitchen, and private terrace. Premium amenities.',
        images: IMG.flat,
        amenities: { lift: true, securityGuard: true, gym: true, garden: true, playGround: true, parkingArea: true, powerBackup: true, waterSupply: true, shoppingMall: true },
    },
    {
        user: users[3]._id,
        propertyName: 'Urban Nest 2BHK',
        address: 'Whitefield, Bengaluru, Karnataka',
        price: 7200000,
        type: 'flat', offer: 'sale', status: 'under construction', furnished: 'unfurnished',
        bhk: 2, bedroom: 2, bathroom: 2, balcony: 1, carpet: 920, age: 0,
        totalFloors: 15, roomFloor: 9, loan: 'available', deposit: 0,
        description: 'Under-construction 2BHK in rapidly growing Whitefield tech corridor. RERA registered. Possession in Dec 2025. Great investment opportunity.',
        images: IMG.flat,
        amenities: { lift: true, securityGuard: true, parkingArea: true, powerBackup: true, waterSupply: true },
    },

    // ── HOUSES ──
    {
        user: users[1]._id,
        propertyName: 'Garden Bungalow with Private Pool',
        address: 'Jubilee Hills, Hyderabad, Telangana',
        price: 35000000,
        type: 'house', offer: 'sale', status: 'ready to move', furnished: 'furnished',
        bhk: 5, bedroom: 5, bathroom: 5, balcony: 4, carpet: 4000, age: 5,
        totalFloors: 2, roomFloor: 1, loan: 'available', deposit: 0,
        description: 'Magnificent independent bungalow with a private swimming pool and lush garden. Designer interiors, home theatre, and smart home automation.',
        images: IMG.house,
        amenities: { securityGuard: true, garden: true, gym: true, parkingArea: true, powerBackup: true, waterSupply: true, hospital: true, school: true },
    },
    {
        user: users[4]._id,
        propertyName: 'Cozy 3BHK Independent House',
        address: 'Aundh, Pune, Maharashtra',
        price: 12500000,
        type: 'house', offer: 'sale', status: 'ready to move', furnished: 'semi-furnished',
        bhk: 3, bedroom: 3, bathroom: 3, balcony: 2, carpet: 1800, age: 8,
        totalFloors: 2, roomFloor: 1, loan: 'available', deposit: 0,
        description: 'Well-maintained independent house in a quiet residential colony. Spacious rooms, large garden, and covered parking. Walking distance to schools and markets.',
        images: IMG.house,
        amenities: { securityGuard: true, garden: true, parkingArea: true, waterSupply: true, school: true, marketArea: true },
    },
    {
        user: users[2]._id,
        propertyName: 'Heritage 4BHK Bungalow',
        address: 'Civil Lines, Jaipur, Rajasthan',
        price: 9800000,
        type: 'house', offer: 'resale', status: 'ready to move', furnished: 'unfurnished',
        bhk: 4, bedroom: 4, bathroom: 3, balcony: 2, carpet: 2500, age: 15,
        totalFloors: 2, roomFloor: 2, loan: 'available', deposit: 0,
        description: 'Classic heritage-style bungalow with spacious rooms and beautiful courtyard. Ready for possession. Ideal for large families.',
        images: IMG.house,
        amenities: { securityGuard: true, parkingArea: true, waterSupply: true, garden: true, marketArea: true },
    },
    {
        user: users[3]._id,
        propertyName: 'Modern Row House',
        address: 'Gachibowli, Hyderabad, Telangana',
        price: 8900000,
        type: 'house', offer: 'sale', status: 'new launch', furnished: 'unfurnished',
        bhk: 3, bedroom: 3, bathroom: 3, balcony: 1, carpet: 1600, age: 0,
        totalFloors: 2, roomFloor: 1, loan: 'available', deposit: 0,
        description: 'Brand new row house in a gated community near Gachibowli tech hub. Contemporary design with open floor plan. Pre-launch price available.',
        images: IMG.house,
        amenities: { securityGuard: true, gym: true, playGround: true, parkingArea: true, powerBackup: true, waterSupply: true, school: true },
    },

    // ── VILLAS ──
    {
        user: users[0]._id,
        propertyName: 'Palm Boulevard Luxury Villa',
        address: 'Sarjapur Road, Bengaluru, Karnataka',
        price: 42000000,
        type: 'villa', offer: 'sale', status: 'ready to move', furnished: 'furnished',
        bhk: 5, bedroom: 5, bathroom: 6, balcony: 4, carpet: 5000, age: 2,
        totalFloors: 3, roomFloor: 1, loan: 'available', deposit: 0,
        description: 'Ultra-luxury 5BHK villa with private pool, home cinema, and smart home automation. Set in a premium gated villa community with world-class amenities.',
        images: IMG.villa,
        amenities: { lift: true, securityGuard: true, gym: true, garden: true, playGround: true, parkingArea: true, powerBackup: true, waterSupply: true, shoppingMall: true, hospital: true },
    },
    {
        user: users[4]._id,
        propertyName: 'Serene Hills Villa',
        address: 'Lonavala, Pune, Maharashtra',
        price: 25000000,
        type: 'villa', offer: 'sale', status: 'ready to move', furnished: 'semi-furnished',
        bhk: 4, bedroom: 4, bathroom: 4, balcony: 6, carpet: 3500, age: 3,
        totalFloors: 2, roomFloor: 1, loan: 'available', deposit: 0,
        description: 'Breathtaking villa in the scenic hills of Lonavala. Perfect weekend home with valley views, large outdoor deck and barbecue area.',
        images: IMG.villa,
        amenities: { securityGuard: true, garden: true, parkingArea: true, powerBackup: true, waterSupply: true },
    },

    // ── PLOTS ──
    {
        user: users[1]._id,
        propertyName: 'Prime Commercial Plot — NH48 Frontage',
        address: 'Dwarka Expressway, Gurugram, Haryana',
        price: 15000000,
        type: 'plot', offer: 'sale', status: 'ready to move', furnished: 'unfurnished',
        bhk: 0, bedroom: 0, bathroom: 0, balcony: 0, carpet: 2400, age: 0,
        loan: 'available', deposit: 0,
        description: 'Excellent commercial plot on the main service road with NH48 frontage. Clear title, demarcated boundaries and all approvals in place.',
        images: IMG.plot,
        amenities: { waterSupply: true, marketArea: true },
    },
    {
        user: users[2]._id,
        propertyName: 'Residential Layout Plot',
        address: 'Devanahalli, Bengaluru, Karnataka',
        price: 4500000,
        type: 'plot', offer: 'resale', status: 'ready to move', furnished: 'unfurnished',
        bhk: 0, bedroom: 0, bathroom: 0, balcony: 0, carpet: 1200, age: 0,
        loan: 'available', deposit: 0,
        description: 'BMRDA approved residential layout plot near international airport. All utilities available at site boundary. Rapidly appreciating locality.',
        images: IMG.plot,
        amenities: { waterSupply: true },
    },

    // ── SHOPS ──
    {
        user: users[3]._id,
        propertyName: 'Ground Floor Shop in High-Street Mall',
        address: 'Connaught Place, New Delhi, Delhi',
        price: 180000,
        type: 'shop', offer: 'rent', status: 'ready to move', furnished: 'semi-furnished',
        bhk: 0, bedroom: 0, bathroom: 1, balcony: 0, carpet: 350, age: 10,
        totalFloors: 5, roomFloor: 0, loan: 'not available', deposit: 360000,
        description: 'Prime retail space on ground floor of a bustling high-street mall in CP. Glass façade, ample footfall, power backup and 24/7 security.',
        images: IMG.shop,
        amenities: { lift: true, securityGuard: true, powerBackup: true, waterSupply: true, parkingArea: true, shoppingMall: true },
    },
    {
        user: users[0]._id,
        propertyName: 'Commercial Shop — IT Park Complex',
        address: 'Hinjewadi Phase 2, Pune, Maharashtra',
        price: 7500000,
        type: 'shop', offer: 'sale', status: 'ready to move', furnished: 'unfurnished',
        bhk: 0, bedroom: 0, bathroom: 1, balcony: 0, carpet: 480, age: 4,
        totalFloors: 8, roomFloor: 0, loan: 'available', deposit: 0,
        description: 'Well-located commercial shop facing the main entrance of a large IT park. Ideal for cafeteria, pharmacy or convenience store. High footfall guaranteed.',
        images: IMG.shop,
        amenities: { lift: true, securityGuard: true, powerBackup: true, waterSupply: true, shoppingMall: true },
    },

    // ── PG ──
    {
        user: users[4]._id,
        propertyName: 'Comfort PG for IT Professionals',
        address: 'Electronic City Phase 1, Bengaluru, Karnataka',
        price: 9500,
        type: 'pg', offer: 'rent', status: 'ready to move', furnished: 'furnished',
        bhk: 0, bedroom: 1, bathroom: 1, balcony: 0, carpet: 200, age: 5,
        totalFloors: 4, roomFloor: 2, loan: 'not available', deposit: 19000,
        description: 'Comfortable PG accommodation with AC rooms, attached bath and home-cooked meals. Free Wi-Fi, laundry and housekeeping. Walking distance to Infosys campus.',
        images: IMG.pg,
        amenities: { securityGuard: true, waterSupply: true, powerBackup: true, lift: false },
    },
    {
        user: users[1]._id,
        propertyName: 'Premium Girls PG',
        address: 'Karol Bagh, New Delhi, Delhi',
        price: 11000,
        type: 'pg', offer: 'rent', status: 'ready to move', furnished: 'furnished',
        bhk: 0, bedroom: 1, bathroom: 1, balcony: 0, carpet: 180, age: 2,
        totalFloors: 3, roomFloor: 1, loan: 'not available', deposit: 22000,
        description: 'Secure and well-maintained girls-only PG near Karol Bagh metro. AC rooms, 24/7 Wi-Fi, CCTV, mess facility and biometric entry.',
        images: IMG.pg,
        amenities: { securityGuard: true, waterSupply: true, powerBackup: true, marketArea: true },
    },

    // ── RESALE FLAT ──
    {
        user: users[2]._id,
        propertyName: 'Ready-to-Move Resale 3BHK',
        address: 'Sector 62, Noida, Uttar Pradesh',
        price: 8750000,
        type: 'flat', offer: 'resale', status: 'ready to move', furnished: 'semi-furnished',
        bhk: 3, bedroom: 3, bathroom: 2, balcony: 2, carpet: 1250, age: 7,
        totalFloors: 18, roomFloor: 11, loan: 'available', deposit: 0,
        description: 'Well-maintained 3BHK in a prime sector of Noida with great connectivity to Delhi and Noida Expressway. Modular kitchen, covered parking included.',
        images: IMG.flat,
        amenities: { lift: true, securityGuard: true, playGround: true, garden: true, parkingArea: true, powerBackup: true, waterSupply: true },
    },
];

// ── Messages Data ─────────────────────────────────────────────
const messageData = [
    {
        name: 'Ravi Kumar',
        email: 'ravi.kumar@email.com',
        number: '9811223344',
        message: 'I am interested in renting a 2BHK flat in Bangalore near Koramangala. Please send me available listings and pricing details.',
    },
    {
        name: 'Meera Nair',
        email: 'meera.nair@email.com',
        number: '9922334455',
        message: 'Looking to buy a 3BHK flat in Mumbai within a budget of 1.5 Crore. Can you help me find options in Powai or Thane?',
    },
    {
        name: 'Arjun Reddy',
        email: 'arjun.reddy@email.com',
        number: '9933445566',
        message: 'We are looking for a commercial shop on rent in Hyderabad for a café business. Preferred location is Banjara Hills or Jubilee Hills.',
    },
    {
        name: 'Pooja Mehta',
        email: 'pooja.mehta@email.com',
        number: '9944556677',
        message: 'Interested in the Palm Boulevard Villa listing. Can we schedule a site visit this weekend? Please confirm availability.',
    },
    {
        name: 'Suresh Babu',
        email: 'suresh.babu@email.com',
        number: '9955667788',
        message: 'I want to list my property for sale. It is a 4BHK house in Pune, Aundh area. How can I post it on your platform?',
    },
];

// ── Main Seed Function ────────────────────────────────────────
const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('\n✅ Connected to MongoDB\n');

        // ── Wipe existing sample data ──────────────────────────
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Property.deleteMany({}),
            Saved.deleteMany({}),
            Request.deleteMany({}),
            Message.deleteMany({}),
        ]);

        // ── Create Users ───────────────────────────────────────
        console.log('👤 Creating users...');
        const users = await User.create(userData);
        console.log(`   ✔ ${users.length} users created`);

        // ── Create Properties ──────────────────────────────────
        console.log('🏠 Creating properties...');
        const properties = await Property.create(buildProperties(users));
        console.log(`   ✔ ${properties.length} properties created`);

        // ── Create Saved entries ───────────────────────────────
        console.log('❤️  Creating saved entries...');
        const savedEntries = [
            { user: users[1]._id, property: properties[0]._id },
            { user: users[1]._id, property: properties[3]._id },
            { user: users[2]._id, property: properties[5]._id },
            { user: users[3]._id, property: properties[9]._id },
            { user: users[4]._id, property: properties[1]._id },
            { user: users[0]._id, property: properties[7]._id },
        ];
        await Saved.create(savedEntries);
        console.log(`   ✔ ${savedEntries.length} saved entries created`);

        // ── Create Requests ────────────────────────────────────
        console.log('📨 Creating contact requests...');
        const requests = [
            { property: properties[0]._id, sender: users[1]._id, receiver: users[0]._id },
            { property: properties[5]._id, sender: users[2]._id, receiver: users[1]._id },
            { property: properties[9]._id, sender: users[3]._id, receiver: users[0]._id },
            { property: properties[3]._id, sender: users[4]._id, receiver: users[0]._id },
        ];
        await Request.create(requests);
        console.log(`   ✔ ${requests.length} requests created`);

        // ── Create Messages ────────────────────────────────────
        console.log('💬 Creating contact messages...');
        await Message.create(messageData);
        console.log(`   ✔ ${messageData.length} messages created`);

        // ── Summary ────────────────────────────────────────────
        console.log('\n🎉 Sample data seeded successfully!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Database Summary:');
        console.log(`   Users      : ${users.length}`);
        console.log(`   Properties : ${properties.length}`);
        console.log(`   Saved      : ${savedEntries.length}`);
        console.log(`   Requests   : ${requests.length}`);
        console.log(`   Messages   : ${messageData.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🔐 Test Login Credentials:');
        userData.forEach(u => {
            console.log(`   📧 ${u.email.padEnd(28)} 🔑 ${u.password}`);
        });
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seed error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

seed();
