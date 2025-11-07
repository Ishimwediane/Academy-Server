const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    // Get statistics
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalCourses = await Course.countDocuments();
    const approvedCourses = await Course.countDocuments({ status: 'approved' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const totalCertificates = await Certificate.countDocuments();

    // Get recent activities
    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentCourses = await Course.find()
      .populate('trainer', 'name email')
      .select('title status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get course popularity (by enrollment count)
    const popularCourses = await Course.find({ status: 'approved' })
      .populate('trainer', 'name')
      .select('title category enrolledStudents ratings')
      .sort({ 'enrolledStudents': -1 })
      .limit(5);

    // Get category distribution
    const categoryStats = await Course.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          users: {
            total: totalUsers,
            students: totalStudents,
            trainers: totalTrainers
          },
          courses: {
            total: totalCourses,
            approved: approvedCourses,
            pending: pendingCourses
          },
          enrollments: {
            total: totalEnrollments,
            completed: completedEnrollments
          },
          certificates: {
            total: totalCertificates
          }
        },
        recentActivities: {
          users: recentUsers,
          courses: recentCourses
        },
        popularCourses: popularCourses,
        categoryDistribution: categoryStats
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

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const { role, isActive, search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/courses
// @desc    Get all courses with filters
// @access  Private/Admin
router.get('/courses', async (req, res) => {
  try {
    const { status, category, trainer } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (trainer) query.trainer = trainer;

    const courses = await Course.find(query)
      .populate('trainer', 'name email')
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

// @route   GET /api/admin/reports/learner-performance
// @desc    Get learner performance report
// @access  Private/Admin
router.get('/reports/learner-performance', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ status: 'completed' })
      .populate('student', 'name email')
      .populate('course', 'title category')
      .select('student course progress completedAt')
      .sort({ completedAt: -1 });

    // Calculate average progress by course
    const courseStats = await Enrollment.aggregate([
      {
        $group: {
          _id: '$course',
          avgProgress: { $avg: '$progress' },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $project: {
          courseTitle: '$course.title',
          category: '$course.category',
          avgProgress: { $round: ['$avgProgress', 2] },
          completedCount: 1,
          totalCount: 1
        }
      },
      { $sort: { avgProgress: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        completedEnrollments: enrollments,
        courseStatistics: courseStats
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

// @route   GET /api/admin/reports/course-popularity
// @desc    Get course popularity report
// @access  Private/Admin
router.get('/reports/course-popularity', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' })
      .populate('trainer', 'name email')
      .select('title category enrolledStudents ratings')
      .sort({ 'enrolledStudents': -1 });

    const courseStats = courses.map(course => ({
      id: course._id,
      title: course.title,
      category: course.category,
      enrollmentCount: course.enrolledStudents.length,
      ratingCount: course.ratings.length,
      avgRating: course.ratings.length > 0
        ? course.ratings.reduce((sum, r) => sum + r.rating, 0) / course.ratings.length
        : 0
    }));

    res.json({
      success: true,
      data: courseStats
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


























