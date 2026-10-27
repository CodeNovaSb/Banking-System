import axiosInstance from "./axiosInstance";

export const getAllPayments = async () => {
  const response = await axiosInstance.get("/payments");
  return response.data;
};

export const getPaymentsByAccount = async (accountId) => {
  const response = await axiosInstance.get(`/payments/account/${accountId}`);
  return response.data;
};

export const createPayment = async (payment) => {
  const response = await axiosInstance.post("/payments", payment);
  return response.data;
};