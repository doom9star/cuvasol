import axios from "axios";

export const cAxios = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  withCredentials: true,
});

export const EMPLOYEE_ADDITIONAL_HOUR = 1;
