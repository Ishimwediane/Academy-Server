const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quizzes/course/:courseId
// @desc    Get all quizzes for a course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId })
      .populate('lesson', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'title trainer')
      .populate('lesson', 'title');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/quizzes
// @desc    Create a new quiz (Trainer/Admin only)
// @access  Private
router.post('/', protect, authorize('trainer', 'admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('course').notEmpty().withMessage('Course ID is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.question').trim().notEmpty().withMessage('Question text is required'),
  body('questions.*.options').isArray({ min: 2 }).withMessage('At least 2 options are required'),
  body('questions.*.correctAnswer').isInt({ min: 0 }).withMessage('Correct answer index is required')
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
        message: 'Not authorized to create quizzes for this course'
      });
    }

    // Calculate max score
    const maxScore = req.body.questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const quiz = await Quiz.create({
      ...req.body,
      course: req.body.course,
      maxScore: req.body.maxScore || maxScore
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers (Student only)
// @access  Private
router.post('/:id/submit', protect, [
  body('answers').isArray().withMessage('Answers array is required'),
  body('answers.*.questionIndex').isInt({ min: 0 }).withMessage('Question index is required'),
  body('answers.*.selectedAnswer').isInt({ min: 0 }).withMessage('Selected answer index is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Grade the quiz
    let score = 0;
    const gradedAnswers = req.body.answers.map(answer => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      const points = isCorrect ? (question.points || 1) : 0;
      score += points;

      return {
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: isCorrect,
        points: points
      };
    });

    const percentage = Math.round((score / quiz.maxScore) * 100);

    // Save attempt
    quiz.attempts.push({
      student: req.user._id,
      answers: gradedAnswers,
      score: score,
      percentage: percentage,
      completedAt: Date.now()
    });

    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score: score,
        maxScore: quiz.maxScore,
        percentage: percentage,
        answers: gradedAnswers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/quizzes/:id
// @desc    Update quiz
// @access  Private
router.put('/:id', protect, authorize('trainer', 'admin'), async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id).populate('course');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user is the trainer or admin
    if (quiz.course.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this quiz'
      });
    }

    // Recalculate max score if questions changed
    if (req.body.questions) {
      const maxScore = req.body.questions.reduce((sum, q) => sum + (q.points || 1), 0);
      req.body.maxScore = maxScore;
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, {
      ...req.body,
      updatedAt: Date.now()
    }, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete quiz
// @access  Private
router.delete('/:id', protect, authorize('trainer', 'admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if user is the trainer or admin
    if (quiz.course.trainer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quiz'
      });
    }

    await quiz.deleteOne();

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
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






































