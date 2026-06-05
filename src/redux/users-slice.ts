import { createSlice } from "@reduxjs/toolkit";
import { addUser, fetchUserByEmail } from "./users-api";
import type { User } from "./users-api";

const user = localStorage.getItem("user");
const initialState = user
  ? { isLoggedIn: true, userData: JSON.parse(user) as User }
  : { isLoggedIn: false, userData: null as User | null };

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: initialState.isLoggedIn,
    userData: initialState.userData,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
    });
    builder.addCase(fetchUserByEmail.fulfilled, (state, action) => {
      if (action.payload) {
        state.isLoggedIn = true;
        state.userData = action.payload;
      }
    });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice;