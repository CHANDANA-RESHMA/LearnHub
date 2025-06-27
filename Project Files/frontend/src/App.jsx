import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import CreateCourse from './pages/CreateCourse';
import AdminPanel from './pages/AdminPanel';
import EditCourse from './pages/EditCourse';
import CourseContent from './pages/CourseContent';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="container appContainer">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/edit-course/:courseId" element={<EditCourse />} />
          {/* ✅ Only use this clean route for learning */}
          <Route path="/learn/:courseId" element={<CourseContent />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
