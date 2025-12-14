const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const LessonProgress = require('../models/LessonProgress');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');

const router = express.Router();

// @route   POST /api/progress/lessons
// @desc    Mark a lesson as started or completed
// @access  Private (Learner)
router.post(
  '/lessons',
  [
    protect,
    authorize('learner'),
    body('lessonId').notEmpty().withMessage('Lesson ID is required'),
    body('courseId').notEmpty().withMessage('Course ID is required'),
    body('isCompleted').isBoolean().withMessage('isCompleted must be a boolean'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { lessonId, courseId, isCompleted } = req.body;
    const userId = req.user._id;

    try {
      // 1. Verify the user is enrolled in the course
      const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
      if (!enrollment) {
        return res.status(403).json({ success: false, message: 'You are not enrolled in this course.' });
      }

      // 2. Verify the lesson belongs to the course
      const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
      if (!lesson) {
        return res.status(404).json({ success: false, message: 'Lesson not found in this course.' });
      }

      // 3. Find or create the progress document
      const progress = await LessonProgress.findOneAndUpdate(
        { user: userId, lesson: lessonId },
        {
          $set: {
            isCompleted,
            completedAt: isCompleted ? Date.now() : null,
            course: courseId,
          },
          $setOnInsert: {
            startedAt: Date.now(),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   GET /api/progress/courses/:courseId
// @desc    Get all lesson progress for a user in a course
// @access  Private (Learner)
router.get('/courses/:courseId', [protect, authorize('learner')], async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  try {
    // 1. Verify enrollment (optional, but good practice)
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this course.' });
    }

    // 2. Fetch progress
    const progress = await LessonProgress.find({ user: userId, course: courseId });

    res.status(200).json({ success: true, count: progress.length, data: progress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
