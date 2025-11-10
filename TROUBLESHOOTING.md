# Troubleshooting MongoDB Connection Issues

## Authentication Failed Error

If you're seeing: `MongoServerError: bad auth : Authentication failed`

### Common Causes and Solutions:

#### 1. Check Your Credentials in .env File

Make sure your `.env` file has the correct values:
```env
DB_USER=your_actual_username
DB_PASS=your_actual_password
DB_NAME=Academy
```

**Check:**
- No extra spaces around the `=` sign
- No quotes around the values (unless they're part of the password)
- Username and password match exactly what you set in MongoDB Atlas

#### 2. Verify Database User in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Go to **Database Access** (Security → Database Access)
4. Check that your user exists and the username matches `DB_USER` in your `.env`
5. If the password is incorrect, you can:
   - Click "Edit" on the user
   - Click "Edit Password"
   - Reset the password
   - Update `DB_PASS` in your `.env` file

#### 3. Password with Special Characters

If your password contains special characters like `@`, `#`, `$`, `%`, `&`, etc., they need to be URL-encoded:

**Common characters and their encodings:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `/` → `%2F`
- `?` → `%3F`

**OR** use a password without special characters for easier setup.

#### 4. Check Network Access

Make sure your IP address is whitelisted:

1. Go to **Network Access** in MongoDB Atlas (Security → Network Access)
2. Click "Add IP Address"
3. For development, you can use `0.0.0.0/0` (allow all IPs) - **NOT for production**
4. OR add your specific IP address

#### 5. Verify Cluster URL

Check that your cluster URL is correct in `backend/config/db.js`:

```javascript
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;
```

If your cluster has a different name, update `cluster0.4z6c4.mongodb.net` to your actual cluster URL.

**To find your cluster URL:**
1. Go to MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Look at the connection string - the part after `@` and before `.mongodb.net` is your cluster name

#### 6. Test Your Connection String

You can test your connection string directly:

1. Create a test file `test-db.js`:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');

const db_user = process.env.DB_USER;
const db_pass = encodeURIComponent(process.env.DB_PASS);
const db_name = process.env.DB_NAME;
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

console.log('Testing connection...');
console.log('DB_USER:', db_user);
console.log('DB_NAME:', db_name);
console.log('Connection string:', dbUri.replace(db_pass, '***')); // Hide password in log

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connection successful!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});
```

2. Run it:
```bash
node test-db.js
```

#### 7. Common Mistakes

- **Wrong username**: Make sure it's the database user username, not your MongoDB Atlas account email
- **Wrong password**: Double-check it matches the database user password in Atlas
- **Database name**: Should be `Academy` (as set in `DB_NAME`)
- **Cluster name**: Make sure `cluster0.4z6c4.mongodb.net` matches your actual cluster

### Quick Checklist

- [ ] `DB_USER` is set correctly in `.env`
- [ ] `DB_PASS` is set correctly in `.env` (no extra spaces)
- [ ] `DB_NAME` is set to `Academy`
- [ ] Database user exists in MongoDB Atlas Database Access
- [ ] Password matches the database user password in Atlas
- [ ] IP address is whitelisted in Network Access
- [ ] Cluster URL in `backend/config/db.js` matches your actual cluster

### Still Having Issues?

1. **Create a new database user** in MongoDB Atlas:
   - Go to Database Access
   - Add New Database User
   - Use a simple password without special characters
   - Give it "Read and write to any database" permissions
   - Update your `.env` file with the new credentials

2. **Check MongoDB Atlas logs**:
   - Go to your cluster
   - Check the "Logs" tab for any connection errors

3. **Verify your cluster is running**:
   - Make sure your cluster is not paused or stopped
   - Check that it's in the correct region




## Authentication Failed Error

If you're seeing: `MongoServerError: bad auth : Authentication failed`

### Common Causes and Solutions:

#### 1. Check Your Credentials in .env File

Make sure your `.env` file has the correct values:
```env
DB_USER=your_actual_username
DB_PASS=your_actual_password
DB_NAME=Academy
```

**Check:**
- No extra spaces around the `=` sign
- No quotes around the values (unless they're part of the password)
- Username and password match exactly what you set in MongoDB Atlas

#### 2. Verify Database User in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Go to **Database Access** (Security → Database Access)
4. Check that your user exists and the username matches `DB_USER` in your `.env`
5. If the password is incorrect, you can:
   - Click "Edit" on the user
   - Click "Edit Password"
   - Reset the password
   - Update `DB_PASS` in your `.env` file

#### 3. Password with Special Characters

If your password contains special characters like `@`, `#`, `$`, `%`, `&`, etc., they need to be URL-encoded:

**Common characters and their encodings:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `/` → `%2F`
- `?` → `%3F`

**OR** use a password without special characters for easier setup.

#### 4. Check Network Access

Make sure your IP address is whitelisted:

1. Go to **Network Access** in MongoDB Atlas (Security → Network Access)
2. Click "Add IP Address"
3. For development, you can use `0.0.0.0/0` (allow all IPs) - **NOT for production**
4. OR add your specific IP address

#### 5. Verify Cluster URL

Check that your cluster URL is correct in `backend/config/db.js`:

```javascript
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;
```

If your cluster has a different name, update `cluster0.4z6c4.mongodb.net` to your actual cluster URL.

**To find your cluster URL:**
1. Go to MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Look at the connection string - the part after `@` and before `.mongodb.net` is your cluster name

#### 6. Test Your Connection String

