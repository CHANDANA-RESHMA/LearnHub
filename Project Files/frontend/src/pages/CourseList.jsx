import { useEffect, useState } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom'
const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchCourses = async () => {
    try {
      let url = 'http://localhost:5000/api/courses';
      const params = [];

      if (searchTerm) params.push(`search=${searchTerm}`);
      if (selectedCategory && selectedCategory !== 'All') params.push(`category=${selectedCategory}`);
      if (params.length) url += '?' + params.join('&');

      const res = await axios.get(url);
      setCourses(res.data);
      console.log("✅ Courses fetched:", res.data);
    } catch (err) {
      console.error('❌ Failed to fetch courses', err);
    }
  };

  // 🔁 Fetch when search/category changes
  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container main-container mt-4">
      <h2 className="mb-4">📚 Browse Courses</h2>

      {/* 🔍 Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by course title"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedCategory('All'); // Reset category if typing
            }}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearchTerm(''); // Reset search if category selected
            }}
          >
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="AI">AI</option>
            <option value="Data Science">Data Science</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={fetchCourses}>
            🔁 Refresh
          </button>
        </div>
      </div>

      {/* 🧾 Course List */}
      <div className="row">
        {courses.length === 0 ? (
          <p>No courses found</p>
        ) : (
          courses.map((course) => (
            <div key={course._id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{course.C_title}</h5>
                  <p className="card-text">{course.C_description}</p>
                  <p><strong>Educator:</strong> {course.C_educator}</p>
                  <p><strong>Category:</strong> {course.C_categories}</p>
                  <p><strong>Price:</strong> ₹{course.C_price}</p>
                  <p><strong>Enrolled:</strong> {course.enrolled}</p>
                  <Link to={`/course/${course._id}`} className="btn btn-primary">View Course</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseList;
