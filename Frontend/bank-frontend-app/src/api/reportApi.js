import axiosInstance from "./axiosInstance";

export const getSummary = async () => {
  const response = await axiosInstance.get("/reports/summary");
  return response.data;
};

export const getBranchSummary = async () => {
  const response = await axiosInstance.get("/reports/branch-summary");
  return response.data;
};

export const getRecentTransactions = async () => {
  const response = await axiosInstance.get("/reports/transactions/recent");
  return response.data;
};