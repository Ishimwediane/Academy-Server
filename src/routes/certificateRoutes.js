const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Certificate = require('../models/Certificate');

// Get all certificates for a trainer
router.get('/trainer', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ trainer: req.user.id })
      .populate('student', 'name email')
      .populate('course', 'title');
    res.json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Issue new certificate
router.post('/issue', auth, async (req, res) => {
  try {
    const { studentId, courseId, certificateNumber } = req.body;
    const certificate = new Certificate({
      student: studentId,
      course: courseId,
      trainer: req.user.id,
      certificateNumber,
      issueDate: new Date()
    });
    await certificate.save();
    res.json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify certificate
router.get('/verify/:number', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateNumber: req.params.number })
      .populate('student', 'name email')
      .populate('course', 'title')
      .populate('trainer', 'name');
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    res.json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
