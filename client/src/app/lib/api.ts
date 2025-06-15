import { Contract, FSMStatus } from "./types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://airconcare.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

if (typeof window !== "undefined") {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/register", data);

export const getCurrentUser = () => api.get("/auth/me");

export const logout = () => api.post("/auth/logout");

export const getContracts = async (): Promise<Contract[]> => {
  const response = await api.get("/contracts/all");
  return response.data;
};

export const getAllContracts = async (): Promise<Contract[]> => {
  const response = await api.get(`/contracts/all`);
  return response.data;
};

export const getContract = async (id: string): Promise<Contract> => {
  const response = await api.get(`/contracts/all`);
  return response.data;
};

export const createContract = async (data: Omit<Contract, "id" | "status">) => {
  const response = await api.post("/contracts/create", data);
  return response.data;
};

export const updateContract = async (id: string, data: Partial<Contract>) => {
  const response = await api.patch(`/contracts/${id}`, data);
  return response.data;
};

export const updateContractStatus = async (id: string, status: FSMStatus) => {
  const response = await api.put(`/admin/${id}/status`, { status });
  return response.data;
};

export const acceptQuote = async (id: string) => {
  return updateContractStatus(id, "Accepted by Client");
};

export const completePayment = async (id: string) => {
  return updateContractStatus(id, "Payment Completed");
};

export const getAdminContracts = async () => {
  const response = await api.get("/admin/contracts");
  return response.data;
};
