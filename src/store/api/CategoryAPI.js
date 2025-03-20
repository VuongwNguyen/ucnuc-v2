import AxiosInstance from "../../hooks/AxiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async ({ limit = 1, page = 10 }, { rejectWithValue }) => {
    try {
      const categories = await AxiosInstance().get(
        `/category/category?limit=${limit}&page=${page && page}`
      );
      return categories.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async ({ name, description, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("image", {
        uri: image?.uri,
        type: image?.type,
        name: image?.name,
      });

      const category = await AxiosInstance("multipart/form-data").post(
        `/category/category`,
        formData
      );

      return category.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, name, description, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("image", {
        uri: image?.uri,
        type: image?.type,
        name: image?.name,
      });

      const category = await AxiosInstance("multipart/form-data").put(
        `/category/category`,
        formData
      );

      return category.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
