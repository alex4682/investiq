import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { usersReducer } from "./users-slice";

export const store = configureStore({
  reducer: {
    user: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = useSelector as TypedUseSelectorHook<RootState>;
