const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    trim: true
  },
  description: {
    type: String
  },
  content: {
    type: String // Rich text content
  },
  videoUrl: {
    type: String
  },
  videoFile: {
    type: String // Path to uploaded video
  },
  materials: [{
    filename: String,
    originalName: String,
    filePath: String,
    fileType: String,
    fileSize: Number
  }],
  order: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);











