import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentCourses, setCurrentCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [users, setUsers] = useState([]); // ✅ for admin
  const [enrollments, setEnrollments] = useState([]); // ✅ for admin
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("👤 Response from /api/users/me:", res.data); setUser(res.data.user);
        setCurrentCourses(res.data.currentCourses || []);
        setCompletedCourses(res.data.completedCourses || []);
        setMyCourses(res.data.myCourses || []);
      })
      .catch((err) => console.error('Failed to load user', err));
  }, []);

  useEffect(() => {
    if (user?.type === 'admin') {
      const fetchData = async () => {
        try {
          const userRes = await axios.get('http://localhost:5000/api/admin/overview', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(Array.isArray(userRes.data.users) ? userRes.data.users : []);

          const enrollRes = await axios.get('http://localhost:5000/api/courses/admin/enrollments', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEnrollments(Array.isArray(enrollRes.data) ? enrollRes.data : []);
        } catch (err) {
          console.error('❌ Admin data fetch error:', err);
        }
      };

      fetchData();
    }
  }, [user, token]);

  if (!user) return <p className="text-center mt-5">🔄 Loading dashboard...</p>;
  return (
    <div className="container main-container mt-4">
      <div className="card shadow-lg p-4 mb-4">
        <h2 className="mb-3">👋 Welcome, {user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>

        <p><strong>Role:</strong> {user?.type}</p>
      </div>

      {/* 🎓 Student View */}
      {user?.type === 'student' && (
        <div>
          {/* ✅ Enrolled Courses */}
          <div className="card border-success mb-4">
            <div className="card-header bg-success text-white">📚 Enrolled Courses</div>
            <div className="card-body">
              {Array.isArray(currentCourses) && currentCourses?.filter(Boolean).length === 0 ? (
                <p>No enrolled courses yet.</p>
              ) : (
                Array.isArray(currentCourses) && currentCourses.filter(Boolean).map((course) => (
                  <div key={course._id} className="card p-3 mb-3">
                    <h5>{course.C_title}</h5>
                    <p>{course.C_description}</p>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/learn/${course._id}`)}
                    >
                      🚀 Start Learning
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ✅ Completed Courses */}
          <div className="card border-info mb-4">
            <div className="card-header bg-info text-white">✅ Completed Courses</div>
            <ul className="list-group list-group-flush">
              {completedCourses?.length > 0 ? (
                completedCourses.map((course) => (
                  <li key={course._id} className="list-group-item">
                    {course.C_title}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No completed courses</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* 👨‍🏫 Teacher View */}
      {user?.type === 'teacher' && (
        <div>
          <h4>📚 Your Created Courses</h4>
          <ul className="list-group mt-3">
            {myCourses?.length > 0 ? (
              myCourses.map((course) => (
                <li
                  key={course._id}
                  className="list-group-item d-flex justify-content-between"
                >
                  {course.C_title}
                  <span className="badge bg-primary">{course.enrolled.length} Enrolled</span>
                </li>
              ))
            ) : (
              <li className="list-group-item">No courses created yet</li>
            )}
          </ul>
        </div>
      )}

      {/* 🛠️ Admin View */}
      {user?.type === 'admin' && (
        <div className="card shadow-sm p-4">
          <h2>🛠️ Admin Dashboard</h2>
          {/* <ul className="list-group list-group-flush mt-3">
            <li className="list-group-item">Manage all users (students + teachers)</li>
            <li className="list-group-item">Delete or edit any course</li>
            <li className="list-group-item">Monitor enrollments and system health</li>
          </ul> */}
          <div className="container mt-4">

            {/* 👥 All Users Table */}
            <h4 className="mt-4">👥 All Users</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 📋 Enrollments Table */}
            <h4 className="mt-5">📋 Enrollments</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Enrolled Course</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.filter(enrollment =>enrollment.course && enrollment.user).map((enrollment) => (
                  <tr key={enrollment._id}>
                    <td>{enrollment.user?.name}</td>
                    <td>{enrollment.user?.email}</td>
                    <td>{enrollment.course?.C_title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          


        </div>
      )}
    </div>
  );
};


export default Dashboard;
