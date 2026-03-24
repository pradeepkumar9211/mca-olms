import api from "./axios";

export const getStudentDashboard = () => api.get("/api/student/dashboard");
export const getInstructorDashboard = () =>
  api.get("/api/instructor/dashboard");
export const updateStudentProfile = (data) =>
  api.put("/api/student/profile", data);
export const updateInstructorProfile = (data) =>
  api.put("/api/instructor/profile", data);
