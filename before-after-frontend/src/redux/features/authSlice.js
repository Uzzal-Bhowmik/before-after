import { removeFromSessionStorage } from "@/utils/sessionStorage";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;

      // Set token to cookie for middleware accessibility
      Cookies.set("before-after-story-access-token", token, { path: "/" });
    },

    logout: (state) => {
      // Remove token for cookies
      Cookies.remove("before-after-story-access-token", { path: "/" });

      state.user = null;
      state.token = null;
    },
  },
});

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
