import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../api";
import { toast } from "react-toastify";

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    account: localStorage?.getItem("account")
      ? JSON.parse(localStorage?.getItem("account"))
      : null,
    admin: Boolean(localStorage?.getItem("account")),
    loading: false,
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.account = action.payload;
      localStorage.setItem("account", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.account = action.payload;
      state.admin = true;
      localStorage.setItem("account", JSON.stringify(action.payload));
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.account = null;
      state.admin = false;
      localStorage.removeItem("account");
    });

    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setToken } = accountSlice.actions;
