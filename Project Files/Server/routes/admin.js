const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const User = require('../models/User');
const Course = require('../models/Course');

// GET /api/admin/overview
router.get('/overview', auth, async (req, res) => {
  try {
    // Admin only check
    if (req.user.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find().select('-password');
    const courses = await Course.find().populate('userID', 'name email');

    res.json({ users, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Admin fetch failed' });
  }
});

module.exports = router;
