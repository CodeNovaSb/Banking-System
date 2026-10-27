import axiosInstance from "./axiosInstance";

export const getAllCustomers = async () => {
  const response = await axiosInstance.get("/customers");
  return response.data;
};

export const createCustomer = async (customer) => {
  const response = await axiosInstance.post("/customers", customer);
  return response.data;
};

export const updateCustomer = async (id, customer) => {
  const response = await axiosInstance.put(`/customers/${id}`, customer);
  return response.data;
};

export const deleteCustomer = async (id) => {
  await axiosInstance.delete(`/customers/${id}`);
};