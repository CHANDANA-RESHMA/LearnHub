import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    type: 'student',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', form);

      // ✅ Store token and optionally user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // optional

      alert(`✅ Welcome, ${res.data.user.name}!`);
      
      // ✅ Navigate to homepage
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || '❌ Signup failed');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Signup for LearnHub</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">User Type</label>
                  <select
                    name="type"
                    className="form-select"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Sign Up
                </button>
              </form>

              <p className="text-center mt-3">
                Already have an account? <a href="/login">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
