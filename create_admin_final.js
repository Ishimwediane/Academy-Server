// Create admin with plain password (let model hash it)
require('dotenv').config();
const mongoose = require('mongoose');
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

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@iremecorner.com';
        const adminPassword = 'Admin123!';

        // Delete any existing admin with this email
        await User.deleteOne({ email: adminEmail });
        console.log('Cleared existing admin account\n');

        // Create new admin - let the model's pre-save hook hash the password
        const admin = new User({
            name: 'Admin User',
            email: adminEmail,
            password: adminPassword, // Plain password - will be hashed by pre-save hook
            role: 'admin',
            isActive: true,
        });

        await admin.save();

        console.log('✅ Admin account created successfully!\n');
        console.log('🔑 Admin Credentials:');
        console.log('   Email:', adminEmail);
        console.log('   Password:', adminPassword);

        // Verify password works by fetching user and testing
        const testUser = await User.findOne({ email: adminEmail }).select('+password');
        const testMatch = await testUser.comparePassword(adminPassword);
        console.log('\n✓ Password verification:', testMatch ? 'PASSED ✓' : 'FAILED ✗');

        if (testMatch) {
            console.log('\n🎉 Login should now work!');
            console.log('\nTry logging in at: http://localhost:3000');
        } else {
            console.log('\n❌ Something is still wrong with password hashing');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
