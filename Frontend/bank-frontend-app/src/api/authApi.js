import axiosInstance from "./axiosInstance";

// POST /api/auth/login
// Returns: { role, name, referenceId }
export const loginUser = async (username, password) => {
  const response = await axiosInstance.post("/auth/login", {
    username,
    password,
  });
  return response.data;
};