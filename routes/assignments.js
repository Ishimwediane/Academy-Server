const express = require('express');
const { body, validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for assignment file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/assignments');
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'assignment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// @route   GET /api/assignments/course/:courseId
// @desc    Get all assignments for a course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('lesson', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get assignment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title trainer')
      .populate('lesson', 'title');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/assignments
// @desc    Create a new assignment (Trainer/Admin only)
// @access  Private
router.post('/', protect, authorize('trainer', 'admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
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
        message: 'Not authorized to create assignments for this course'
      });
    }

    const assignment = await Assignment.create({
      ...req.body,
      course: req.body.course
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/assignments/:id/submit
// @desc    Submit assignment (Student only)
// @access  Private
router.post('/:id/submit', protect, upload.single('file'), [
  body('submission').optional().trim()
], async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      s => s.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Assignment already submitted'
      });
    }

    const submissionData = {
      student: req.user._id,
      submission: req.body.submission || '',
      submittedAt: Date.now()
    };

    if (req.file) {
      submissionData.submission = `/uploads/assignments/${req.file.filename}`;
    }

    assignment.submissions.push(submissionData);
    await assignment.save();

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/assignments/:id/grade
// @desc    Grade assignment (Trainer/Admin only)
// @access  Private
router.put('/:id/grade', protect, authorize('trainer', 'admin'), [
  body('submissionId').notEmpty().withMessage('Submission ID is required'),
  body('score').isNumeric().withMessage('Score must be numeric'),
  body('feedback').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const submission = assignment.submissions.id(req.body.submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.score = req.body.score;
    submission.feedback = req.body.feedback || '';
    submission.gradedBy = req.user._id;
    submission.gradedAt = Date.now();

    await assignment.save();

    res.json({
      success: true,
      message: 'Assignment graded successfully',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update assignment
// @access  Private
router.put('/:id', protect, authorize('trainer', 'admin'), async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user is the trainer or admin
    if (assignment.course.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assignment'
      });
    }

    assignment = await Assignment.findByIdAndUpdate(req.params.id, {
      ...req.body,
      updatedAt: Date.now()
    }, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Private
router.delete('/:id', protect, authorize('trainer', 'admin'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user is the trainer or admin
    if (assignment.course.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assignment'
      });
    }

    await assignment.deleteOne();

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
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
