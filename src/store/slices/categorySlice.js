import { createCategory, fetchCategory, updateCategory } from "../api";
import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: true,
    error: null,
    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
      state.categories.list = [{ id: 0, name: "Tất cả" }, ...action.payload.list];
    });
    builder.addCase(fetchCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
