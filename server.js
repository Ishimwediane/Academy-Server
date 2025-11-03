const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iremecorner_academy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/assessments', require('./routes/assessments'));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

