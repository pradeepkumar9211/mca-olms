import api from "./axios";

export const addToWishlist = (data) => api.post("/api/student/wishlist", data);
export const getWishlist = () => api.get("/api/student/wishlist");
export const removeFromWishlist = (courseId) =>
  api.delete(`/api/student/wishlist/${courseId}`);
