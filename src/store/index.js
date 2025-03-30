import { configureStore } from "@reduxjs/toolkit";

import * as slice from "./slices";

export const store = configureStore({
  reducer: {
    product: slice.productSlice.reducer,
    category: slice.categorySlice.reducer,
    tableArea: slice.tableAreaSlice.reducer,
    order: slice.orderSlice.reducer,
    account: slice.accountSlice.reducer,
  },
});
