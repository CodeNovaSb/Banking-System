import axiosInstance from "./axiosInstance";

export const getAllLoans = async () => {
  const response = await axiosInstance.get("/loans");
  return response.data;
};

export const getLoansByCustomer = async (customerId) => {
  const response = await axiosInstance.get(`/loans/customer/${customerId}`);
  return response.data;
};

export const createLoan = async (loan) => {
  const response = await axiosInstance.post("/loans", loan);
  return response.data;
};