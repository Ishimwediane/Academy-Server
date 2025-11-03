# How to Verify Your .env File

If you're getting "Missing required database credentials" error, follow these steps:

## Step 1: Check .env File Location

The `.env` file **MUST** be in the `backend` directory, not the root directory.

**Correct location:**
```
backend/.env
```

**Wrong location:**
```
.env  (in root)
frontend/.env
```

## Step 2: Check .env File Format

Your `.env` file should look exactly like this (no spaces, no quotes, no extra lines):

```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

DB_USER=your_username_here
DB_PASS=your_password_here
DB_NAME=Academy
```

### Common Mistakes:

❌ **WRONG** - Has spaces around `=`
```env
DB_USER = your_username
```

✅ **CORRECT** - No spaces
```env
DB_USER=your_username
```

❌ **WRONG** - Has quotes
```env
DB_USER="your_username"
DB_PASS='your_password'
```

✅ **CORRECT** - No quotes
```env
DB_USER=your_username
DB_PASS=your_password
```

❌ **WRONG** - Has blank lines or comments before values
```env
DB_USER=
# comment
your_username
```

✅ **CORRECT** - Direct assignment
```env
DB_USER=your_username
```

## Step 3: Verify Your Credentials

1. **Check MongoDB Atlas Database Access:**
   - Go to https://cloud.mongodb.com/
   - Sign in
   - Go to **Security** → **Database Access**
   - Find your database user
   - Check that:
     - Username matches `DB_USER` in your `.env` file
     - The user has "Read and write to any database" permissions

2. **If you need to reset the password:**
   - Click **Edit** on the user in Database Access
   - Click **Edit Password**
   - Enter a new password
   - **Copy the password exactly** to your `.env` file as `DB_PASS`

## Step 4: Test Your Connection

Run the test script:

```bash
cd backend
node test-db-connection.js
```

This will show you:
- ✅ If all variables are set correctly
- ✅ If the connection works
- ❌ What's wrong if it fails

## Step 5: Check File Encoding

Sometimes `.env` files get saved with wrong encoding. Make sure:
- File is saved as **UTF-8** encoding
- No BOM (Byte Order Mark) if on Windows

## Quick Checklist

- [ ] `.env` file is in `backend` directory
- [ ] File is named exactly `.env` (with the dot at the beginning)
- [ ] `DB_USER=your_username` (no spaces around `=`)
- [ ] `DB_PASS=your_password` (no spaces, no quotes)
- [ ] `DB_NAME=Academy` (capital A, rest lowercase)
- [ ] No blank lines between variable and value
- [ ] Username/password match MongoDB Atlas Database Access
- [ ] IP address is whitelisted in MongoDB Atlas Network Access

## Still Not Working?

1. **Double-check your .env file:**
   ```bash
   # In backend directory
   type .env  # Windows PowerShell
   cat .env   # Linux/Mac
   ```

2. **Verify the file is being read:**
   - Make sure you're in the `backend` directory when running commands
   - Make sure there are no typos in variable names (DB_USER, not DB_USERNAME)

3. **Try creating a new .env file:**
   - Delete the old one
   - Create a new one with just these 3 lines:
     ```
     DB_USER=your_username
     DB_PASS=your_password
     DB_NAME=Academy
     ```
   - Save it in the `backend` directory
   - Run the test script again


