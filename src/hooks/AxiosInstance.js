import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_REACT_SERVER_URL || "http://localhost:7575";

let queue = [];
let isRefreshing = false;

// Lưu trữ store sau khi được import
let storeInstance = null;

// Trì hoãn việc import store để tránh tham chiếu vòng
const getStore = async () => {
  if (storeInstance) return storeInstance;
  
  try {
    // Sử dụng dynamic import thay vì require
    const storeModule = await import("../store");
    storeInstance = storeModule.store;
    return storeInstance;
  } catch (error) {
    console.error("Cannot access store yet:", error);
    return null;
  }
};

const AxiosInstance = (contentType = "application/json") => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL + "/api",
  });

  function processQueue(error, token = null) {
    queue.forEach((request) => {
      if (error) request.reject(error);
      else request.resolve(token);

      queue = [];
    });
  }

  function addToQueue(request) {
    return new Promise((resolve, reject) => {
      queue.push({ resolve, reject });
    })
      .then((token) => {
        request.headers.authorization = `Bearer ${token}`;
        return axiosInstance(request);
      })
      .catch((err) => {
        console.error("Error in request queue:", err);
      });
  }

  axiosInstance.interceptors.request.use(
    async (config) => {
      // Lấy token tại thời điểm request chứ không phải lúc khởi tạo
      const store = await getStore();
      const account = store?.getState()?.account?.account;
      
      if (!config.headers.authorization && account?.token?.accessToken) {
        config.headers.Authorization = `Bearer ${account.token.accessToken}`;
      }

      config.headers["Content-Type"] = contentType;

      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }

      config.headers = {
        ...config.headers,
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      };
      return config;
    },
    (err) => Promise.reject(err)
  );

  axiosInstance.interceptors.response.use(
    (res) => res.data,
    async (err) => {
      console.error("Error in response:", err);
      if (!err.response || !err.response.data) return Promise.reject(err);
      const originalRequest = err.config;

      if (
        err.response?.status === 401 &&
        err.response.data.message === "jwt expired"
      ) {
        if (isRefreshing) return addToQueue(originalRequest);

        isRefreshing = true;
        // Lấy store và token tại thời điểm cần
        const store = await getStore();
        const account = store?.getState()?.account?.account;

        try {
          const res = await axiosInstance.post("/account/renew-token", {
            refreshToken: account?.token?.refreshToken,
          });

          if (res) {
            // Import động để tránh circular dependency
            const { setToken } = await import("../store/slices");
            store?.dispatch(setToken(res.meta));
            
            processQueue(null, res.meta.token.accessToken);
            originalRequest.headers.authorization = `Bearer ${res.meta.token.accessToken}`;
            return await axiosInstance(originalRequest);
          }
        } catch (error) {
          processQueue(error, null);
          console.error("Error renewing token:", error);
          return;
        } finally {
          isRefreshing = false;
        }
      }
      return await Promise.reject(err);
    }
  );

  return axiosInstance;
};

export default AxiosInstance;
