const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
// GET /api/users/me
// ✅ GET current user info (with enrolled + completed courses)
// routes/users.js
router.get('/me', auth, async (req, res) => {
  try {
    console.log("🧪 Authenticated user:", req.user); // Add this line

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const response = { user
     };

    // Student-specific dashboard logic
    if (user.type === 'student') {
      const progresses = await Progress.find({ user: user._id }).populate('course');

      const currentCourses = progresses
      .filter(p => {
        const course = p.course;
        if (!course || !Array.isArray(course.courseContent)) return false;
        const totalSections = course.courseContent.length;
        const uniqueCompleted = [...new Set(p.completedSections.map(Number))];
        return totalSections > 0 && uniqueCompleted.length < totalSections;
      })
        .map(p => p.course);

      const completedCourses = progresses
      .filter(p => {
        const course = p.course;
        if (!course || !Array.isArray(course.courseContent)) return false;
        const totalSections = course.courseContent.length;
        const uniqueCompleted = [...new Set(p.completedSections.map(Number))];
        return totalSections > 0 && uniqueCompleted.length === totalSections;
      })
        .map(p => p.course);

      response.currentCourses = currentCourses;
      response.completedCourses = completedCourses;
    }

    // Teacher-specific dashboard logic
    if (user.type === 'teacher') {
      const myCourses = await Course.find({ userID: user._id });
      response.myCourses = myCourses;
    }

    // Admin could get everything, if needed
    if (user.type === 'admin') {
      response.message = 'Admin access granted';
    }

    res.json(response);
  } catch (err) {
    console.error('❌ Error fetching user profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
