import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseContent = () => {
  const { id, courseId } = useParams();  // Handles both :id and :courseId
  const resolvedCourseId = id || courseId;

  const [course, setCourse] = useState(null);
  const [completedSections, setCompletedSections] = useState([]); // ✅ Track completed sections
  const [enrolled, setEnrolled] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${resolvedCourseId}`);
        setCourse(res.data);
        console.log("✅ Loaded course:", res.data);
      } catch (err) {
        console.error('❌ Error fetching course:', err);
      }
    };

    const checkEnrollment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/enrollment/${resolvedCourseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEnrolled(res.data.enrolled);
        setCompletedSections(res.data.completedSections || []); // ✅ Get completed sections
      } catch (err) {
        console.error('❌ Enrollment check failed:', err);
        navigate('/login');
      }
    };

    fetchCourse();
    checkEnrollment();
  }, [resolvedCourseId, token, navigate]);

  const markComplete = async (sectionIndex) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/courses/progress/${resolvedCourseId}/complete`,
        { sectionIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedSections(res.data.progress.completedSections); // ✅ Update state from server
    } catch (err) {
      console.error('❌ Error marking section complete:', err);
    }
  };

  if (!course) return <p>Loading course...</p>;
  if (!enrolled) return <p>You are not enrolled in this course.</p>;

  return (
    <div className="container main-container mt-4">
      <h2>{course.C_title}</h2>
      <p className="text-muted">By {course.C_educator}</p>
      <p>{course.C_description}</p>

      <h4 className="mt-4">Course Sections</h4>
      {course.courseContent?.map((section, index) => (
        <div key={index} className="card mb-3 p-3">
          <h5>{section.sectionTitle}</h5>
          <p>{section.sectionDescription}</p>

          {section.resources?.map((res, i) => (
            <p key={i}>
              <a href={res.url} style={{ textDecoration: 'none', color: 'black' }} target="_blank" rel="noreferrer">
                📺 {res.title}
              </a>
            </p>
          ))}

          <button
            className={`btn btn-${completedSections.includes(index) ? 'secondary' : 'success'} mt-2`}
            onClick={() => markComplete(index)}
            disabled={completedSections.map(String).includes(index.toString())} // ✅ Check by index
          >
            {completedSections.map(String).includes(index.toString()) ? '✅ Completed' : 'Mark as Complete'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CourseContent;
