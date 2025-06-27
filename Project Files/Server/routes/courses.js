const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// ✅ Fix Educator Names (Utility route)
router.get('/fix-educators', async (req, res) => {
  try {
    const courses = await Course.find({ C_educator: { $exists: false } });
    for (let course of courses) {
      const user = await User.findById(course.userID);
      if (user) {
        course.C_educator = user.name;
        await course.save();
      }
    }
    res.send('✅ Educator names updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error while fixing educator names');
  }
});

// ✅ Get enrolled courses for student (Dashboard)
router.get('/enrolled', auth, async (req, res) => {
  try {
    if (req.user.type !== 'student') {
      return res.status(403).json({ message: 'Only students can view enrolled courses' });
    }

    const progresses = await Progress.find({ user: req.user.userId }).populate('course');
    const enrolledCourses = progresses.map((p) => {
      return {
        ...p.course._doc,
        isCourseCompleted: p.completedSections.length === p.course.courseContent.length
      };
    });

    res.json(enrolledCourses);
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
});

// ✅ Check enrollment and progress
// ✅ Check enrollment and completion status
router.get('/enrollment/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const progress = await Progress.findOne({
      user: req.user.userId,
      course: req.params.courseId,
    });

    const enrolled = !!progress;
    const completed = progress?.completedSections?.includes('all') || false;

    res.json({ enrolled, completed, completedSections: progress?.completedSections || [],});
  } catch (err) {
    console.error('Error checking enrollment:', err);
    res.status(500).json({ message: 'Server error during enrollment check' });
  }
});

// ✅ Mark section complete
router.post('/progress/:courseId/complete', auth, async (req, res) => {
  try {

    const { sectionIndex } = req.body;
    const courseId = req.params.courseId;
const userId = req.user.userId;
   
    // const courseId = req.params.courseId;
    // const userId = req.user.userId;
    if (!sectionIndex && sectionIndex !== 0) {
      return res.status(400).json({ message: 'Section index is required' });
    }
    let progress = await Progress.findOne({ user: req.user.userId, course: req.params.courseId });

    if (!progress) {
      progress = new Progress({ user: req.user.userId, course: req.params.courseId, completedSections: [sectionIndex] });
    } else {
      // ✅ Fix: ensure completedSections is always an array
      if (!Array.isArray(progress.completedSections)) {
        progress.completedSections = [];
      }
    const existing = progress.completedSections.map(String);
    if (!existing.includes(sectionIndex.toString())) {
      progress.completedSections.push(sectionIndex);
    }
  }

    await progress.save();
// ✅ Now check if all sections are done
const course = await Course.findById(courseId);
const totalSections = course.courseContent.length;
const uniqueCompleted = [...new Set(progress.completedSections)];
const isFullyCompleted = uniqueCompleted.length === totalSections;

if (isFullyCompleted) {
  const user = await User.findById(userId);
  if (!user.completedCourses?.includes(courseId)) {
    user.completedCourses = user.completedCourses || [];
    user.completedCourses.push(courseId);
    await user.save();
    console.log("🎉 Course marked completed for user");
  }
}
    res.json({ message: '✅ Section marked complete', progress });
  } catch (err) {
    console.error('Progress update failed:', err);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

// ✅ Create a course (Teacher only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.type !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create courses' });
    }

    const newCourse = new Course({
      ...req.body,
      userID: req.user.userId,
      C_educator: req.user.name,
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created', course: newCourse });
  } catch (err) {
    console.error('❌ Course creation error:', err);
    res.status(500).json({ message: 'Course creation failed', error: err.message });
  }
});

// ✅ Search/filter courses
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.C_title = { $regex: search, $options: 'i' };
    } else if (category && category !== 'All') {
      filter.C_categories = { $regex: category, $options: 'i' };
    }

    const courses = await Course.find(filter);
    res.json(courses);
  } catch (err) {
    console.error('❌ Error fetching courses:', err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

// ✅ Enroll in course (Student only)
router.post('/:id/enroll', auth, async (req, res) => {
  if (req.user.type !== 'student') {
    return res.status(403).json({ message: 'Only students can enroll' });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existingProgress = await Progress.findOne({ user: req.user.userId, course: req.params.id });
    if (!existingProgress) {
      await new Progress({ user: req.user.userId, course: req.params.id, completedSections: [] }).save();
    }

    course.enrolled += 1;
    await course.save();

    res.json({ message: 'Enrollment successful', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Enrollment failed' });
  }
});

// ✅ Mark entire course as complete (Student only)

// ✅ Mark entire course as complete (Student only)
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.type !== 'student') {
      return res.status(403).json({ message: 'Only students can complete courses' });
    }

    // ✅ Update Progress document
    let progress = await Progress.findOne({ user: req.user.userId, course: course._id });

    if (!progress) {
      // If progress record doesn't exist, create one
      const totalSections = course.courseContent.length;
      const sectionIndexes = Array.from({ length: totalSections }, (_, i) => i); // [0, 1, 2, ...]
      
      progress = new Progress({
        user: req.user.userId,
        course: course._id,
        completedSections: sectionIndexes, // ✅ Correct: array of numbers
      });
    } else {
      // If progress exists, mark as complete
      if (!progress.completedSections.includes('all')) {
        progress.completedSections.push('all');
      }
    }

    await progress.save();

    res.json({ message: '✅ Course marked as completed', progress });
  } catch (err) {
    console.error('❌ Error marking course as complete:', err.message,err.stack);
    res.status(500).json({ message: 'Server error during completion' ,error:err.message});
  }
});



// ✅ Get teacher's created courses
router.get('/my-courses', auth, async (req, res) => {
  if (req.user.type !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can view their courses' });
  }

  try {
    const courses = await Course.find({ userID: req.user.userId });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch teacher courses' });
  }
});

// ✅ Update a course (teacher or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.type !== 'admin' && course.userID.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    Object.assign(course, req.body);
    await course.save();

    res.json({ message: '✅ Course updated', course });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete course (admin or course owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.type !== 'admin' && course.userID.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    res.json({ message: '✅ Course deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

// ✅ Get course by ID (last route)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// View all users (admin only)
router.get('/admin/users', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Only admins can view users' });

  try {
    const users = await User.find().select('-password'); // Hide password
    res.json(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get all enrollments across courses (admin only)
router.get('/admin/enrollments', auth, async (req, res) => {
  if (req.user.type !== 'admin') return res.status(403).json({ message: 'Only admins can view enrollments' });

  try {
    const enrollments = await Progress.find().populate('user', 'name email').populate('course', 'C_title');

  } catch (err) {
    console.error('Enrollment fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
