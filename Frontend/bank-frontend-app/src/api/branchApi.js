import axiosInstance from "./axiosInstance";

export const getAllBranches = async () => {
  const response = await axiosInstance.get("/branches");
  return response.data;
};

export const createBranch = async (branch) => {
  const response = await axiosInstance.post("/branches", branch);
  return response.data;
};

export const updateBranch = async (id, branch) => {
  const response = await axiosInstance.put(`/branches/${id}`, branch);
  return response.data;
};

export const deleteBranch = async (id) => {
  await axiosInstance.delete(`/branches/${id}`);
};