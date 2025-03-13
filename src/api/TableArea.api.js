import AxiosInstance from "../hooks/AxiosInstance";

export const findTable = async (id, callback) => {
  const tables = await AxiosInstance().get(`/table/${id}`);
  callback(tables.meta);
};

export const getTables = async ({ limit = 1, page = 10 }, callback) => {
  const tables = await AxiosInstance().get("/table/tables?page=1&limit=1000");
  callback(tables.meta);
};

export const getAreas = async ({ page, limit }, callback) => {
  const areas = await AxiosInstance().get("/table/areas");
  callback(areas.meta);
};

export const createQRCode = async ({ origin, ids }, callback) => {
  const qrCode = await AxiosInstance().post("/table/createQRCode", {
    origin,
    ids,
  });
  callback(qrCode.meta);
};

export const createTable = async ({ name, area_id }, callback) => {
  const table = await AxiosInstance().post("/table/createTable", {
    name,
    area_id,
  });
  callback(table.meta);
};

export const createArea = async ({ name }, callback) => {
  const area = await AxiosInstance().post("/table/createArea", {
    name,
  });
  callback(area.meta);
};

export const updateTable = async ({ id, name, area_id }, callback) => {
  const table = await AxiosInstance().put(`/table/updateTable`, {
    id,
    name,
    area_id,
  });
  callback(table.meta);
};
