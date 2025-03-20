import { createSlice } from "@reduxjs/toolkit";
import {
  createArea,
  getTables,
  findTable,
  createTable,
  createQRCode,
  updateTable,
} from "../api";

export const tableAreaSlice = createSlice({
  name: "tableArea",
  initialState: {
    curr_table: {},
    tables: [],
    areas: [],
    loading: false,
    err: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(findTable.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(findTable.fulfilled, (state, action) => {
      state.loading = false;
      state.curr_table = action.payload;
    });
    builder.addCase(findTable.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });
  },
});
