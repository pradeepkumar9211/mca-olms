import api from "./axios";

export const enrollCourse = (data) => api.post("/api/student/enroll", data);
export const getMyEnrollments = () => api.get("/api/student/enrollments");
export const getEnrolledModules = (id) =>
  api.get(`/api/student/courses/${id}/modules`);
