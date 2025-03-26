import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, createProduct, updateProduct } from "../api";
import { toast } from "react-toastify";

const calculateCartSummary = (cartItems) => {
  const cartLength = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      parseInt(item.price) * item.quantity +
      item.toppings.reduce((sum, topping) => parseInt(topping.price) + sum, 0),
    0
  );
  return { cartLength, total };
};

export const productSlice = createSlice({
  name: "product",
  initialState: {
    err: null,
    products: [],
    productDetail: {},
    loading: true,
    cart: {
      cartItems: [],
      cartLength: 0,
      total: 0,
    },
  },
  reducers: {
    addToCart: (state, action) => {
      console.log("action", action.payload);

      const {
        name,
        quantity,
        price,
        toppings = [],
        avatar_url,
      } = action.payload;

      const existingItem = state.cart.cartItems.find(
        (item) =>
          item.name === name &&
          JSON.stringify([...item?.toppings].sort()) ===
            JSON.stringify([...toppings].sort())
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.cartItems.push(action.payload);
      }

      const { cartLength, total } = calculateCartSummary(state.cart.cartItems);

      state.cart.cartItems = [...state.cart.cartItems];
      state.cart.cartLength = cartLength;
      state.cart.total = total;
      toast.success("Đã thêm vào giỏ hàng");
    },
    adjustQuantity: (state, action) => {
      const adjustedCartItems = state.cart.cartItems
        .map((item) =>
          item.name === action.payload.name &&
          JSON.stringify([...item?.toppings].sort()) ===
            JSON.stringify([...action.payload.toppings].sort())
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + action.payload.delta),
              }
            : item
        )
        .filter((item) => item.quantity > 0);

      const summaryAfterAdjustment = calculateCartSummary(adjustedCartItems);

      state.cart.cartItems = adjustedCartItems;
      state.cart.cartLength = summaryAfterAdjustment.cartLength;
      state.cart.total = summaryAfterAdjustment.total;
      toast.success("Đã điều chỉnh số lượng");
    },
    removeItem: (state, action) => {
      const filteredCartItems = state.cart.cartItems.filter(
        (item) => item.id !== action.payload.id
      );

      const summaryAfterRemoval = calculateCartSummary(filteredCartItems);

      state.cart.cartItems = filteredCartItems;
      state.cart.cartLength = summaryAfterRemoval.cartLength;
      state.cart.total = summaryAfterRemoval.total;
    },
    clearCart: (state) => {
      state.cart.cartItems = [];
      state.cart.cartLength = 0;
      state.cart.total = 0;
    },
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
export const { addToCart, adjustQuantity, removeItem, clearCart } =
  productSlice.actions;
export default productSlice.reducer;
