// Check if admin exists and verify password
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const connectDB = async () => {
    try {
        const db_user = process.env.DB_USER;
        const db_pass = encodeURIComponent(process.env.DB_PASS);
        const db_name = process.env.DB_NAME;

        const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;
        await mongoose.connect(dbUri);
        console.log('✅ Connected to MongoDB\n');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const checkAdmin = async () => {
    try {
        await connectDB();

        // Find all users with admin role
        const admins = await User.find({ role: 'admin' });
        console.log(`Found ${admins.length} admin account(s):\n`);

        for (const admin of admins) {
            console.log(`Email: ${admin.email}`);
            console.log(`Name: ${admin.name}`);
            console.log(`Role: ${admin.role}`);
            console.log(`Active: ${admin.isActive}`);
            console.log(`Created: ${admin.createdAt}`);

            // Test password
            const testPassword = 'Admin123!';
            const isMatch = await bcrypt.compare(testPassword, admin.password);
            console.log(`Password "Admin123!" works: ${isMatch ? '✓ YES' : '✗ NO'}`);
            console.log('---\n');
        }

        // Also check the specific admin email
        const specificAdmin = await User.findOne({ email: 'admin@iremecorner.com' });
        if (!specificAdmin) {
            console.log('⚠️ admin@iremecorner.com does NOT exist in database!');
            console.log('Creating it now...\n');

            const hashedPassword = await bcrypt.hash('Admin123!', 10);
            const newAdmin = await User.create({
                name: 'Admin User',
                email: 'admin@iremecorner.com',
                password: hashedPassword,
                role: 'admin',
                isActive: true,
            });

            console.log('✅ Created admin@iremecorner.com');
            console.log('   Password: Admin123!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkAdmin();
