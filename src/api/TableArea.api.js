import AxiosInstance from "../hooks/AxiosInstance";

export const findTable = async (id, callback) => {
  const tables = await AxiosInstance().get(`/table/${id}`);
  callback(tables.meta);
};

export const getTables = async ({ limit = 1, page = 10 }, callback) => {
  const tables = await AxiosInstance().get("/table?page=1&limit=1000");
  callback(tables.meta);
};

export const createQRCode = async ({ origin, ids }, callback) => {
  const qrCode = await AxiosInstance().post("/table/createQRCode", { origin, ids });
  callback(qrCode.meta);
};
