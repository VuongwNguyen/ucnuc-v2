import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_REACT_SERVER_URL || "http://localhost:7575";

const AxiosInstance = (contentType = "application/json") => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL + "/api",
  });
  axiosInstance.interceptors.request.use(
    async (config) => {
      config.headers = {
        Accept: "application/json",
        "Content-Type": contentType,
        "ngrok-skip-browser-warning": "true",
      };
      return config;
    },
    (err) => Promise.reject(err)
  );

  axiosInstance.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err)
  );
  return axiosInstance;
};

export default AxiosInstance;
