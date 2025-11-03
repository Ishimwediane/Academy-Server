const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  title: {
    type: String,
    required: [true, 'Please provide an assignment title'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  maxScore: {
    type: Number,
    default: 100
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submission: {
      type: String // Text submission or file path
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    score: Number,
    feedback: String,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema);

