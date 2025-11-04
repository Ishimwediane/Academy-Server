# Backend Deployment Checklist - Render.com

## ✅ Pre-Deployment Checklist

- [ ] All environment variables set in Render.com dashboard
- [ ] MongoDB Atlas cluster is accessible
- [ ] MongoDB IP whitelist includes `0.0.0.0/0` (all IPs)
- [ ] Database credentials are correct
- [ ] CORS configured to allow frontend URL
- [ ] JWT_SECRET is strong and unique
- [ ] Uploads directory exists (or will be created automatically)

## Environment Variables Required

```
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://ireme-corner-academy.vercel.app
JWT_SECRET=your-strong-secret-key-here
JWT_EXPIRE=7d
DB_USER=your-mongodb-username
DB_PASS=your-mongodb-password
DB_NAME=Academy
MAX_FILE_SIZE=5242880
```

## Post-Deployment Verification

### 1. Test API Endpoints

```bash
# Test courses endpoint
curl https://academy-server-f60a.onrender.com/api/courses

# Test health (if available)
curl https://academy-server-f60a.onrender.com/api/health
```

### 2. Check CORS

```javascript
// Test from browser console on frontend
fetch('https://academy-server-f60a.onrender.com/api/courses')
  .then(r => r.json())
  .then(console.log)
```

### 3. Verify Database Connection

- Check Render.com logs for "✅ Connected to MongoDB"
- Verify no connection errors

### 4. Test Authentication

- Try registering a new user
- Try logging in
- Verify JWT token is generated

## Common Issues

### Server Sleeps (Free Tier)
- Render.com free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 15-30 seconds
- Consider upgrading or using a keep-alive service

### Database Connection Timeout
- Verify MongoDB Atlas allows connections from Render.com IPs
- Check connection string format
- Ensure `DB_USER`, `DB_PASS`, `DB_NAME` are correct

### CORS Errors
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check backend CORS configuration in `server.js`
- Ensure origin includes `https://ireme-corner-academy.vercel.app`

## Monitoring

- Check Render.com dashboard → Logs regularly
- Monitor for errors, slow requests
- Set up alerts if possible


