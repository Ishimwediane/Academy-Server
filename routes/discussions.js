const express = require('express');
const { body, validationResult } = require('express-validator');
const Discussion = require('../models/Discussion');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/discussions/course/:courseId
// @desc    Get all discussions for a course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const discussions = await Discussion.find({ course: req.params.courseId })
      .populate('author', 'name email avatar')
      .populate('lesson', 'title')
      .populate('replies.author', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: discussions.length,
      data: discussions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/discussions/:id
// @desc    Get discussion by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'name email avatar')
      .populate('course', 'title')
      .populate('lesson', 'title')
      .populate('replies.author', 'name email avatar');

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    res.json({
      success: true,
      data: discussion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/discussions
// @desc    Create a new discussion
// @access  Private
router.post('/', protect, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('course').notEmpty().withMessage('Course ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if user is enrolled in the course (if not admin or trainer)
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: req.body.course
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled in the course to participate in discussions'
        });
      }
    }

    const discussion = await Discussion.create({
      ...req.body,
      author: req.user._id,
      course: req.body.course
    });

    await discussion.populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      data: discussion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/discussions/:id/reply
// @desc    Reply to a discussion
// @access  Private
router.post('/:id/reply', protect, [
  body('content').trim().notEmpty().withMessage('Reply content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check if user is enrolled in the course (if not admin or trainer)
    if (req.user.role === 'student') {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: discussion.course
      });

      if (!enrollment) {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled in the course to participate in discussions'
        });
      }
    }

    discussion.replies.push({
      author: req.user._id,
      content: req.body.content
    });

    discussion.updatedAt = Date.now();
    await discussion.save();

    await discussion.populate('replies.author', 'name email avatar');

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: discussion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/discussions/:id
// @desc    Update discussion
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check if user is the author
    if (discussion.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this discussion'
      });
    }

    discussion.title = req.body.title || discussion.title;
    discussion.content = req.body.content || discussion.content;
    discussion.updatedAt = Date.now();

    await discussion.save();

    res.json({
      success: true,
      message: 'Discussion updated successfully',
      data: discussion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/discussions/:id
// @desc    Delete discussion
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check if user is the author or admin
    if (discussion.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion'
      });
    }

    await discussion.deleteOne();

    res.json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;

