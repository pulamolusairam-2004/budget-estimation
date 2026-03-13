import axios from "axios";
import { tokenStorage } from "@/utils/tokenStorage";

const API_BASE_URL = "http://localhost:5000/api";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

