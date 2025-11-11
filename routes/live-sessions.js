const express = require('express');
const { body, validationResult } = require('express-validator');
const LiveSession = require('../models/LiveSession');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/live-sessions/course/:courseId
// @desc    Get all live sessions for a course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const sessions = await LiveSession.find({ course: req.params.courseId })
      .sort({ scheduledAt: 1 });

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/live-sessions
// @desc    Create a new live session (Trainer/Admin only)
// @access  Private
router.post('/', protect, authorize('trainer', 'admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('course').notEmpty().withMessage('Course ID is required'),
  body('scheduledAt').isISO8601().withMessage('Scheduled date is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('meetingUrl').trim().notEmpty().withMessage('A valid meeting URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the trainer or admin
    if (course.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create sessions for this course'
      });
    }

    const session = await LiveSession.create({
      ...req.body,
      trainer: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Live session created successfully',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/live-sessions/:id
// @desc    Delete a live session
// @access  Private
router.delete('/:id', protect, authorize('trainer', 'admin'), async (req, res) => {
    try {
        const session = await LiveSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        // Check if user is the trainer or admin
        if (session.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this session'
            });
        }

        await session.deleteOne();

        res.json({ success: true, message: 'Live session deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});


module.exports = router;