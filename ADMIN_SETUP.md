# Admin User Setup Guide

## Quick Setup - Create Admin User

### Option 1: Using Script (Recommended)

Run the admin creation script:

```bash
cd backend
node create-admin.js
```

This will create an admin user with:
- **Email:** `admin@iremecorner.com`
- **Password:** `Admin123!`
- **Role:** Admin

**⚠️ IMPORTANT:** Change the password after first login!

### Option 2: Update Existing User to Admin

If you already have a user account and want to make it admin:

#### Using MongoDB Atlas (Web Interface)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Go to **Database** → **Browse Collections**
4. Select the `Academy` database
5. Open the `users` collection
6. Find your user document (by email)
7. Click **Edit Document**
8. Change `role` field from `"student"` to `"admin"`
9. Click **Update**

#### Using MongoDB Shell

1. Connect to your MongoDB cluster
2. Run these commands:

```javascript
use Academy
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Replace `your-email@example.com` with your actual email address.

### Option 3: Create Admin via Registration

1. Register a new user through the frontend (`/register`)
2. Then update the user's role to `admin` using Option 2 above

## Default Admin Credentials (After Running Script)

After running `create-admin.js`:

```
Email: admin@iremecorner.com
Password: Admin123!
```

**⚠️ SECURITY WARNING:** 
- Change these default credentials immediately after first login
- Use a strong password in production
- Never commit admin credentials to version control

## Login as Admin

1. Go to the frontend: `http://localhost:3000/login`
2. Enter the admin email and password
3. You'll have access to:
   - Admin Dashboard (`/admin`)
   - Create Courses (`/create-course`)
   - Manage Users
   - Approve Courses
   - View Analytics

## Custom Admin Credentials

To create an admin with custom credentials, edit `backend/create-admin.js`:

```javascript
const adminEmail = 'your-admin@example.com';
const adminPassword = 'YourSecurePassword123!';
const adminName = 'Your Admin Name';
```

Then run:
```bash
node create-admin.js
```

## Troubleshooting

### "User already exists"
- The script will update the existing user to admin role
- No need to create a new user

### "Cannot find module"
- Make sure you're in the `backend` directory
- Run `npm install` if you haven't already

### "MongoDB connection error"
- Make sure your `.env` file has `DB_USER`, `DB_PASS`, and `DB_NAME` set
- Verify your MongoDB Atlas cluster is running
- Check your IP is whitelisted in MongoDB Atlas Network Access

### "Permission denied"
- Make sure your database user has read/write permissions in MongoDB Atlas



## Quick Setup - Create Admin User

### Option 1: Using Script (Recommended)

Run the admin creation script:

```bash
cd backend
node create-admin.js
```

This will create an admin user with:
- **Email:** `admin@iremecorner.com`
- **Password:** `Admin123!`
- **Role:** Admin

**⚠️ IMPORTANT:** Change the password after first login!

### Option 2: Update Existing User to Admin

If you already have a user account and want to make it admin:

#### Using MongoDB Atlas (Web Interface)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Go to **Database** → **Browse Collections**
4. Select the `Academy` database
5. Open the `users` collection
6. Find your user document (by email)
7. Click **Edit Document**
8. Change `role` field from `"student"` to `"admin"`
9. Click **Update**

#### Using MongoDB Shell

1. Connect to your MongoDB cluster
2. Run these commands:

```javascript
use Academy
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Replace `your-email@example.com` with your actual email address.

### Option 3: Create Admin via Registration

1. Register a new user through the frontend (`/register`)
2. Then update the user's role to `admin` using Option 2 above

## Default Admin Credentials (After Running Script)

After running `create-admin.js`:

```
Email: admin@iremecorner.com
Password: Admin123!
```

**⚠️ SECURITY WARNING:** 
- Change these default credentials immediately after first login
- Use a strong password in production
- Never commit admin credentials to version control

## Login as Admin

1. Go to the frontend: `http://localhost:3000/login`
2. Enter the admin email and password
3. You'll have access to:
   - Admin Dashboard (`/admin`)
   - Create Courses (`/create-course`)
   - Manage Users
   - Approve Courses
   - View Analytics

## Custom Admin Credentials

To create an admin with custom credentials, edit `backend/create-admin.js`:

```javascript
const adminEmail = 'your-admin@example.com';
const adminPassword = 'YourSecurePassword123!';
const adminName = 'Your Admin Name';
```

Then run:
```bash
node create-admin.js
```

## Troubleshooting

### "User already exists"
- The script will update the existing user to admin role
- No need to create a new user

### "Cannot find module"
- Make sure you're in the `backend` directory
- Run `npm install` if you haven't already

### "MongoDB connection error"
- Make sure your `.env` file has `DB_USER`, `DB_PASS`, and `DB_NAME` set
- Verify your MongoDB Atlas cluster is running
- Check your IP is whitelisted in MongoDB Atlas Network Access

### "Permission denied"
- Make sure your database user has read/write permissions in MongoDB Atlas



## Quick Setup - Create Admin User

### Option 1: Using Script (Recommended)

Run the admin creation script:

```bash
cd backend
node create-admin.js
```

This will create an admin user with:
- **Email:** `admin@iremecorner.com`
- **Password:** `Admin123!`
- **Role:** Admin

**⚠️ IMPORTANT:** Change the password after first login!

### Option 2: Update Existing User to Admin

If you already have a user account and want to make it admin:

#### Using MongoDB Atlas (Web Interface)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Go to **Database** → **Browse Collections**
4. Select the `Academy` database
5. Open the `users` collection
6. Find your user document (by email)
7. Click **Edit Document**
8. Change `role` field from `"student"` to `"admin"`
9. Click **Update**

#### Using MongoDB Shell

1. Connect to your MongoDB cluster
2. Run these commands:

```javascript
use Academy
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Replace `your-email@example.com` with your actual email address.

### Option 3: Create Admin via Registration

1. Register a new user through the frontend (`/register`)
2. Then update the user's role to `admin` using Option 2 above

## Default Admin Credentials (After Running Script)

After running `create-admin.js`:

```
Email: admin@iremecorner.com
Password: Admin123!
```

**⚠️ SECURITY WARNING:** 
- Change these default credentials immediately after first login
- Use a strong password in production
- Never commit admin credentials to version control

## Login as Admin

1. Go to the frontend: `http://localhost:3000/login`
2. Enter the admin email and password
3. You'll have access to:
   - Admin Dashboard (`/admin`)
   - Create Courses (`/create-course`)
   - Manage Users
   - Approve Courses
   - View Analytics

## Custom Admin Credentials

To create an admin with custom credentials, edit `backend/create-admin.js`:

```javascript
const adminEmail = 'your-admin@example.com';
const adminPassword = 'YourSecurePassword123!';
const adminName = 'Your Admin Name';
```

Then run:
```bash
node create-admin.js
```

## Troubleshooting

### "User already exists"
- The script will update the existing user to admin role
- No need to create a new user

### "Cannot find module"
- Make sure you're in the `backend` directory
- Run `npm install` if you haven't already

### "MongoDB connection error"
- Make sure your `.env` file has `DB_USER`, `DB_PASS`, and `DB_NAME` set
- Verify your MongoDB Atlas cluster is running
- Check your IP is whitelisted in MongoDB Atlas Network Access

### "Permission denied"
- Make sure your database user has read/write permissions in MongoDB Atlas












































