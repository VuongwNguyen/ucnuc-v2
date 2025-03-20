import AxiosInstance from "../../hooks/AxiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const findTable = createAsyncThunk(
  "table/findTable",
  async (id, { rejectWithValue }) => {
    try {
      const tables = await AxiosInstance().get(`/table/findTable?id=${id}`);
      console.log(tables);
      return tables.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTables = createAsyncThunk(
  "table/getTables",
  async ({ limit = 1, page = 10 }, { rejectWithValue }) => {
    try {
      const tables = await AxiosInstance().get(
        `/table/tables?page=${page}&limit=${limit}`
      );
      return tables.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAreas = createAsyncThunk(
  "table/getAreas",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const areas = await AxiosInstance().get(
        `/table/areas?page=${page}&limit=${limit}`
      );
      return areas.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQRCode = createAsyncThunk(
  "table/createQRCode",
  async ({ origin, ids }, { rejectWithValue }) => {
    try {
      const qrCode = await AxiosInstance().post("/table/createQRCode", {
        origin,
        ids,
      });
      return qrCode.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTable = createAsyncThunk(
  "table/createTable",
  async ({ name, area_id }, { rejectWithValue }) => {
    try {
      const table = await AxiosInstance().post("/table/createTable", {
        name,
        area_id,
      });
      return table.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createArea = createAsyncThunk(
  "table/createArea",
  async ({ name }, { rejectWithValue }) => {
    try {
      const area = await AxiosInstance().post("/table/createArea", {
        name,
      });
      return area.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTable = createAsyncThunk(
  "table/updateTable",
  async ({ id, name, area_id }, { rejectWithValue }) => {
    try {
      const table = await AxiosInstance().put(`/table/updateTable`, {
        id,
        name,
        area_id,
      });
      return table.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
