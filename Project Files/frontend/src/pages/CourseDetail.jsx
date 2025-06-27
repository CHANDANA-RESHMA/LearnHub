import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSections, setCompletedSections] = useState([]);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user || userRes.data);

        const courseRes = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(courseRes.data);

        const progressRes = await axios.get(
          `http://localhost:5000/api/courses/enrollment/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setEnrolled(progressRes.data.enrolled);
        setCompletedSections(progressRes.data.completedSections || []);
      } catch (err) {
        console.error("❌ Error loading data:", err);
        setError("❌ Course not found or unauthorized");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, token]);

  // ✅ Automatically check if course is completed when data updates
  useEffect(() => {
    if (course && completedSections) {
      const totalSections = course.courseContent?.length || 0;
      const isCompleted = completedSections.length === totalSections && totalSections > 0;
      setCompleted(isCompleted);
    }
  }, [course, completedSections]);

  const handleEnroll = async () => {
    try {
      await axios.post(`http://localhost:5000/api/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const progressRes = await axios.get(
        `http://localhost:5000/api/courses/enrollment/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(progressRes.data.enrolled);
      setCompletedSections(progressRes.data.completedSections || []);
      alert("✅ Enrolled successfully!");
    } catch (err) {
      alert("❌ Enrollment failed");
      console.error(err);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const sectionIndex = 0;

      await axios.post(
        `http://localhost:5000/api/courses/progress/${courseId}/complete`,
        { sectionIndex },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const [progressRes, courseRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/courses/enrollment/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/courses/${courseId}`),
      ]);

      setCourse(courseRes.data);
      setCompletedSections(progressRes.data.completedSections || []);
      setEnrolled(progressRes.data.enrolled);

      alert("✅ Course marked as completed!");
    } catch (err) {
      console.error('❌ Error marking complete:', err.response?.data || err.message);
      alert("❌ Failed to mark course complete");
    }
  };

  const handleDownloadCertificate = () => {
    alert("🎓 Downloading certificate... (feature simulation)");
  };

  const handleEditCourse = () => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Course deleted!');
        navigate('/courses');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  if (loading) return <div className="container mt-5">🔄 Loading...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="container main-container mt-4">
      <h2>{course.C_title}</h2>
      <p>{course.C_description}</p>
      <p><strong>Educator:</strong> {course.C_educator}</p>
      <p><strong>Category:</strong> {course.C_categories}</p>
      <p><strong>Price:</strong> ₹{course.C_price}</p>
      <p><strong>Enrolled:</strong> {course.enrolled}</p>

      {/* ✅ Student Action Buttons */}
      {user?.type === 'student' && (
        <>
          {!enrolled ? (
            <button className="btn btn-success me-2" onClick={handleEnroll}>
              Enroll Now
            </button>
          ) : (
            <button
              className="btn btn-info me-2"
              onClick={() => navigate(`/learn/${course._id}`)}
            >
              🚀 Start Learning
            </button>
          )}

          <button
            className="btn btn-warning me-2"
            onClick={handleMarkComplete}
            disabled={!enrolled || completed}
          >
            {completed ? '🎉 Completed' : '✅ Mark as Completed'}
          </button>

          {completed && (
            <button className="btn btn-primary" onClick={handleDownloadCertificate}>
              🎓 Download Certificate
            </button>
          )}
        </>
      )}

      {/* ✅ Teacher/Admin Controls */}
      {['teacher', 'admin'].includes(user?.type) && (
        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-outline-secondary" onClick={handleEditCourse}>
            ✏️ Edit Course
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(course._id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
