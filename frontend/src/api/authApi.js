import api from "./axios";

export const studentSignup = (data) =>
  api.post("/api/auth/signup", { ...data, role: "student" });
export const instructorSignup = (data) =>
  api.post("/api/auth/signup", { ...data, role: "instructor" });
export const studentSignin = (data) =>
  api.post("/api/auth/signin", { ...data, role: "student" });
export const instructorSignin = (data) =>
  api.post("/api/auth/signin", { ...data, role: "instructor" });
export const adminSignin = (data) => api.post("/api/auth/admin/login", data);
export const getMe = (data) =>
  api.get("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${data}`,
    },
  });
export const changePassword = (data) =>
  api.put("/api/auth/change-password", data);
