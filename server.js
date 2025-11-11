const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// Allow multiple frontend origins for development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://ireme-corner-academy.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In development, allow localhost on any port
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        callback(null, true);
      } else if (origin && origin.includes('vercel.app')) {
        // Allow all Vercel deployments
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Replace plain express.json() with a version that stores the raw body for debugging
app.use(express.json({
  limit: '1mb',
  verify: (req, res, buf, encoding) => {
    // store raw body as string for later logging if parse fails
    try {
      req.rawBody = buf ? buf.toString(encoding || 'utf8') : '';
    } catch (e) {
      req.rawBody = '';
    }
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
connectDB();

// Add a middleware to catch JSON parse errors (thrown by express.json/body-parser)
// This must come before route handlers
app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', {
      rawBody: req.rawBody,
      errorMessage: err.message
    });
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  return next(err);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/live-sessions', require('./routes/live-sessions'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/ai-assistant', require('./routes/aiAssistant'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/discussions', require('./routes/discussions'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'IremeCorner Academy API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
