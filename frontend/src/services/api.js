import axios from "axios";
import { readStoredJson } from "../utils/helpers";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const userInfo = readStoredJson("userInfo", null);

  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }

  return config;
});

export default API;
