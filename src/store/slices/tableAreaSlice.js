import { createSlice } from "@reduxjs/toolkit";
import {
  createArea,
  getTables,
  findTable,
  createTable,
  createQRCode,
  updateTable,
  getAreas,
  updateArea,
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
    builder.addCase(createTable.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTable.fulfilled, (state, action) => {
      state.loading = false;
      state.tables.push(action.payload);
    });
    builder.addCase(createTable.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });
    builder.addCase(getTables.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTables.fulfilled, (state, action) => {
      state.loading = false;
      state.tables = action.payload.list;
    });
    builder.addCase(getTables.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });
    builder.addCase(createArea.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createArea.fulfilled, (state, action) => {
      state.loading = false;
      state.areas.push(action.payload);
    });
    builder.addCase(createArea.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });
    builder.addCase(createQRCode.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createQRCode.fulfilled, (state, action) => {
      state.loading = false;
      console.log(action.payload);
      // Handle QR code creation success
    });
    builder.addCase(createQRCode.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });
    builder.addCase(updateTable.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTable.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.tables.findIndex(
        (table) => table.id === action.payload.id
      );
      if (index !== -1) state.tables[index] = action.payload;
    });
    builder.addCase(getAreas.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAreas.fulfilled, (state, action) => {
      state.loading = false;
      state.areas = action.payload.list;
    });
    builder.addCase(getAreas.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });
    builder.addCase(updateArea.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateArea.fulfilled, (state, action) => {
      state.loading = false;
      console.log(action.payload);
      const index = state.areas.findIndex(
        (area) => area.id === action.payload.id
      );
      if (index !== -1) state.areas[index] = action.payload;
    });
    builder.addCase(updateArea.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });
  },
});
