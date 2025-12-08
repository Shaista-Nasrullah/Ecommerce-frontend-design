import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/login`,
        credentials
      );
      return data; // This becomes the fulfilled action payload
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      return rejectWithValue(errorMessage);
    }
  }
);

// 2. REGISTER Thunk
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/register`,
        credentials
      );
      return data; // This becomes the fulfilled action payload
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// 3. FETCH USER Thunk
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { getState, rejectWithValue }) => {
    // Use underscore if the first arg isn't needed
    const { auth } = getState();
    const token = auth.token;

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data; // Contains user, roles etc.
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user data.";
      return rejectWithValue(errorMessage);
    }
  }
);

// --- Auth Slice Definition ---

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || "",
    roles: localStorage.getItem("roles") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = "";
      state.roles = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Login states
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.roles = action.payload.roles;
        // Persist to localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("roles", action.payload.roles);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Register states
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.roles = action.payload.roles || null;
        // Persist to localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        if (action.payload.roles) {
          localStorage.setItem("roles", action.payload.roles);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Fetch User states
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Assuming API returns { user: {...} }
        state.roles = action.payload.roles || null;
        // Persist to localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        if (action.payload.roles) {
          localStorage.setItem("roles", action.payload.roles);
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If fetch fails (e.g., invalid token), log the user out
        state.user = null;
        state.token = "";
        state.roles = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
