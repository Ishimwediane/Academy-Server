const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const db_user = process.env.DB_USER;
const db_pass = encodeURIComponent(process.env.DB_PASS); // URL encode password for special characters
const db_name = process.env.DB_NAME;

// Validate required environment variables
if (!db_user || !db_pass || !db_name) {
  console.error('❌ Missing required database credentials in .env file:');
  console.error('   - DB_USER:', db_user ? '✅ Set' : '❌ Missing');
  console.error('   - DB_PASS:', db_pass ? '✅ Set' : '❌ Missing');
  console.error('   - DB_NAME:', db_name ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000 // Optional: 10 seconds timeout
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1); // Exit if DB connection fails
  }
};

module.exports = connectDB;

