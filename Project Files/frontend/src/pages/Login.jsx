import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
  
      // ✅ Store token and user
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
  
      alert(`Welcome, ${res.data.user.name}`);
  
      // ✅ Reload or Redirect
      window.location.href = '/dashboard'; // OR use useNavigate if preferred
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login to LearnHub</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
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

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              <p className="text-center mt-3">
                Don't have an account? <a href="/signup">Signup here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
