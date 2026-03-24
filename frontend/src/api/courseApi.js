import api from "./axios";

export const getAllCourses = (params) => api.get("/api/courses", { params });
export const getCourseById = (id) => api.get(`/api/courses/${id}`);
export const getCoursesByCategory = (id) =>
  api.get(`/api/courses/category/${id}`);
export const getInstructorCourses = () =>
  api.get("/api/courses/instructor/my-courses");
export const createCourse = (data) => api.post("/api/courses", data);
export const updateCourse = (id, data) => api.put(`/api/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/api/courses/${id}`);
export const togglePublish = (id) => api.patch(`/api/courses/${id}/publish`);
export const getCourseModules = (id) => api.get(`/api/courses/${id}/modules`);
export const createModule = (id, data) =>
  api.post(`/api/courses/${id}/modules`, data);
export const updateModule = (courseId, contentId, data) =>
  api.put(`/api/courses/${courseId}/modules/${contentId}`, data);
export const deleteModule = (courseId, contentId) =>
  api.delete(`/api/courses/${courseId}/modules/${contentId}`);
export const getCourseEnrollments = (id) =>
  api.get(`/api/courses/${id}/enrollments`);
