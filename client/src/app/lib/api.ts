import { Contract, FSMStatus } from "./types";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const register = (data: {
  email: string;
  password: string;
  role: "client" | "admin";
}) => api.post("/auth/register", data);
export const getUser = () => api.get("auth/session");
export const logout = () => api.post("/auth/logout");
export const getContracts = async (id: string): Promise<Contract[]> => {
  const response = await api.get(`/contracts/${id}`);
  return response.data;
};

export const getAllContracts = async (): Promise<Contract[]> => {
  const response = await api.get(`/contracts`);
  return response.data;
};

export const getContract = async (id: string): Promise<Contract> => {
  const response = await api.get(`/contracts/${id}`);
  return response.data;
};

export const createContract = async (data: Omit<Contract, "id" | "status">) => {
  const response = await api.post("/contracts", data);
  return response.data;
};

export const updateContract = async (id: string, data: Partial<Contract>) => {
  const response = await api.patch(`/contracts/${id}`, data);
  return response.data;
};

export const updateContractStatus = async (id: string, status: FSMStatus) => {
  const response = await api.patch(`/contracts/${id}/status`, { status });
  return response.data;
};

export const acceptQuote = async (id: string) => {
  return updateContractStatus(id, "Accepted by Client");
};

export const completePayment = async (id: string) => {
  return updateContractStatus(id, "Payment Completed");
};
