import axiosInstance from "./axiosInstance";

export const getTransactionsByAccount = async (accountId) => {
  const response = await axiosInstance.get(`/transactions/account/${accountId}`);
  return response.data;
};

export const createTransaction = async (transaction) => {
  const response = await axiosInstance.post("/transactions", transaction);
  return response.data;
};