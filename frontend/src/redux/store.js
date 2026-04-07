import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    userLogin: (state = { userInfo: null }) => state,
  },
});

export default store;