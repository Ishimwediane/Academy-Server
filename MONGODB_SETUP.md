# MongoDB Connection Setup Guide

## Where to Put Database Credentials

**Create a `.env` file in the `backend` directory** with your MongoDB Atlas credentials.

## MongoDB Atlas Connection Format

The application uses separate environment variables for database credentials:

```env
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=Academy
```

## Setup Steps

### 1. Get Your MongoDB Atlas Credentials

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Select your cluster
4. Go to "Database Access" → Create a database user (if you haven't already)
   - Remember the username and password you create

### 2. Configure Network Access

1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. For development, you can use `0.0.0.0/0` (allow all IPs)
4. **For production, add only your specific IP addresses**

### 3. Update Cluster URL (if needed)

If your cluster URL is different from `cluster0.4z6c4.mongodb.net`, update it in `backend/config/db.js`:

```javascript
// Replace cluster0.4z6c4.mongodb.net with your actual cluster URL
const dbUri = `mongodb+srv://${db_user}:${db_pass}@your-cluster-url.mongodb.net/${db_name}`;
```

### 4. Create .env File

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development
HOST=localhost

# MongoDB Atlas Credentials
DB_USER=your_database_username
DB_PASS=your_database_password
DB_NAME=Academy

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
PASSWORD_RESET_EXPIRE=10

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=104857600
UPLOAD_PATH=./uploads
```

## How It Works

The connection is made in `backend/config/db.js`:

```javascript
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;

const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
```

The server loads these in `backend/server.js` by calling `connectDB()`.

## Testing Your Connection

After setting up your `.env` file:

1. Make sure all three variables are set:
   - `DB_USER` - Your MongoDB Atlas database username
   - `DB_PASS` - Your MongoDB Atlas database password
   - `DB_NAME` - Database name (should be `Academy`)

2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5001
```

If you see an error, check:
- `DB_USER`, `DB_PASS`, and `DB_NAME` are all set in your `.env` file
- Your MongoDB Atlas cluster is running and accessible
- Username and password are correct
- Your IP address is whitelisted in MongoDB Atlas Network Access
- The cluster URL in `backend/config/db.js` matches your actual cluster

## Security Notes

⚠️ **Important:** 
- Never commit your `.env` file to Git (it's already in `.gitignore`)
- Never share your database credentials publicly
- Use strong passwords for production
- Use specific IP addresses for production (not `0.0.0.0/0`)

## Troubleshooting

### "MongoNetworkError: connect ECONNREFUSED" or "MongoServerError"
- Verify your MongoDB Atlas cluster is running
- Check your cluster URL in `backend/config/db.js` matches your actual cluster
- Verify all three environment variables (`DB_USER`, `DB_PASS`, `DB_NAME`) are set

### "Authentication failed" or "bad auth"
- Check your `DB_USER` and `DB_PASS` in the `.env` file
- Verify your database user exists in MongoDB Atlas Database Access
- Make sure there are no extra spaces or quotes in your `.env` values

### "IP not whitelisted" or "MongoServerError: IP is not whitelisted"
- Add your IP address to MongoDB Atlas Network Access list
- For development, you can temporarily use `0.0.0.0/0` (allow all IPs) - **NOT for production**
- Get your current IP address and add it specifically for better security

### "MongoServerError: user is not allowed to do action"
- Verify your database user has read/write permissions in Database Access
- Make sure the user has access to the database specified in `DB_NAME`

### Missing environment variables
- Make sure your `.env` file is in the `backend` directory
- Verify all three variables are set: `DB_USER`, `DB_PASS`, `DB_NAME`
- Check for typos in variable names (they're case-sensitive)
