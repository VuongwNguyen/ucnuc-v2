import { createSlice } from "@reduxjs/toolkit";
import {
  getOrdersByID,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  createPayment,
} from "../api";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: {},
    loading: true,
    error: null,
  },
  reducers: {
    cleanUp: (state, action) => {
      state.order = null;
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrdersByID.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOrdersByID.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(getOrdersByID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updatePaymentStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePaymentStatus.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updatePaymentStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(createPayment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPayment.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(createPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { cleanUp } = orderSlice.actions;
