import axios from "axios";

export const cAxios = axios.create({
  baseURL: process.env.BACKEND,
  withCredentials: true,
});
