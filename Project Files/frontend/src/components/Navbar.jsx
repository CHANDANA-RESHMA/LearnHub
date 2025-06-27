import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // { name, email, type }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 fixed-top">
      <Link className="navbar-brand" to="/">LearnHub</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">

          {/* Common link */}
          <li className="nav-item">
            <Link className="nav-link" to="/courses">Courses</Link>
          </li>

          {/* 👨‍🏫 Teacher only */}
          {user?.type === 'teacher' && (
            <li className="nav-item">
              <Link className="nav-link" to="/create-course">Create Course</Link>
            </li>
          )}

        

          {/* ✅ Logged-in users */}
          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">{user.type === 'admin' ? 'AdminDashboard' : 'Dashboard'}</Link>
              </li>
              <li className="nav-item" style={{display: 'flex',alignItems:'center'}}>
                <button className="btn btn-sm btn-outline-light ms-2"
 onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}

          {/* 🔓 Not logged-in users */}
          {!user && (
            <>
              <li className="nav-item">
                <Link className="btn btn-primary me-2" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-success" to="/signup">Sign Up</Link>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
