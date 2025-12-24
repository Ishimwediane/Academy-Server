const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const LessonProgress = require('../models/LessonProgress');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');

const router = express.Router();

// @route   POST /api/progress/lessons
// @desc    Mark a lesson as started or completed
// @access  Private (Student)
router.post(
  '/lessons',
  [
    protect,
    authorize('student'),
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
      const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
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

      // 4. Sync with Enrollment model - update completedLessons array
      if (isCompleted) {
        // Add lesson to completedLessons if not already there
        if (!enrollment.completedLessons.includes(lessonId)) {
          enrollment.completedLessons.push(lessonId);
        }
      } else {
        // Remove lesson from completedLessons if marking as incomplete
        enrollment.completedLessons = enrollment.completedLessons.filter(
          id => id.toString() !== lessonId.toString()
        );
      }

      // 5. Recalculate progress based on completed lessons
      const Course = require('../models/Course');
      const course = await Course.findById(courseId);
      if (course && course.lessons.length > 0) {
        const totalLessons = course.lessons.length;
        const completedCount = enrollment.completedLessons.length;
        enrollment.progress = Math.round((completedCount / totalLessons) * 100);

        // Update status based on progress
        if (enrollment.progress === 100 && enrollment.status !== 'completed') {
          enrollment.status = 'completed';
          enrollment.completedAt = Date.now();
        } else if (enrollment.progress > 0 && enrollment.status === 'enrolled') {
          enrollment.status = 'in-progress';
        } else if (enrollment.progress === 0 && enrollment.status === 'in-progress') {
          enrollment.status = 'enrolled';
        }
      }

      await enrollment.save();

      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route   GET /api/progress/courses/:courseId
// @desc    Get all lesson progress for a user in a course
// @access  Private (Student)
router.get('/courses/:courseId', [protect, authorize('student')], async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  try {
    // 1. Verify enrollment (optional, but good practice)
    const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
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
