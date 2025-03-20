import AxiosInstance from "../../hooks/AxiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (
    {
      table_name = "",
      payment_method = "",
      order_type = "",
      total = 0,
      order_details = [],
    },
    { rejectWithValue }
  ) => {
    try {
      const order = await AxiosInstance().post("/order/create", {
        table_name,
        payment_method,
        order_type,
        total,
        order_details,
      });
      return order.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrdersByID = createAsyncThunk(
  "order/getOrdersByID",
  async ({ order_id }, { rejectWithValue }) => {
    try {
      const orders = await AxiosInstance().post(`/order/getOrdersByID/`, {
        order_id,
      });
      return orders.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ order_id, status }, { rejectWithValue }) => {
    try {
      const order = await AxiosInstance().put(`/order/updateOrderStatus`, {
        order_id,
        status,
      });
      return order.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  "order/updatePaymentStatus",
  async ({ order_id, payment_status, ref_pay }, { rejectWithValue }) => {
    try {
      const order = await AxiosInstance().put(`/order/updatePaymentStatus`, {
        order_id,
        payment_status,
        ref_pay,
      });
      return order.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPayment = createAsyncThunk(
  "order/createPayment",
  async ({ order_id, amount, items, origin }, { rejectWithValue }) => {
    try {
      const payment = await AxiosInstance().post(`/payment/create`, {
        orderCode: order_id,
        amount,
        items,
        origin,
      });
      return payment.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
