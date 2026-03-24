import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

// public pages
import Home from "./pages/public/Home";
import CourseDetail from "./pages/public/CourseDetail";
import Login from "./pages/public/Login";
import StudentSignup from "./pages/public/StudentSignup";
import InstructorSignup from "./pages/public/InstructorSignup";

// student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import MyEnrollments from "./pages/student/MyEnrollments";
import LearnCourse from "./pages/student/LearnCourse";
import Wishlist from "./pages/student/Wishlist";
import PaymentHistory from "./pages/student/PaymentHistory";
import StudentProfile from "./pages/student/StudentProfile";

// instructor pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import MyCourses from "./pages/instructor/MyCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import EditCourse from "./pages/instructor/EditCourse";
import ManageModules from "./pages/instructor/ManageModules";
import CourseEnrollments from "./pages/instructor/CourseEnrollments";
import InstructorProfile from "./pages/instructor/InstructorProfile";

// admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageInstructors from "./pages/admin/ManageInstructors";
import ManageCourses from "./pages/admin/ManageCourses";
import ManagePayments from "./pages/admin/ManagePayments";
import ManageReviews from "./pages/admin/ManageReviews";

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/student" element={<StudentSignup />} />
      <Route path="/signup/instructor" element={<InstructorSignup />} />

      {/* student routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/enrollments" element={<ProtectedRoute role="student"><MyEnrollments /></ProtectedRoute>} />
      <Route path="/student/learn/:id" element={<ProtectedRoute role="student"><LearnCourse /></ProtectedRoute>} />
      <Route path="/student/wishlist" element={<ProtectedRoute role="student"><Wishlist /></ProtectedRoute>} />
      <Route path="/student/payments" element={<ProtectedRoute role="student"><PaymentHistory /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

      {/* instructor routes */}
      <Route path="/instructor/dashboard" element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>} />
      <Route path="/instructor/courses" element={<ProtectedRoute role="instructor"><MyCourses /></ProtectedRoute>} />
      <Route path="/instructor/courses/create" element={<ProtectedRoute role="instructor"><CreateCourse /></ProtectedRoute>} />
      <Route path="/instructor/courses/edit/:id" element={<ProtectedRoute role="instructor"><EditCourse /></ProtectedRoute>} />
      <Route path="/instructor/courses/:id/modules" element={<ProtectedRoute role="instructor"><ManageModules /></ProtectedRoute>} />
      <Route path="/instructor/courses/:id/enrollments" element={<ProtectedRoute role="instructor"><CourseEnrollments /></ProtectedRoute>} />
      <Route path="/instructor/profile" element={<ProtectedRoute role="instructor"><InstructorProfile /></ProtectedRoute>} />

      {/* admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute role="admin"><ManageStudents /></ProtectedRoute>} />
      <Route path="/admin/instructors" element={<ProtectedRoute role="admin"><ManageInstructors /></ProtectedRoute>} />
      <Route path="/admin/courses" element={<ProtectedRoute role="admin"><ManageCourses /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute role="admin"><ManagePayments /></ProtectedRoute>} />
      <Route path="/admin/reviews" element={<ProtectedRoute role="admin"><ManageReviews /></ProtectedRoute>} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;