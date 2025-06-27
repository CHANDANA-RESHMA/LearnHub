import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    C_title: '',
    C_description: '',
    C_categories: '',
    C_price: '',
    sections: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Load existing course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) {
          setError('❌ Invalid course ID');
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        const course = res.data;

        setFormData({
          C_title: course.C_title || '',
          C_description: course.C_description || '',
          C_categories: course.C_categories || '',
          C_price: course.C_price || '',
          sections: course.sections || []
        });
      } catch (err) {
        console.error("Failed to load course:", err);
        setError("❌ Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!token) {
      alert("❌ Please login to continue.");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/courses/${courseId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      console.log("✅ Update response:", response.data);
      alert('✅ Course updated successfully!');
      navigate(`/course/${courseId}`);
    } catch (err) {
      if (err.response) {
        // Detailed server error (403, 404, 500, etc.)
        console.error("❌ Update failed:", err.response.data);
        alert(`❌ Failed to update: ${err.response.data.message || 'Server error'}`);
      } else {
        console.error("❌ Unexpected error:", err.message);
        alert('❌ Failed to update course');
      }
    }
  };
  

  if (loading) return <div className="container main-container">🔄 Loading...</div>;
  if (error) return <div className="container main-container text-danger">{error}</div>;

  return (
    <div className="container main-container mt-4">
      <h2>✏️ Edit Course</h2>

      <div className="mb-3">
        <label className="form-label">Course Title</label>
        <input
          type="text"
          className="form-control"
          name="C_title"
          value={formData.C_title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="C_description"
          rows="3"
          value={formData.C_description}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          name="C_categories"
          value={formData.C_categories}
          onChange={handleChange}
          required
        >
          <option value="">-- Select --</option>
          <option value="Web Development">Web Development</option>
          <option value="AI">AI</option>
          <option value="Data Science">Data Science</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Price (₹)</label>
        <input
          type="number"
          className="form-control"
          name="C_price"
          value={formData.C_price}
          onChange={handleChange}
          required
        />
      </div>

      {/* ✅ Future enhancement: Section editing can go here */}

      <button className="btn btn-primary" onClick={handleUpdate}>
        💾 Update Course
      </button>
    </div>
  );
};

export default EditCourse;
