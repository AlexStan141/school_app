import axios from "axios"
import { createAsyncThunk } from "@reduxjs/toolkit"

axios.defaults.baseURL = "http://localhost:3000"

const setAuthHeader = token => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = ''; 
}

export const fetchUsers = createAsyncThunk("users/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("/user/all");
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const getUser = createAsyncThunk("users/me",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get("/user/me");
            return response.data.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const register = createAsyncThunk("user/register",
    async (credentials, thunkAPI) => {
        try {
            const response = await axios.post("/user/register", credentials);
            if(!response.data.data){
                throw({"message": response.data.message}); //trimitem catre catch mesajul de eroare din backend
            }
            setAuthHeader(response.data.data.token); //response.data contine raspunsul din backend
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const login = createAsyncThunk("user/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await axios.post("/user/login", { email, password }); 
            if(!response.data.data){
                throw({"message": response.data.message}); //trimitem catre catch mesajul de eroare din backend
            }               
            setAuthHeader(response.data.data.token); //response.data contine raspunsul din backend
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const logout = createAsyncThunk("user/logout",
    async (_, thunkAPI) => {
        try{
            const response = await axios.post("/user/logout");
            clearAuthHeader();
            return response.data;
        } catch (e){
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const refreshUser = createAsyncThunk("user/refresh",
    async(_, thunkAPI) => {
        const state = thunkAPI.getState();
        const persistedToken = state.users.token;

        if(persistedToken == null){
            return thunkAPI.rejectWithValue("Unable to fetch user");
        }

        try{
            setAuthHeader(persistedToken);
            const res = await axios.get("/user/me");
            return res.data.data;
        } catch(e){
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)