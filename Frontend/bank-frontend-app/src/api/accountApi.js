import axiosInstance from "./axiosInstance";

export const getAllAccounts = async () => {
  const response = await axiosInstance.get("/accounts");
  return response.data;
};

export const getAccountsByCustomer = async (customerId) => {
  const response = await axiosInstance.get(`/accounts/customer/${customerId}`);
  return response.data;
};

export const createAccount = async (account) => {
  const response = await axiosInstance.post("/accounts", account);
  return response.data;
};

export const updateAccount = async (id, account) => {
  const response = await axiosInstance.put(`/accounts/${id}`, account);
  return response.data;
};

export const deleteAccount = async (id) => {
  await axiosInstance.delete(`/accounts/${id}`);
};