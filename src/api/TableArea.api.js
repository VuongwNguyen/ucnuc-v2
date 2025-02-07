import AxiosInstance from "../hooks/AxiosInstance";

export const findTable = async (id, callback) => {
  const tables = await AxiosInstance().get(`/table/${id}`);
  callback(tables.meta);
};

export const getTables = async ({ limit = 1, page = 10 }, callback) => {
  const tables = await AxiosInstance().get("/table");
  callback(tables.meta);
};
