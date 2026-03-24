import api from "./axios";

export const updateProgress = (data) => api.post("/api/student/progress", data);
export const getProgress = (courseId) =>
  api.get(`/api/student/progress/${courseId}`);
