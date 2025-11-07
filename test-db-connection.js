// Quick test script to verify MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;

// Check if env variables are set
console.log('\n📋 Checking environment variables:');
console.log('   DB_USER:', db_user ? '✅ Set' : '❌ Missing');
console.log('   DB_PASS:', db_pass ? '✅ Set (hidden)' : '❌ Missing');
console.log('   DB_NAME:', db_name ? '✅ Set' : '❌ Missing');

if (!db_user || !db_pass || !db_name) {
  console.error('\n❌ Missing required database credentials in .env file!');
  console.error('   Please make sure DB_USER, DB_PASS, and DB_NAME are all set.');
  process.exit(1);
}

// URL encode password for special characters
const encoded_pass = encodeURIComponent(db_pass);
const dbUri = `mongodb+srv://${db_user}:${encoded_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

console.log('\n🔗 Testing connection...');
console.log('   Cluster: cluster0.4z6c4.mongodb.net');
console.log('   Database:', db_name);
console.log('   Username:', db_user);
console.log('   Connection string:', dbUri.replace(encoded_pass, '***')); // Hide password in log

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000
})
.then(() => {
  console.log('\n✅ Connection successful!');
  console.log('   Your MongoDB Atlas credentials are correct.');
  mongoose.connection.close();
  process.exit(0);
})
.catch((error) => {
  console.error('\n❌ Connection failed!');
  console.error('   Error:', error.message);
  console.error('\n💡 Troubleshooting tips:');
  console.error('   1. Check your DB_USER and DB_PASS in .env file');
  console.error('   2. Verify the user exists in MongoDB Atlas → Database Access');
  console.error('   3. Make sure the password matches exactly');
  console.error('   4. Check your IP is whitelisted in MongoDB Atlas → Network Access');
  console.error('   5. Verify the cluster URL matches your actual cluster');
  process.exit(1);
});



require('dotenv').config();
const mongoose = require('mongoose');

const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;

// Check if env variables are set
console.log('\n📋 Checking environment variables:');
console.log('   DB_USER:', db_user ? '✅ Set' : '❌ Missing');
console.log('   DB_PASS:', db_pass ? '✅ Set (hidden)' : '❌ Missing');
console.log('   DB_NAME:', db_name ? '✅ Set' : '❌ Missing');

if (!db_user || !db_pass || !db_name) {
  console.error('\n❌ Missing required database credentials in .env file!');
  console.error('   Please make sure DB_USER, DB_PASS, and DB_NAME are all set.');
  process.exit(1);
}

// URL encode password for special characters
const encoded_pass = encodeURIComponent(db_pass);
const dbUri = `mongodb+srv://${db_user}:${encoded_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

console.log('\n🔗 Testing connection...');
console.log('   Cluster: cluster0.4z6c4.mongodb.net');
console.log('   Database:', db_name);
console.log('   Username:', db_user);
console.log('   Connection string:', dbUri.replace(encoded_pass, '***')); // Hide password in log

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000
})
.then(() => {
  console.log('\n✅ Connection successful!');
  console.log('   Your MongoDB Atlas credentials are correct.');
  mongoose.connection.close();
  process.exit(0);
})
.catch((error) => {
  console.error('\n❌ Connection failed!');
  console.error('   Error:', error.message);
  console.error('\n💡 Troubleshooting tips:');
  console.error('   1. Check your DB_USER and DB_PASS in .env file');
  console.error('   2. Verify the user exists in MongoDB Atlas → Database Access');
  console.error('   3. Make sure the password matches exactly');
  console.error('   4. Check your IP is whitelisted in MongoDB Atlas → Network Access');
  console.error('   5. Verify the cluster URL matches your actual cluster');
  process.exit(1);
});



require('dotenv').config();
const mongoose = require('mongoose');

const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;

// Check if env variables are set
console.log('\n📋 Checking environment variables:');
console.log('   DB_USER:', db_user ? '✅ Set' : '❌ Missing');
console.log('   DB_PASS:', db_pass ? '✅ Set (hidden)' : '❌ Missing');
console.log('   DB_NAME:', db_name ? '✅ Set' : '❌ Missing');

if (!db_user || !db_pass || !db_name) {
  console.error('\n❌ Missing required database credentials in .env file!');
  console.error('   Please make sure DB_USER, DB_PASS, and DB_NAME are all set.');
  process.exit(1);
}

// URL encode password for special characters
const encoded_pass = encodeURIComponent(db_pass);
const dbUri = `mongodb+srv://${db_user}:${encoded_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

console.log('\n🔗 Testing connection...');
console.log('   Cluster: cluster0.4z6c4.mongodb.net');
console.log('   Database:', db_name);
console.log('   Username:', db_user);
console.log('   Connection string:', dbUri.replace(encoded_pass, '***')); // Hide password in log

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000
})
.then(() => {
  console.log('\n✅ Connection successful!');
  console.log('   Your MongoDB Atlas credentials are correct.');
  mongoose.connection.close();
  process.exit(0);
})
.catch((error) => {
  console.error('\n❌ Connection failed!');
  console.error('   Error:', error.message);
  console.error('\n💡 Troubleshooting tips:');
  console.error('   1. Check your DB_USER and DB_PASS in .env file');
  console.error('   2. Verify the user exists in MongoDB Atlas → Database Access');
  console.error('   3. Make sure the password matches exactly');
  console.error('   4. Check your IP is whitelisted in MongoDB Atlas → Network Access');
  console.error('   5. Verify the cluster URL matches your actual cluster');
  process.exit(1);
});

































