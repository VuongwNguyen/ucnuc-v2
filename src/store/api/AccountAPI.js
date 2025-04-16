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
      console.error("Login error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "account/logout",
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance().post(`/account/logout`, {
        user_id,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
