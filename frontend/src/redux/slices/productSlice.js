import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
      state.error = null;
      state.loading = false;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      state.error = null;
      state.loading = false;
    },
    setProductsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
});

export const {
  setProductsLoading,
  setProducts,
  setSelectedProduct,
  setProductsError,
  clearSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;
