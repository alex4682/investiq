import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const api = axios.create({
    baseURL: "https://6a218985b1d0aaf32b4fa7aa.mockapi.io/investiq/",
});

export type NewUser = {
    name: string;
    email: string;
    password: string;
};

export type User = NewUser & {
    id: string;
};

export const fetchUsers = createAsyncThunk<User[], void>("users/fetchUsers", async () => {
    const response = await api.get("/users");
    return response.data;
});

export const fetchUserByEmail = createAsyncThunk<User | undefined, string>(
    "users/fetchUserByEmail",
    async (email) => {
        const response = await api.get("/users", {
            params: { email },
        });
        return response.data[0];
    }
);

export const addUser = createAsyncThunk<User, NewUser>("users/addUser", async (user) => {
    const response = await api.post("/users", user);
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
});