const express = require('express');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const Enrollment = require('../models/Enrollment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/assessments/student/:studentId
// @desc    Get all assessments for a student
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    // Check if user is accessing their own data or is admin/trainer
    if (req.params.studentId !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'trainer') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const enrollments = await Enrollment.find({ student: req.params.studentId })
      .populate('course', 'title');

    const courseIds = enrollments.map(e => e.course._id);

    // Get quizzes and assignments for enrolled courses
    const quizzes = await Quiz.find({ course: { $in: courseIds } })
      .populate('course', 'title')
      .select('title course attempts maxScore');

    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('course', 'title')
      .select('title course submissions maxScore');

    // Filter to show only student's attempts/submissions
    const studentQuizzes = quizzes.map(quiz => {
      const attempt = quiz.attempts.find(a => a.student.toString() === req.params.studentId);
      return {
        id: quiz._id,
        title: quiz.title,
        course: quiz.course.title,
        type: 'quiz',
        maxScore: quiz.maxScore,
        score: attempt ? attempt.score : null,
        percentage: attempt ? attempt.percentage : null,
        completedAt: attempt ? attempt.completedAt : null
      };
    });

    const studentAssignments = assignments.map(assignment => {
      const submission = assignment.submissions.find(s => s.student.toString() === req.params.studentId);
      return {
        id: assignment._id,
        title: assignment.title,
        course: assignment.course.title,
        type: 'assignment',
        maxScore: assignment.maxScore,
        score: submission ? submission.score : null,
        feedback: submission ? submission.feedback : null,
        submittedAt: submission ? submission.submittedAt : null,
        gradedAt: submission ? submission.gradedAt : null
      };
    });

    res.json({
      success: true,
      data: {
        quizzes: studentQuizzes,
        assignments: studentAssignments
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

// @route   GET /api/assessments/course/:courseId
// @desc    Get all assessments for a course (Trainer/Admin only)
// @access  Private
router.get('/course/:courseId', protect, authorize('trainer', 'admin'), async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId })
      .populate('attempts.student', 'name email');

    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('submissions.student', 'name email');

    res.json({
      success: true,
      data: {
        quizzes: quizzes,
        assignments: assignments
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

module.exports = router;


