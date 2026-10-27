import axiosInstance from "./axiosInstance";

export const getAllEmployees = async () => {
  const response = await axiosInstance.get("/employees");
  return response.data;
};

export const createEmployee = async (employee) => {
  const response = await axiosInstance.post("/employees", employee);
  return response.data;
};