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
      Cookies.set("admin-access-token", token, { path: "/" });
    },

    logout: (state) => {
      // Remove token for cookies
      Cookies.remove("admin-access-token", { path: "/login" });
      removeFromSessionStorage("admin-access-token");

      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
