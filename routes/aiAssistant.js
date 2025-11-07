const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Simple AI assistant responses (in production, integrate with OpenAI or similar)
const getAIResponse = (message, user, courses, enrollments) => {
  const lowerMessage = message.toLowerCase();

  // Greeting
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Hello ${user.name}! How can I help you with your learning today?`;
  }

  // Course search
  if (lowerMessage.includes('course') || lowerMessage.includes('learn')) {
    if (courses.length === 0) {
      return "I don't see any available courses for you. Would you like me to recommend some popular categories?";
    }
    const courseList = courses.slice(0, 5).map(c => `- ${c.title} (${c.category})`).join('\n');
    return `Here are some courses you might be interested in:\n${courseList}\n\nWould you like to know more about any specific course?`;
  }

  // Recommendations based on enrollments
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    if (enrollments.length === 0) {
      return "You haven't enrolled in any courses yet. I recommend starting with courses in Digital Tools or Business Management based on popular choices.";
    }

    const enrolledCategories = enrollments.map(e => e.course?.category).filter(Boolean);
    const categoryCounts = {};
    enrolledCategories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const topCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0];
    
    const recommendations = courses.filter(c => 
      c.category === topCategory && !enrollments.some(e => e.course?._id?.toString() === c._id.toString())
    ).slice(0, 3);

    if (recommendations.length > 0) {
      const recList = recommendations.map(c => `- ${c.title}`).join('\n');
      return `Based on your interest in ${topCategory}, I recommend:\n${recList}`;
    }

    return "Based on your learning history, I recommend exploring new categories to broaden your skills.";
  }

  // Progress
  if (lowerMessage.includes('progress') || lowerMessage.includes('how am i doing')) {
    if (enrollments.length === 0) {
      return "You haven't enrolled in any courses yet. Start your learning journey by enrolling in a course!";
    }

    const completedCount = enrollments.filter(e => e.status === 'completed').length;
    const inProgressCount = enrollments.filter(e => e.status === 'in-progress').length;
    
    return `Great progress! You've completed ${completedCount} course(s) and have ${inProgressCount} course(s) in progress. Keep up the excellent work!`;
  }

  // Help
  if (lowerMessage.includes('help')) {
    return `I can help you with:
- Finding courses
- Course recommendations based on your interests
- Checking your learning progress
- Answering questions about the platform

What would you like to know?`;
  }

  // Default response
  return "I'm here to help you with your learning journey! You can ask me about courses, recommendations, or your progress. How can I assist you?";
};

// @route   POST /api/ai-assistant/chat
// @desc    Chat with AI assistant
// @access  Private
router.post('/chat', protect, [
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { message } = req.body;

    // Get user's enrollments
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title category');

    // Get available courses
    const courses = await Course.find({ status: 'approved' })
      .select('title category description')
      .limit(20);

    // Get AI response
    const response = getAIResponse(message, req.user, courses, enrollments);

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date()
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

// @route   GET /api/ai-assistant/recommendations
// @desc    Get course recommendations based on user's learning history
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    // Get user's enrollments
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'category');

    // Analyze user preferences
    const categoryCounts = {};
    enrollments.forEach(enrollment => {
      const category = enrollment.course?.category;
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    // Get top categories
    const topCategories = Object.keys(categoryCounts)
      .sort((a, b) => categoryCounts[b] - categoryCounts[a])
      .slice(0, 3);

    // Get enrolled course IDs to exclude
    const enrolledCourseIds = enrollments.map(e => e.course?._id).filter(Boolean);

    // Find recommended courses
    let recommendations = [];
    if (topCategories.length > 0) {
      recommendations = await Course.find({
        category: { $in: topCategories },
        status: 'approved',
        _id: { $nin: enrolledCourseIds }
      })
        .populate('trainer', 'name')
        .limit(6)
        .sort({ 'enrolledStudents': -1 });
    } else {
      // If no enrollments, recommend popular courses
      recommendations = await Course.find({
        status: 'approved',
        _id: { $nin: enrolledCourseIds }
      })
        .populate('trainer', 'name')
        .limit(6)
        .sort({ 'enrolledStudents': -1 });
    }

    res.json({
      success: true,
      data: {
        recommendations: recommendations,
        basedOn: topCategories.length > 0 ? `your interest in ${topCategories.join(', ')}` : 'popular courses'
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


























