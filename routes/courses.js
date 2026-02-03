const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

// Get all allowed course categories
router.get('/categories', (req, res) => {
  const categories = [
    { name: 'Digital Tools', value: 'Digital Tools' },
    { name: 'Marketing', value: 'Marketing' },
    { name: 'Financial Literacy', value: 'Financial Literacy' },
    { name: 'Business Management', value: 'Business Management' },
    { name: 'Technical Skills', value: 'Technical Skills' },
    { name: 'Other', value: 'Other' }
  ];
  res.json({
    success: true,
    data: categories
  });
});

// @route   GET /api/courses
// @desc    Get all courses (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, level, status, search, trainer } = req.query;
    const query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (status) query.status = status;
    if (trainer) query.trainer = trainer;
    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .populate('trainer', 'name email avatar')
      .populate('enrolledStudents', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('trainer', 'name email avatar')
      .populate('lessons')
      .populate('enrolledStudents', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/courses
// @desc    Create a new course (Trainer/Admin only)
// @access  Private
router.post(
  '/',
  protect,
  authorize('trainer', 'admin'),
  upload.single('thumbnail'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').isIn([
      'Digital Tools',
      'Marketing',
      'Financial Literacy',
      'Business Management',
      'Technical Skills',
      'Other'
    ]).withMessage('Invalid category'),
    body('type').isIn(['free', 'paid']).withMessage('Type must be free or paid'),
    body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Level must be Beginner, Intermediate, or Advanced'),
    body('duration').notEmpty().withMessage('Duration is required')
  ],
  async (req, res) => {
    try {
      // Debug: log the incoming body
      console.log('Create course request body:', req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const courseData = {
        ...req.body,
        trainer: req.user._id,
        // If a trainer creates a course, it starts as a draft.
        // Admins can still approve directly.
        status: req.user.role === 'admin' ? 'approved' : 'draft' // Trainers start courses as drafts
      };

      // Parse JSON array fields if they exist
      if (req.body.whatYouWillLearn) {
        try {
          courseData.whatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
        } catch (e) {
          console.error('Error parsing whatYouWillLearn:', e);
        }
      }

      if (req.body.learningObjectives) {
        try {
          courseData.learningObjectives = JSON.parse(req.body.learningObjectives);
        } catch (e) {
          console.error('Error parsing learningObjectives:', e);
        }
      }

      if (req.file) {
        courseData.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
      }

      const course = await Course.create(courseData);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course
      });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private
router.put('/:id', protect, upload.single('thumbnail'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
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
        message: 'Not authorized to update this course'
      });
    }

    const updateData = { ...req.body, updatedAt: Date.now() };
    if (req.file) {
      // TODO: Add logic to delete old thumbnail if it exists
      updateData.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
    }

    // Trainers can only submit for review (pending) or revert to draft. They cannot approve/reject.
    if (req.user.role === 'trainer' && updateData.status) {
      if (!['pending', 'draft'].includes(updateData.status)) {
        delete updateData.status;
      }
    }

    course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/courses/:id/approve
// @desc    Approve or reject a course (Admin only)
// @access  Private/Admin
router.patch('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    // Validate status
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    // Find course
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Update course status
    course.status = status;
    if (status === 'rejected' && rejectionReason) {
      course.rejectionReason = rejectionReason;
    }
    course.updatedAt = Date.now();

    await course.save();

    // Populate trainer info for response
    await course.populate('trainer', 'name email');

    res.json({
      success: true,
      message: `Course ${status} successfully`,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
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
        message: 'Not authorized to delete this course'
      });
    }

    // Delete associated lessons
    await Lesson.deleteMany({ course: course._id });

    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/courses/:id/approve
// @desc    Approve/Reject course (Admin only)
// @access  Private/Admin
router.put('/:id/approve', protect, authorize('admin'), [
  body('status').isIn(['approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.status = req.body.status;
    course.updatedAt = Date.now();
    await course.save();

    res.json({
      success: true,
      message: `Course ${req.body.status} successfully`,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/courses/:id/rating
// @desc    Add rating to course
// @access  Private
router.post('/:id/rating', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user already rated
    const existingRating = course.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = req.body.rating;
      existingRating.comment = req.body.comment || '';
    } else {
      course.ratings.push({
        user: req.user._id,
        rating: req.body.rating,
        comment: req.body.comment || ''
      });
    }

    await course.save();

    res.json({
      success: true,
      message: 'Rating added successfully',
      data: course
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
