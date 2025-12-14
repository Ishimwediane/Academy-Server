const mongoose = require('mongoose');

const LessonProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

// Ensure a user can only have one progress entry per lesson
LessonProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('LessonProgress', LessonProgressSchema);
