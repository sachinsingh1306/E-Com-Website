import { createSlice } from "@reduxjs/toolkit";
import {
  readStoredJson,
  readStoredValue,
  removeStoredValue,
  writeStoredJson,
  writeStoredValue,
} from "../../utils/helpers";

const defaultShippingAddress = {
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

const persistCart = (state) => {
  writeStoredJson("cartItems", state.cartItems);
  writeStoredJson("shippingAddress", state.shippingAddress);
  writeStoredValue("paymentMethod", state.paymentMethod);
};

const initialState = {
  cartItems: readStoredJson("cartItems", []),
  shippingAddress: readStoredJson("shippingAddress", defaultShippingAddress),
  paymentMethod: readStoredValue("paymentMethod", "COD"),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.product === item.product
      );

      if (existingItem) {
        state.cartItems = state.cartItems.map((cartItem) =>
          cartItem.product === item.product ? item : cartItem
        );
      } else {
        state.cartItems.push(item);
      }

      persistCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
      persistCart(state);
    },
    updateCartItemQty: (state, action) => {
      const { productId, qty } = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item.product === productId ? { ...item, qty } : item
      );
      persistCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      persistCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      persistCart(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      persistCart(state);
    },
    resetCheckout: (state) => {
      state.shippingAddress = defaultShippingAddress;
      state.paymentMethod = "COD";
      state.cartItems = [];
      removeStoredValue("cartItems");
      removeStoredValue("shippingAddress");
      removeStoredValue("paymentMethod");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQty,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
  resetCheckout,
} = cartSlice.actions;

export default cartSlice.reducer;
