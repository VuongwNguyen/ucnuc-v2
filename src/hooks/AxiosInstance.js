import axios from "axios";
const clientId = import.meta.env.VITE_PAYOS_CLIENT_ID;
const apiKey = import.meta.env.VITE_PAYOS_API_KEY;
const AxiosInstance = (contentType = "application/json") => {
  const axiosInstance = axios.create({
    baseURL: "https://api-merchant.payos.vn/v2/",
  });
  axiosInstance.interceptors.request.use(
    async (config) => {
      config.headers = {
        Accept: "application/json",
        "x-client-id": clientId,
        "x-api-key": apiKey,
        "x-partner-code": "vuongw0134",
        "Content-Type": contentType,
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
