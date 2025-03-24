import AxiosInstance from "../../hooks/AxiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (
    { limit = 1, page = 10, category_id = 0, keyword = "" },
    { rejectWithValue }
  ) => {
    try {
      const products = await AxiosInstance().get(
        `/product/product?limit=${limit}&page=${page && page}&category_id=${
          category_id && category_id
        }&keyword=${keyword && keyword}`
      );
      return products.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (
    {
      name,
      description,
      image,
      price,
      discount,
      category_id,
      flavor,
      skus = [],
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("image", {
        uri: image?.uri,
        type: image?.type,
        name: image?.name,
      });
      formData.append("category_id", category_id);
      formData.append("price", price);
      formData.append("sale_price", discount);
      formData.append("type", flavor);
      skus.forEach((sku, index) => {
        Object.keys(sku).forEach((key) => {
          formData.append(`skus[${index}][${key}]`, sku[key]);
        });
      });

      const product = await AxiosInstance("multipart/form-data").post(
        `/product/product`,
        formData
      );

      return product.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (
    {
      id,
      name,
      description,
      image,
      price,
      discount,
      category_id,
      flavor,
      skus = [],
    },
    { rejectWithValue }
  ) => {
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
      formData.append("category_id", category_id);
      formData.append("price", price);
      formData.append("sale_price", discount);
      formData.append("type", flavor);
      skus.forEach((sku, index) => {
        Object.keys(sku).forEach((key) => {
          formData.append(`skus[${index}][${key}]`, sku[key]);
        });
      });

      const product = await AxiosInstance("multipart/form-data").put(
        `/product/product`,
        formData
      );
      return product.meta;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
