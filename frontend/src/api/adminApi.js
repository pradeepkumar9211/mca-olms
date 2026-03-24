import api from "./axios";

export const getAdminDashboard = () => api.get("/api/admin/dashboard");
export const getAllStudents = () => api.get("/api/admin/students");
export const deleteStudent = (id) => api.delete(`/api/admin/students/${id}`);
export const getAllInstructors = () => api.get("/api/admin/instructors");
export const toggleInstructorVerify = (id) =>
  api.patch(`/api/admin/instructors/${id}/verify`);
export const deleteInstructor = (id) =>
  api.delete(`/api/admin/instructors/${id}`);
export const getAllCoursesAdmin = () => api.get("/api/admin/courses");
export const toggleCourseApproval = (id) =>
  api.patch(`/api/admin/courses/${id}/approve`);
export const getAllPaymentsAdmin = () => api.get("/api/admin/payments");
export const deleteReviewAdmin = (id) => api.delete(`/api/admin/reviews/${id}`);
