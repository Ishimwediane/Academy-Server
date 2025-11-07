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

// @route   POST /api/certificates/generate/:enrollmentId
// @desc    Generate certificate for completed course
// @access  Private
router.post('/generate/:enrollmentId', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate('course')
      .populate('student');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check if user owns this enrollment
    if (enrollment.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if course is completed
    if (enrollment.status !== 'completed' || enrollment.progress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Course must be completed to generate certificate'
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      student: enrollment.student._id,
      course: enrollment.course._id
    });

    if (existingCertificate) {
      return res.json({
        success: true,
        message: 'Certificate already exists',
        data: existingCertificate
      });
    }

    // Generate certificate
    const certificate = await Certificate.create({
      student: enrollment.student._id,
      course: enrollment.course._id,
      enrollment: enrollment._id,
      certificateNumber: generateCertificateNumber()
    });

    // Mark enrollment as certificate issued
    enrollment.certificateIssued = true;
    await enrollment.save();

    await certificate.populate('course', 'title description thumbnail');
    await certificate.populate('student', 'name email');

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
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


























