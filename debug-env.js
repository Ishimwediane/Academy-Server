// Debug script to check .env file location and content
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('\n🔍 Debugging .env file location...\n');

// Check current working directory
console.log('📍 Current working directory:', process.cwd());

// Check for .env in current directory
const currentDir = process.cwd();
const envPath = path.join(currentDir, '.env');
const envExists = fs.existsSync(envPath);

console.log('\n📁 Checking for .env file:');
console.log('   Expected location:', envPath);
console.log('   File exists:', envExists ? '✅ YES' : '❌ NO');

// If file exists, read it
if (envExists) {
  console.log('\n📄 .env file content:');
  console.log('   ' + '='.repeat(60));
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      console.log(`   Line ${index + 1}: ${line.trim()}`);
    });
    console.log('   ' + '='.repeat(60));
  } catch (error) {
    console.error('   ❌ Error reading file:', error.message);
  }
}

// Try to load .env
console.log('\n🔧 Attempting to load .env file...');
const result = dotenv.config();

if (result.error) {
  console.error('   ❌ Error loading .env:', result.error.message);
} else {
  console.log('   ✅ dotenv.config() completed');
  console.log('   Parsed path:', result.parsed ? Object.keys(result.parsed).length + ' variables found' : 'No variables parsed');
}

// Check environment variables
console.log('\n🔐 Environment variables after dotenv.config():');
console.log('   DB_USER:', process.env.DB_USER || '❌ NOT SET');
console.log('   DB_PASS:', process.env.DB_PASS ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('   DB_NAME:', process.env.DB_NAME || '❌ NOT SET');

// Check if variables are in process.env at all
console.log('\n📋 All DB_* variables in process.env:');
Object.keys(process.env)
  .filter(key => key.startsWith('DB_'))
  .forEach(key => {
    const value = key === 'DB_PASS' ? '***' : process.env[key];
    console.log(`   ${key}: ${value}`);
  });

// Check parent directory
const parentDir = path.join(currentDir, '..');
const parentEnvPath = path.join(parentDir, '.env');
const parentEnvExists = fs.existsSync(parentEnvPath);

console.log('\n📁 Checking parent directory for .env:');
console.log('   Parent directory:', parentDir);
console.log('   .env in parent:', parentEnvExists ? '✅ YES' : '❌ NO');

if (parentEnvExists && !envExists) {
  console.log('\n⚠️  WARNING: .env file found in parent directory, but not in backend!');
  console.log('   The .env file should be in:', currentDir);
}

console.log('\n');

