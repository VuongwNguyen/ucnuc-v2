import axios from "axios";
import { store } from "../store";
import { setToken } from "../store/slices";

export const BASE_URL =
  import.meta.env.VITE_REACT_SERVER_URL || "http://localhost:7575";

// Hàm lấy thông tin account từ localStorage
function getAccount() {
  const account = JSON.parse(localStorage.getItem("account")) || null;
  return account;
}

const AxiosInstance = (contentType = "application/json") => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL + "/api",
  });

  // Biến để kiểm soát quá trình làm mới token
  let isRefreshing = false;
  let refreshSubscribers = [];
  let refreshTokenPromise = null; // Promise chung cho việc làm mới token

  // Hàm thông báo token mới cho các request đang đợi
  const onRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      const account = getAccount();
      if (!config.headers.authorization && account?.token?.accessToken) {
        config.headers.authorization = `Bearer ${account.token.accessToken}`;
      }
      config.headers = {
        ...config.headers,
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
    async (err) => {
      const originalRequest = err.config;
      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        err.response.data.message === "jwt expired"
      ) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          // Bắt đầu quá trình làm mới token
          isRefreshing = true;
          console.log("Starting token refresh...");

          refreshTokenPromise = new Promise(async (resolve, reject) => {
            try {
              const account = getAccount();
              const response = await axios.post(
                `${BASE_URL}/api/account/renew-token`,
                {
                  refreshToken: account?.token.refreshToken,
                }
              );

              // Cập nhật localStorage và Redux
              store.dispatch(setToken(response.data.meta));
              console.log(
                "Token refreshed successfully:",
                response.data.meta.token.accessToken
              );

              resolve(response.data.meta.token.accessToken);
            } catch (refreshError) {
              console.error("Refresh token failed:", refreshError);
              localStorage.removeItem("account");
              window.location.href = "/login";
              reject(refreshError);
            } finally {
              isRefreshing = false;
              refreshTokenPromise = null;
            }
          });

          // Thông báo token mới và thử lại request gốc
          refreshTokenPromise
            .then((newAccessToken) => {
              onRefreshed(newAccessToken);
              originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
              return axiosInstance(originalRequest);
            })
            .catch((error) => {
              refreshSubscribers = [];
              return Promise.reject(error);
            });

          return refreshTokenPromise.then((newAccessToken) => {
            originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          });
        }

        // Nếu token đang được làm mới, đợi token mới từ Promise chung
        if (refreshTokenPromise) {
          console.log("Waiting for token refresh...");
          return refreshTokenPromise.then((newAccessToken) => {
            originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          });
        }

        // Nếu không có refreshTokenPromise (trường hợp hiếm), đợi bằng subscribers
        return new Promise((resolve) => {
          refreshSubscribers.push((newAccessToken) => {
            originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
      return Promise.reject(err);
    }
  );

  return axiosInstance;
};

export default AxiosInstance;
