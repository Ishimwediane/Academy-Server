// Reset admin password
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

const resetAdmin = async () => {
    try {
        await connectDB();

        // Find admin account
        let admin = await User.findOne({ email: 'admin@iremecorner.com' });

        const newPassword = 'Admin123!';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (admin) {
            // Update existing admin
            admin.password = hashedPassword;
            admin.role = 'admin';
            admin.isActive = true;
            await admin.save();
            console.log('✅ Admin password reset successfully!');
        } else {
            // Create new admin
            admin = await User.create({
                name: 'Admin User',
                email: 'admin@iremecorner.com',
                password: hashedPassword,
                role: 'admin',
                isActive: true,
            });
            console.log('✅ Admin account created successfully!');
        }

        console.log('\n🔑 Admin Credentials:');
        console.log('   Email: admin@iremecorner.com');
        console.log('   Password: Admin123!');
        console.log('\n✓ You can now log in with these credentials!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

resetAdmin();
