import { createSlice } from "@reduxjs/toolkit";
import {
  readStoredJson,
  removeStoredValue,
  writeStoredJson,
} from "../../utils/helpers";

const initialState = {
  userInfo: readStoredJson("userInfo", null),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      writeStoredJson("userInfo", action.payload);
    },
    logout: (state) => {
      state.userInfo = null;
      removeStoredValue("userInfo");
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;
