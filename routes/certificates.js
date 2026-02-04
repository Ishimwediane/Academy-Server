const express = require('express');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate unique certificate number
const generateCertificateNumber = () => {
  const prefix = 'IC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// @route   GET /api/certificates
// @desc    Get user's certificates
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title description thumbnail category')
      .sort({ issuedAt: -1 });

    res.json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title description thumbnail category trainer')
      .populate('enrollment');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check if user owns this certificate or is admin
    if (certificate.student._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this certificate'
      });
    }

    res.json({
      success: true,
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/certificates/course/:courseId
// @desc    Get all certificates for a specific course (Trainer/Admin only)
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization
    if (course.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view certificates for this course'
      });
    }

    const certificates = await Certificate.find({ course: req.params.courseId })
      .populate('student', 'name email')
      .sort({ issuedAt: -1 });

    res.json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/certificates/issue
// @desc    Issue a certificate to a student (Trainer/Admin only)
// @access  Private
router.post('/issue', protect, async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and Course ID are required'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization (Trainer or Admin)
    if (course.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to issue certificates for this course'
      });
    }

    // Find enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found for this student in this course'
      });
    }

    // Check completion
    if (enrollment.status !== 'completed' && enrollment.progress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Student has not completed the course yet'
      });
    }

    // Check if duplicate
    const existingCertificate = await Certificate.findOne({
      student: studentId,
      course: courseId
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already issued to this student'
      });
    }

    // Issue Certificate
    const certificate = await Certificate.create({
      student: studentId,
      course: courseId,
      enrollment: enrollment._id,
      issuedBy: req.user._id,
      certificateNumber: generateCertificateNumber()
    });

    // Update enrollment
    enrollment.certificateIssued = true;
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      data: certificate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/certificates/verify/:certificateNumber
// @desc    Verify certificate by number (Public)
// @access  Public
router.get('/verify/:certificateNumber', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateNumber: req.params.certificateNumber
    })
      .populate('student', 'name email')
      .populate('course', 'title description category trainer');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid'
      });
    }

    res.json({
      success: true,
      data: certificate
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






































