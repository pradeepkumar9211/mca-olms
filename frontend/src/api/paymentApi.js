import api from "./axios";

export const initiatePayment = (data) =>
  api.post("/api/payments/initiate", data);
export const verifyPayment = (data) => api.post("/api/payments/verify", data);
export const getPaymentHistory = () => api.get("/api/payments/history");
