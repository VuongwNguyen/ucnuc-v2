import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, createProduct, updateProduct } from "../api";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    err: null,
    products: [],
    productDetail: {},
    loading: true,
    cart : []
  },
  reducers: {
    // addProduct: (state, action) => {
    //   state.cart.push(action.payload);
    // },
    // removeProduct: (state, action) => {
    //   state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    // },
    // updateProduct: (state, action) => {
    //   state.cart = state.cart.map((item) =>
    //     item.id === action.payload.id ? action.payload : item
    //   );
    // },
    // clearCart: (state) => {
    //   state.cart = [];
    //
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });

    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.productDetail = action.payload;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });

    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.productDetail = action.payload;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.err = action.payload;
    });
  },
});
export const {} = productSlice.actions;
