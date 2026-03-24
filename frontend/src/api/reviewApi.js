import api from "./axios";

export const createReview = (courseId, data) =>
  api.post(`/api/reviews/${courseId}`, data);
export const getReviews = (courseId) => api.get(`/api/reviews/${courseId}`);
export const updateReview = (reviewId, data) =>
  api.put(`/api/reviews/${reviewId}`, data);
export const deleteReview = (reviewId) =>
  api.delete(`/api/reviews/${reviewId}`);
