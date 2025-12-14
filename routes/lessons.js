const express = require('express');
const { body, validationResult } = require('express-validator');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === 'videoFile') {
      uploadPath = path.resolve(__dirname, '../uploads/videos');
    } else if (file.fieldname === 'materials') {
      uploadPath = path.resolve(__dirname, '../uploads/materials');
    } else {
      // A default path in case of unexpected field names
      uploadPath = path.resolve(__dirname, '../uploads/others');
    }
    
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// @route   GET /api/lessons/course/:courseId
// @desc    Get all lessons for a course
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/lessons/:id
// @desc    Get lesson by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course', 'title trainer');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/lessons
// @desc    Create a new lesson (Trainer/Admin only)
// @access  Private
router.post('/', protect, authorize('trainer', 'admin'), upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'materials', maxCount: 10 }
]), async (req, res) => {
  // Manual validation
  await body('title').trim().notEmpty().withMessage('Title is required').run(req);
  await body('course').notEmpty().withMessage('Course ID is required').run(req);

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
        message: 'Not authorized to create lessons for this course'
      });
    }

    const lessonData = {
      ...req.body,
      course: req.body.course
    };

    // Handle video upload
    if (req.files && req.files.videoFile) {
      lessonData.videoFile = `/uploads/videos/${req.files.videoFile[0].filename}`;
    }

    // Handle material uploads
    if (req.files && req.files.materials) {
      lessonData.materials = req.files.materials.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        filePath: `/uploads/materials/${file.filename}`,
        fileType: path.extname(file.originalname),
        fileSize: file.size
      }));
    }

    const lesson = await Lesson.create(lessonData);

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/lessons/:id
// @desc    Update lesson
// @access  Private
router.put('/:id', protect, authorize('trainer', 'admin'), upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'materials', maxCount: 10 }
]), async (req, res) => {
  await body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    let lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is the trainer or admin
    if (lesson.course.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson'
      });
    }

    const updateData = { ...req.body, updatedAt: Date.now() };

    // Handle video upload - if new video is uploaded, it replaces the old one
    if (req.files && req.files.videoFile) {
      updateData.videoFile = `/uploads/videos/${req.files.videoFile[0].filename}`;
      // If a file is uploaded, we should clear any existing URL
      updateData.videoUrl = '';
    } else if (updateData.videoUrl) {
      // If a URL is provided, we should clear any existing file
      updateData.videoFile = null;
    }

    // Handle material uploads and removals
    let existingMaterials = [];
    if (req.body.existingMaterials) {
      existingMaterials = JSON.parse(req.body.existingMaterials);
    }
    let newMaterials = [];
    if (req.files && req.files.materials) {
      newMaterials = req.files.materials.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        filePath: `/uploads/materials/${file.filename}`,
        fileType: path.extname(file.originalname),
        fileSize: file.size
      }));
    }
    updateData.materials = [...existingMaterials, ...newMaterials];

    lesson = await Lesson.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/lessons/:id
// @desc    Delete lesson
// @access  Private
router.delete('/:id', protect, authorize('trainer', 'admin'), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is the trainer or admin
    if (lesson.course.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson'
      });
    }

    // Remove lesson from course
    await Course.findByIdAndUpdate(lesson.course._id, {
      $pull: { lessons: lesson._id }
    });

    await lesson.deleteOne();

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
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
