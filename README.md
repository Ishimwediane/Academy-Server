# IremeCorner Academy Backend API

Express.js RESTful API server for the IremeCorner Academy e-learning platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iremecorner_academy
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Start MongoDB server (if running locally)

4. Run the server:
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

## API Documentation

See main README.md for API endpoint documentation.

## File Structure

- `models/` - Mongoose schemas
- `routes/` - Express route handlers
- `middleware/` - Custom middleware (auth, etc.)
- `utils/` - Utility functions (token generation, file upload)
- `server.js` - Application entry point

## Environment Variables

Required environment variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time
- `FRONTEND_URL` - Frontend URL for CORS

Optional:
- `EMAIL_HOST` - SMTP host for emails
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - Email username
- `EMAIL_PASS` - Email password
- `MAX_FILE_SIZE` - Maximum file upload size in bytes
- `UPLOAD_PATH` - Directory for file uploads

