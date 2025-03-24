import React, { createContext, useReducer, useContext } from "react";
import { toast } from "react-toastify";

// Initial state
const initialState = {
  cartItems: [],
  cartLength: 0, // Tracks total number of items in the cart
  total: 0, // Tracks total cost of items in the cart
};

// Helper function to calculate total cost and length
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

// Cart reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      const {
        name,
        quantity,
        price,
        toppings = [],
        avatar_url,
      } = action.payload;

      // Tìm sản phẩm trong cart có cùng tên và cùng nội dung toppings
      const existingItem = state.cartItems.find(
        (item) =>
          item.name === name &&
          JSON.stringify([...item.toppings].sort()) ===
            JSON.stringify([...toppings].sort())
      );

      if (existingItem) {
        // Nếu đã tồn tại, cập nhật số lượng
        existingItem.quantity += quantity;
        toast.success("Đã điều chỉnh số lượng");
      } else {
        // Nếu không tồn tại, thêm sản phẩm mới
        state.cartItems.push({
          ...action.payload,
        });
        toast.success("Đã thêm vào giỏ hàng");
      }

      // Tính toán lại tổng số lượng và tổng giá trị
      const { cartLength, total } = calculateCartSummary(state.cartItems);

      return {
        ...state,
        cartItems: [...state.cartItems],
        cartLength,
        total,
      };

    case "ADJUST_QUANTITY":
      console.log("ADJUST_QUANTITY", action.payload);
      // Adjust the quantity by delta, ensure quantity doesn't go below 0
      const adjustedCartItems = state.cartItems
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
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity

      const summaryAfterAdjustment = calculateCartSummary(adjustedCartItems);

      toast.success("Đã điều chỉnh số lượng");

      return {
        ...state,
        cartItems: adjustedCartItems,
        ...summaryAfterAdjustment,
      };

    case "REMOVE_ITEM":
      const filteredCartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );

      const summaryAfterRemoval = calculateCartSummary(filteredCartItems);

      return {
        ...state,
        cartItems: filteredCartItems,
        ...summaryAfterRemoval,
      };

    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
        cartLength: 0,
        total: 0,
      };

    default:
      return state;
  }
}

// Create Context
const CartContext = createContext();

// Create a custom hook to use the Cart context
export function useCart() {
  return useContext(CartContext);
}

// CartProvider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // console.log("CartProvider", state);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
