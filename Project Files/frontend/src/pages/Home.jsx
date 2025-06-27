import { Link } from 'react-router-dom';
import './Home.css'; // 👈 Create this CSS file for background styling

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      {/* Hero Section with Background */}
      <div className="hero-section text-white d-flex flex-column justify-content-center align-items-center text-center py-5">
        <div className="overlay"></div>
        <div className="z-1 position-relative p-5">
          <h1 className="display-4 fw-bold">Welcome to LearnHub 🎓</h1>
          <p className="lead">
            Your Center for Skill Enhancement. Learn from the best instructors online at your pace.
          </p>
          <div className="mt-4">
            {!user && (
              <>
                <Link to="/login" className="btn btn-primary mx-2">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline-light mx-2">
                  Sign Up
                </Link>
              </>
            )}
            <Link to="/courses" className="btn btn-info text-white mx-2">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📚 Interactive Courses</h5>
                <p className="card-text">
                  Browse a wide variety of skill-building courses with practical projects.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">👨‍🏫 Expert Instructors</h5>
                <p className="card-text">
                  Learn from professionals and educators with real-world experience.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">🏆 Earn Certificates</h5>
                <p className="card-text">
                  Get certified after course completion to showcase your skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <small>© {new Date().getFullYear()} LearnHub. All rights reserved.</small>
      </footer>
    </div>
  );
};

export default Home;
