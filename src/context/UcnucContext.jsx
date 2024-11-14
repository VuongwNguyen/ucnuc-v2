import React, { createContext, useReducer, useContext } from "react";

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
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { cartLength, total };
};

// Cart reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );

      let updatedCartItems;

      if (existingItem) {
        updatedCartItems = state.cartItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCartItems = [...state.cartItems, { ...action.payload, quantity: 1 }];
      }

      const { cartLength, total } = calculateCartSummary(updatedCartItems);

      return {
        ...state,
        cartItems: updatedCartItems,
        cartLength,
        total,
      };

    case "ADJUST_QUANTITY":
      // Adjust the quantity by delta, ensure quantity doesn't go below 0
      const adjustedCartItems = state.cartItems
        .map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + action.payload.delta),
              }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity

      const summaryAfterAdjustment = calculateCartSummary(adjustedCartItems);

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

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