You can test your connection string directly:

1. Create a test file `test-db.js`:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');

const db_user = process.env.DB_USER;
const db_pass = encodeURIComponent(process.env.DB_PASS);
const db_name = process.env.DB_NAME;
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

console.log('Testing connection...');
console.log('DB_USER:', db_user);
console.log('DB_NAME:', db_name);
console.log('Connection string:', dbUri.replace(db_pass, '***')); // Hide password in log

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connection successful!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});
```

2. Run it:
```bash
node test-db.js
```

#### 7. Common Mistakes

- **Wrong username**: Make sure it's the database user username, not your MongoDB Atlas account email
- **Wrong password**: Double-check it matches the database user password in Atlas
- **Database name**: Should be `Academy` (as set in `DB_NAME`)
- **Cluster name**: Make sure `cluster0.4z6c4.mongodb.net` matches your actual cluster

### Quick Checklist

- [ ] `DB_USER` is set correctly in `.env`
- [ ] `DB_PASS` is set correctly in `.env` (no extra spaces)
- [ ] `DB_NAME` is set to `Academy`
- [ ] Database user exists in MongoDB Atlas Database Access
- [ ] Password matches the database user password in Atlas
- [ ] IP address is whitelisted in Network Access
- [ ] Cluster URL in `backend/config/db.js` matches your actual cluster

### Still Having Issues?

1. **Create a new database user** in MongoDB Atlas:
   - Go to Database Access
   - Add New Database User
   - Use a simple password without special characters
   - Give it "Read and write to any database" permissions
   - Update your `.env` file with the new credentials

2. **Check MongoDB Atlas logs**:
   - Go to your cluster
   - Check the "Logs" tab for any connection errors

3. **Verify your cluster is running**:
   - Make sure your cluster is not paused or stopped
   - Check that it's in the correct region




## Authentication Failed Error

If you're seeing: `MongoServerError: bad auth : Authentication failed`

### Common Causes and Solutions:

#### 1. Check Your Credentials in .env File

Make sure your `.env` file has the correct values:
```env
DB_USER=your_actual_username
DB_PASS=your_actual_password
DB_NAME=Academy
```

**Check:**
- No extra spaces around the `=` sign
- No quotes around the values (unless they're part of the password)
- Username and password match exactly what you set in MongoDB Atlas

#### 2. Verify Database User in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Go to **Database Access** (Security → Database Access)
4. Check that your user exists and the username matches `DB_USER` in your `.env`
5. If the password is incorrect, you can:
   - Click "Edit" on the user
   - Click "Edit Password"
   - Reset the password
   - Update `DB_PASS` in your `.env` file

#### 3. Password with Special Characters

If your password contains special characters like `@`, `#`, `$`, `%`, `&`, etc., they need to be URL-encoded:

**Common characters and their encodings:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `/` → `%2F`
- `?` → `%3F`

**OR** use a password without special characters for easier setup.

#### 4. Check Network Access

Make sure your IP address is whitelisted:

1. Go to **Network Access** in MongoDB Atlas (Security → Network Access)
2. Click "Add IP Address"
3. For development, you can use `0.0.0.0/0` (allow all IPs) - **NOT for production**
4. OR add your specific IP address

#### 5. Verify Cluster URL

Check that your cluster URL is correct in `backend/config/db.js`:

```javascript
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;
```

If your cluster has a different name, update `cluster0.4z6c4.mongodb.net` to your actual cluster URL.

**To find your cluster URL:**
1. Go to MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Look at the connection string - the part after `@` and before `.mongodb.net` is your cluster name

#### 6. Test Your Connection String

You can test your connection string directly:

1. Create a test file `test-db.js`:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');

const db_user = process.env.DB_USER;
const db_pass = encodeURIComponent(process.env.DB_PASS);
const db_name = process.env.DB_NAME;
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.4z6c4.mongodb.net/${db_name}?retryWrites=true&w=majority`;

console.log('Testing connection...');
console.log('DB_USER:', db_user);
console.log('DB_NAME:', db_name);
console.log('Connection string:', dbUri.replace(db_pass, '***')); // Hide password in log

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connection successful!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});
```

2. Run it:
```bash
node test-db.js
```

#### 7. Common Mistakes

- **Wrong username**: Make sure it's the database user username, not your MongoDB Atlas account email
- **Wrong password**: Double-check it matches the database user password in Atlas
- **Database name**: Should be `Academy` (as set in `DB_NAME`)
- **Cluster name**: Make sure `cluster0.4z6c4.mongodb.net` matches your actual cluster

### Quick Checklist

- [ ] `DB_USER` is set correctly in `.env`
- [ ] `DB_PASS` is set correctly in `.env` (no extra spaces)
- [ ] `DB_NAME` is set to `Academy`
- [ ] Database user exists in MongoDB Atlas Database Access
- [ ] Password matches the database user password in Atlas
- [ ] IP address is whitelisted in Network Access
- [ ] Cluster URL in `backend/config/db.js` matches your actual cluster

### Still Having Issues?

1. **Create a new database user** in MongoDB Atlas:
   - Go to Database Access
   - Add New Database User
   - Use a simple password without special characters
   - Give it "Read and write to any database" permissions
   - Update your `.env` file with the new credentials

2. **Check MongoDB Atlas logs**:
   - Go to your cluster
   - Check the "Logs" tab for any connection errors

3. **Verify your cluster is running**:
   - Make sure your cluster is not paused or stopped
   - Check that it's in the correct region







































