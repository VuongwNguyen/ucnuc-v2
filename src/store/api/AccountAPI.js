import AxiosInstance from "../../hooks/AxiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
  "account/login",
  async ({ email, password, admin = false }, { rejectWithValue }) => {
    try {
      const account = await AxiosInstance().post(`/account/login`, {
        email,
        password,
        admin,
      });
      return account.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
