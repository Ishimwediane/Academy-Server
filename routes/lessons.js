const express = require('express');
const { body, validationResult } = require('express-validator');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === 'video') {
      uploadPath = path.join(__dirname, '../uploads/videos');
    } else if (file.fieldname === 'material') {
      uploadPath = path.join(__dirname, '../uploads/materials');
    } else {
      uploadPath = path.join(__dirname, '../uploads');
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
  { name: 'video', maxCount: 1 },
  { name: 'material', maxCount: 10 }
]), [
  body('title').trim().notEmpty().withMessage('Title is required'),
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
        message: 'Not authorized to create lessons for this course'
      });
    }

    const lessonData = {
      ...req.body,
      course: req.body.course
    };

    // Handle video upload
    if (req.files && req.files.video) {
      lessonData.videoFile = `/uploads/videos/${req.files.video[0].filename}`;
    }

    // Handle material uploads
    if (req.files && req.files.material) {
      lessonData.materials = req.files.material.map(file => ({
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
  { name: 'video', maxCount: 1 },
  { name: 'material', maxCount: 10 }
]), async (req, res) => {
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

    // Handle video upload
    if (req.files && req.files.video) {
      updateData.videoFile = `/uploads/videos/${req.files.video[0].filename}`;
    }

    // Handle material uploads
    if (req.files && req.files.material) {
      const newMaterials = req.files.material.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        filePath: `/uploads/materials/${file.filename}`,
        fileType: path.extname(file.originalname),
        fileSize: file.size
      }));
      updateData.materials = [...(lesson.materials || []), ...newMaterials];
    }

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



const { body, validationResult } = require('express-validator');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === 'video') {
      uploadPath = path.join(__dirname, '../uploads/videos');
    } else if (file.fieldname === 'material') {
      uploadPath = path.join(__dirname, '../uploads/materials');
    } else {
      uploadPath = path.join(__dirname, '../uploads');
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
  { name: 'video', maxCount: 1 },
  { name: 'material', maxCount: 10 }
]), [
  body('title').trim().notEmpty().withMessage('Title is required'),
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
        message: 'Not authorized to create lessons for this course'
      });
    }

    const lessonData = {
      ...req.body,
      course: req.body.course
    };

    // Handle video upload
    if (req.files && req.files.video) {
      lessonData.videoFile = `/uploads/videos/${req.files.video[0].filename}`;
    }

    // Handle material uploads
    if (req.files && req.files.material) {
      lessonData.materials = req.files.material.map(file => ({
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
  { name: 'video', maxCount: 1 },
  { name: 'material', maxCount: 10 }
]), async (req, res) => {
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

    // Handle video upload
    if (req.files && req.files.video) {
      updateData.videoFile = `/uploads/videos/${req.files.video[0].filename}`;
    }

    // Handle material uploads
    if (req.files && req.files.material) {
      const newMaterials = req.files.material.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        filePath: `/uploads/materials/${file.filename}`,
        fileType: path.extname(file.originalname),
        fileSize: file.size
      }));
      updateData.materials = [...(lesson.materials || []), ...newMaterials];
    }

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



const { body, validationResult } = require('express-validator');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (file.fieldname === 'video') {
      uploadPath = path.join(__dirname, '../uploads/videos');
    } else if (file.fieldname === 'material') {
      uploadPath = path.join(__dirname, '../uploads/materials');
    } else {
      uploadPath = path.join(__dirname, '../uploads');
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
  { name: 'video', maxCount: 1 },
  { name: 'material', maxCount: 10 }
]), [
  body('title').trim().notEmpty().withMessage('Title is required'),
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
        message: 'Not authorized to create lessons for this course'
      });
    }

    const lessonData = {
      ...req.body,
      course: req.body.course
    };

    // Handle video upload
    if (req.files && req.files.video) {
      lessonData.videoFile = `/uploads/videos/${req.files.video[0].filename}`;
    }

    // Handle material uploads
    if (req.files && req.files.material) {
      lessonData.materials = req.files.material.map(file => ({
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
  { name: 'video', maxCount: 1 },
  { name: 'material', maxCount: 10 }
]), async (req, res) => {
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

    // Handle video upload
    if (req.files && req.files.video) {
      updateData.videoFile = `/uploads/videos/${req.files.video[0].filename}`;
    }

    // Handle material uploads
    if (req.files && req.files.material) {
      const newMaterials = req.files.material.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        filePath: `/uploads/materials/${file.filename}`,
        fileType: path.extname(file.originalname),
        fileSize: file.size
      }));
      updateData.materials = [...(lesson.materials || []), ...newMaterials];
    }

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






