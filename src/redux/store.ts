import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { usersReducer } from "./users-slice";
import { goodsReducer } from "./goods-slice";

export const store = configureStore({
  reducer: {
    user: usersReducer,
    goods: goodsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = useSelector as TypedUseSelectorHook<RootState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
