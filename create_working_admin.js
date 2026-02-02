// Create working admin account
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

const createWorkingAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@iremecorner.com';
        const adminPassword = 'Admin123!';

        // Delete any existing admin with this email
        await User.deleteOne({ email: adminEmail });
        console.log('Cleared existing admin account\n');

        // Hash password properly
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create new admin
        const admin = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isActive: true,
        });

        console.log('✅ Admin account created successfully!\n');
        console.log('🔑 Admin Credentials:');
        console.log('   Email:', adminEmail);
        console.log('   Password:', adminPassword);

        // Verify password works
        const testMatch = await bcrypt.compare(adminPassword, admin.password);
        console.log('\n✓ Password verification:', testMatch ? 'PASSED ✓' : 'FAILED ✗');

        if (testMatch) {
            console.log('\n🎉 You can now log in with these credentials!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

createWorkingAdmin();
