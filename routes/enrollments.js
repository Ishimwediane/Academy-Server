const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/enrollments
// @desc    Get user's enrollments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const query = { student: req.user._id };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const enrollments = await Enrollment.find(query)
      .populate('course', 'title description thumbnail trainer category level')
      .populate('student', 'name email')
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/enrollments
// @desc    Enroll in a course
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Course is not available for enrollment'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      status: 'enrolled'
    });

    // Add student to course
    course.enrolledStudents.push(req.user._id);
    await course.save();

    await enrollment.populate('course', 'title description thumbnail trainer');
    await enrollment.populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/enrollments/:id/progress
// @desc    Update enrollment progress
// @access  Private
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const { lessonId, progress } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check if user owns this enrollment
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment'
      });
    }

    // Add lesson to completed lessons if provided
    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Update progress
    if (progress !== undefined) {
      enrollment.progress = Math.min(100, Math.max(0, progress));
    }

    // Calculate progress from completed lessons
    const course = await Course.findById(enrollment.course);
    if (course && course.lessons.length > 0) {
      const totalLessons = course.lessons.length;
      const completedCount = enrollment.completedLessons.length;
      enrollment.progress = Math.round((completedCount / totalLessons) * 100);
    }

    // Update status
    if (enrollment.progress === 100 && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      enrollment.completedAt = Date.now();
    } else if (enrollment.progress > 0 && enrollment.status === 'enrolled') {
      enrollment.status = 'in-progress';
    }

    await enrollment.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/enrollments/:id
// @desc    Get enrollment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('course', 'title description thumbnail trainer category level lessons')
      .populate('student', 'name email')
      .populate('completedLessons');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check if user owns this enrollment or is trainer/admin
    if (enrollment.student._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'trainer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this enrollment'
      });
    }

    res.json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/enrollments/:id
// @desc    Drop enrollment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check if user owns this enrollment
    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to drop this enrollment'
      });
    }

    enrollment.status = 'dropped';
    await enrollment.save();

    res.json({
      success: true,
      message: 'Enrollment dropped successfully'
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

