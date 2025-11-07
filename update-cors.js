// Quick script to update .env file with correct FRONTEND_URL
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');

// Update or add FRONTEND_URL
if (envContent.includes('FRONTEND_URL=')) {
  // Replace existing FRONTEND_URL
  envContent = envContent.replace(/FRONTEND_URL=.*/g, 'FRONTEND_URL=http://localhost:3000');
} else {
  // Add FRONTEND_URL if it doesn't exist
  envContent += '\nFRONTEND_URL=http://localhost:3000\n';
}

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('✅ Updated .env file: FRONTEND_URL=http://localhost:3000');
console.log('⚠️  Please restart your backend server for changes to take effect!');


const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');

// Update or add FRONTEND_URL
if (envContent.includes('FRONTEND_URL=')) {
  // Replace existing FRONTEND_URL
  envContent = envContent.replace(/FRONTEND_URL=.*/g, 'FRONTEND_URL=http://localhost:3000');
} else {
  // Add FRONTEND_URL if it doesn't exist
  envContent += '\nFRONTEND_URL=http://localhost:3000\n';
}

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('✅ Updated .env file: FRONTEND_URL=http://localhost:3000');
console.log('⚠️  Please restart your backend server for changes to take effect!');


const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');

// Update or add FRONTEND_URL
if (envContent.includes('FRONTEND_URL=')) {
  // Replace existing FRONTEND_URL
  envContent = envContent.replace(/FRONTEND_URL=.*/g, 'FRONTEND_URL=http://localhost:3000');
} else {
  // Add FRONTEND_URL if it doesn't exist
  envContent += '\nFRONTEND_URL=http://localhost:3000\n';
}

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('✅ Updated .env file: FRONTEND_URL=http://localhost:3000');
console.log('⚠️  Please restart your backend server for changes to take effect!');
































