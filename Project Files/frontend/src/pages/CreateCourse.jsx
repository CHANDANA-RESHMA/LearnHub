import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    C_title: '',
    C_description: '',
    C_categories: '',
    C_price: '',
    courseContent: [],
  });

  const [sectionInput, setSectionInput] = useState({
    sectionTitle: '',
    sectionDescription: '',
    resources: [{ title: '', url: '' }],
  });

  const handleCourseChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSectionChange = (e) => {
    setSectionInput({ ...sectionInput, [e.target.name]: e.target.value });
  };

  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...sectionInput.resources];
    updatedResources[index][field] = value;
    setSectionInput({ ...sectionInput, resources: updatedResources });
  };

  const addResourceField = () => {
    setSectionInput({
      ...sectionInput,
      resources: [...sectionInput.resources, { title: '', url: '' }],
    });
  };

  const addSection = () => {
    setForm({
      ...form,
      courseContent: [...form.courseContent, sectionInput],
    });
    setSectionInput({ sectionTitle: '', sectionDescription: '', resources: [{ title: '', url: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/courses',
        {
          ...form,
          C_price: parseFloat(form.C_price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('✅ Course created successfully!');
      navigate('/courses');
    } catch (err) {
      console.error('Course creation failed:', err);
      alert(err.response?.data?.message || '❌ Failed to create course');
    }
  };

  return (
    <div className="container main-container mt-4">
      <h2>Create a New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Course Title</label>
          <input
            type="text"
            name="C_title"
            className="form-control"
            onChange={handleCourseChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="C_description"
            className="form-control"
            onChange={handleCourseChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="C_categories"
            className="form-control"
            onChange={handleCourseChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            name="C_price"
            className="form-control"
            onChange={handleCourseChange}
            required
          />
        </div>

        <hr />
        <h4>Add Section</h4>
        <div className="mb-2">
          <input
            type="text"
            name="sectionTitle"
            placeholder="Section Title"
            className="form-control mb-2"
            value={sectionInput.sectionTitle}
            onChange={handleSectionChange}
          />
          <textarea
            name="sectionDescription"
            placeholder="Section Description"
            className="form-control mb-2"
            value={sectionInput.sectionDescription}
            onChange={handleSectionChange}
          ></textarea>
          <h6>Resources:</h6>
          {sectionInput.resources.map((resource, idx) => (
            <div key={idx} className="d-flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Resource Title"
                className="form-control"
                value={resource.title}
                onChange={(e) => handleResourceChange(idx, 'title', e.target.value)}
              />
              <input
                type="text"
                placeholder="Resource URL"
                className="form-control"
                value={resource.url}
                onChange={(e) => handleResourceChange(idx, 'url', e.target.value)}
              />
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-secondary me-2" onClick={addResourceField}>
            ➕ Add Resource
          </button>
          <button type="button" className="btn btn-sm btn-primary" onClick={addSection}>
            ➕ Add Section
          </button>
        </div>

        <button type="submit" className="btn btn-success mt-3">
          ✅ Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
