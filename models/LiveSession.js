const mongoose = require('mongoose');

const LiveSessionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a session title'],
    trim: true,
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Please provide a schedule date and time'],
  },
  duration: {
    type: Number, // in minutes
    default: 60,
  },
  meetingUrl: {
    type: String,
    required: [true, 'Please provide a meeting URL'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LiveSession', LiveSessionSchema);